import React, { useContext, useMemo } from 'react';
import { View as RNView, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../App';
import { UserRole, Course, Lesson, View, LessonContentType } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BookOpenIcon, VideoCameraIcon, CheckCircleIcon, PlayCircleIcon, PuzzlePieceIcon, PencilIcon } from 'react-native-heroicons/solid';

const KidLearningPathScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  const focusedCourseId = navigation.getParam('courseId');

  if (!context || !context.kidProfile || !context.kidCourseProgressMap || context.appState.currentUserRole !== UserRole.Kid) {
    return (
      <RNView style={styles.loadingContainer}>
        <Text>Loading learning path or not authorized...</Text>
      </RNView>
    );
  }

  const { kidProfile, allCourses, kidCourseProgressMap, setViewWithPath, updateLessonProgress } = context;

  const enrolledCourses: Course[] = useMemo(() => {
    return (kidProfile.enrolledCourseIds || [])
      .map(courseId => allCourses.find(c => c.id === courseId))
      .filter(Boolean) as Course[];
  }, [kidProfile.enrolledCourseIds, allCourses]);

  const getLessonIcon = (contentType: LessonContentType) => {
    switch (contentType) {
      case LessonContentType.Video: return <VideoCameraIcon size={20} color="#ef4444" style={styles.icon}/>;
      case LessonContentType.LiveSessionLink: return <VideoCameraIcon size={20} color="#a855f7" style={styles.icon}/>;
      case LessonContentType.InteractiveQuiz: 
      case LessonContentType.Game: return <PuzzlePieceIcon size={20} color="#eab308" style={styles.icon}/>;
      case LessonContentType.DrawingChallenge: return <PencilIcon size={20} color="#f97316" style={styles.icon}/>;
      default: return <BookOpenIcon size={20} color="#0ea5e9" style={styles.icon}/>;
    }
  };
  
  const handleContinueLesson = (course: Course, lesson: Lesson) => {
    updateLessonProgress(kidProfile.id, course.id, lesson.id);

    if (lesson.contentType === LessonContentType.LiveSessionLink) {
      setViewWithPath(View.LiveClassPlaceholderView, '/liveclassplaceholderview', {
        courseId: course.id, 
        lessonId: lesson.id
      });
    } else if (lesson.contentType === LessonContentType.Game && 
               course.lessons.find(l => l.id === lesson.id)?.content?.title?.toLowerCase().includes("count")) {
      setViewWithPath(View.CountingGameScreen, '/countinggamescreen');
    } else {
      alert(`Continuing lesson: "${lesson.title}" from course "${course.title}"`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <RNView style={styles.header}>
        <BookOpenIcon size={48} color="#9333ea" style={styles.headerIcon}/>
        <Text style={styles.title}>My Learning Path</Text>
        <Text style={styles.subtitle}>Keep up the great work, {kidProfile.name}!</Text>
      </RNView>

      {enrolledCourses.length === 0 && (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>You're not enrolled in any courses yet.</Text>
          <Text style={styles.emptySubtext}>Ask a parent to help you find some exciting courses to start learning!</Text>
        </Card>
      )}

      {enrolledCourses.map(course => {
        const progress = kidCourseProgressMap[`${kidProfile.id}_${course.id}`];
        const completedLessonsCount = progress?.completedLessonIds?.length || 0;
        const totalLessons = course.lessons.length;
        const courseProgressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
        const nextLessonIndex = progress?.currentLessonIndex !== undefined && progress.currentLessonIndex < totalLessons ? progress.currentLessonIndex : -1;
        const nextLesson = nextLessonIndex !== -1 ? course.lessons[nextLessonIndex] : null;
        
        const upcomingLiveLesson = course.lessons.find(l => 
          l.contentType === LessonContentType.LiveSessionLink && 
          l.content.liveSessionDetails && 
          l.content.liveSessionDetails.dateTime > Date.now() &&
          (!progress || !progress.completedLessonIds.includes(l.id))
        );

        return (
          <Card 
            key={course.id} 
            style={[
              styles.courseCard,
              focusedCourseId === course.id && styles.focusedCourse
            ]}
          >
            <RNView style={styles.courseHeader}>
              <RNView>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.teacherText}>
                  Taught by: {context.allTeacherProfiles.find(t => t.id === course.teacherId)?.name || 'Teacher'}
                </Text>
              </RNView>
              {courseProgressPercentage === 100 && (
                <Text style={styles.completedBadge}>Completed! 🎉</Text>
              )}
            </RNView>
            
            {/* Progress Bar */}
            <RNView style={styles.progressBarBackground}>
              <RNView 
                style={[
                  styles.progressBarFill,
                  { width: `${courseProgressPercentage}%` }
                ]}
              />
            </RNView>
            <Text style={styles.progressText}>{completedLessonsCount} / {totalLessons} lessons completed</Text>

            {upcomingLiveLesson && upcomingLiveLesson.content.liveSessionDetails && (
              <RNView style={styles.liveLessonBanner}>
                <VideoCameraIcon size={20} color="#9333ea" style={styles.liveIcon}/>
                <Text style={styles.liveLessonText}>
                  Next Live Class: <Text style={styles.boldText}>{upcomingLiveLesson.title}</Text> on {new Date(upcomingLiveLesson.content.liveSessionDetails.dateTime).toLocaleDateString()} at {new Date(upcomingLiveLesson.content.liveSessionDetails.dateTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </Text>
              </RNView>
            )}

            <Text style={styles.lessonsTitle}>Lessons:</Text>
            <RNView style={styles.lessonsList}>
              {course.lessons.map((lesson, index) => {
                const isCompleted = progress?.completedLessonIds?.includes(lesson.id);
                const isNext = index === nextLessonIndex;
                
                return (
                  <RNView 
                    key={lesson.id} 
                    style={[
                      styles.lessonItem,
                      isCompleted ? styles.completedLesson : 
                      isNext ? styles.nextLesson : styles.defaultLesson
                    ]}
                  >
                    <RNView style={styles.lessonContent}>
                      {isCompleted ? (
                        <CheckCircleIcon size={20} color="#22c55e" style={styles.icon}/>
                      ) : (
                        getLessonIcon(lesson.contentType)
                      )}
                      <Text style={[
                        styles.lessonText,
                        isCompleted && styles.completedLessonText
                      ]}>
                        {lesson.title}
                      </Text>
                    </RNView>
                    {!isCompleted && (
                      <Button 
                        onPress={() => handleContinueLesson(course, lesson)}
                        style={[
                          styles.lessonButton,
                          isNext && styles.nextLessonButton
                        ]}
                        textStyle={styles.buttonText}
                      >
                        {isNext && <PlayCircleIcon size={16} color="white" style={styles.buttonIcon}/>}
                        {isNext ? 'Start' : 'View'}
                      </Button>
                    )}
                  </RNView>
                );
              })}
            </RNView>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf5ff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6b21a8',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  courseCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  focusedCourse: {
    borderWidth: 2,
    borderColor: '#9333ea',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b21a8',
  },
  teacherText: {
    fontSize: 12,
    color: '#6b7280',
  },
  completedBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 7,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9333ea',
    borderRadius: 7,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 12,
  },
  liveLessonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    marginBottom: 12,
  },
  liveIcon: {
    marginRight: 8,
  },
  liveLessonText: {
    fontSize: 14,
    color: '#6b21a8',
    flex: 1,
  },
  boldText: {
    fontWeight: '600',
  },
  lessonsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  lessonsList: {
    maxHeight: 240,
  },
  lessonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  defaultLesson: {
    backgroundColor: '#f9fafb',
  },
  nextLesson: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  completedLesson: {
    backgroundColor: '#f0fdf4',
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  lessonText: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  completedLessonText: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  lessonButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  nextLessonButton: {
    backgroundColor: '#9333ea',
  },
  buttonText: {
    fontSize: 14,
    color: '#1f2937',
  },
  buttonIcon: {
    marginRight: 4,
  },
});

export default KidLearningPathScreen;