
import React, { useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../App';
import { UserRole, Course, Lesson, View, LessonContentType } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BookOpenIcon, VideoCameraIcon, CheckCircleIcon, PlayCircleIcon, PuzzlePieceIcon, PencilIcon } from '@heroicons/react/24/solid';

const KidLearningPathScreen: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation(); // To get focused courseId if passed in state

  const focusedCourseId = location.state?.courseId as string | undefined;

  if (!context || !context.kidProfile || !context.kidCourseProgressMap || context.appState.currentUserRole !== UserRole.Kid) {
    return <div className="p-4 text-center">Loading learning path or not authorized...</div>;
  }
  const { kidProfile, allCourses, kidCourseProgressMap, setViewWithPath, updateLessonProgress } = context;

  const enrolledCourses: Course[] = useMemo(() => {
    return (kidProfile.enrolledCourseIds || [])
      .map(courseId => allCourses.find(c => c.id === courseId))
      .filter(Boolean) as Course[];
  }, [kidProfile.enrolledCourseIds, allCourses]);

  const getLessonIcon = (contentType: LessonContentType) => {
    switch (contentType) {
      case LessonContentType.Video: return <VideoCameraIcon className="h-5 w-5 mr-2 text-red-500"/>;
      case LessonContentType.LiveSessionLink: return <VideoCameraIcon className="h-5 w-5 mr-2 text-purple-500"/>;
      case LessonContentType.InteractiveQuiz: case LessonContentType.Game: return <PuzzlePieceIcon className="h-5 w-5 mr-2 text-yellow-500"/>;
      case LessonContentType.DrawingChallenge: return <PencilIcon className="h-5 w-5 mr-2 text-orange-500"/>;
      default: return <BookOpenIcon className="h-5 w-5 mr-2 text-sky-500"/>;
    }
  };
  
  const handleContinueLesson = (course: Course, lesson: Lesson) => {
    // Navigate to the lesson content. This is highly simplified.
    // A real app would have a generic lesson player view or specific views per content type.
    updateLessonProgress(kidProfile.id, course.id, lesson.id);

    if (lesson.contentType === LessonContentType.LiveSessionLink) {
        setViewWithPath(View.LiveClassPlaceholderView, '/liveclassplaceholderview', {state: {courseId: course.id, lessonId: lesson.id}});
    } else if (lesson.contentType === LessonContentType.Game && course.lessons.find(l => l.id === lesson.id)?.content?.title?.toLowerCase().includes("count")) {
        setViewWithPath(View.CountingGameScreen, '/countinggamescreen'); // Example redirect
    } else {
        alert(`Continuing lesson: "${lesson.title}" from course "${course.title}" (Content Player Mock)`);
        // Example: setViewWithPath(View.LessonPlayer, `/lesson/${lesson.id}`);
    }
  };


  return (
    <div className="p-4 md:p-6 bg-purple-50 min-h-full">
      <div className="text-center mb-6">
        <BookOpenIcon className="h-12 w-12 text-purple-600 mx-auto mb-3"/>
        <h1 className="text-3xl font-bold text-purple-700 font-display">My Learning Path</h1>
        <p className="text-gray-600">Keep up the great work, {kidProfile.name}!</p>
      </div>

      {enrolledCourses.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-lg text-gray-700 font-semibold">You're not enrolled in any courses yet.</p>
          <p className="text-gray-500 mt-2">Ask a parent to help you find some exciting courses to start learning!</p>
          {/* Button to go to course discovery for parent? Or communicate to parent. */}
        </Card>
      )}

      {enrolledCourses.map(course => {
        const progress = kidCourseProgressMap[`${kidProfile.id}_${course.id}`];
        const completedLessonsCount = progress?.completedLessonIds?.length || 0;
        const totalLessons = course.lessons.length;
        const courseProgressPercentage = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
        const nextLessonIndex = progress?.currentLessonIndex !== undefined && progress.currentLessonIndex < totalLessons ? progress.currentLessonIndex : -1;
        const nextLesson = nextLessonIndex !== -1 ? course.lessons[nextLessonIndex] : null;
        
        // Find next upcoming live lesson for this course
        const upcomingLiveLesson = course.lessons.find(l => 
            l.contentType === LessonContentType.LiveSessionLink && 
            l.content.liveSessionDetails && 
            l.content.liveSessionDetails.dateTime > Date.now() &&
            (!progress || !progress.completedLessonIds.includes(l.id))
        );


        return (
          <Card key={course.id} className={`mb-6 shadow-lg ${focusedCourseId === course.id ? 'ring-2 ring-purple-500' : ''}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <div>
                    <h2 className="text-xl font-semibold text-purple-700">{course.title}</h2>
                    <p className="text-xs text-gray-500">Taught by: {context.allTeacherProfiles.find(t => t.id === course.teacherId)?.name || 'Teacher'}</p>
                </div>
                {courseProgressPercentage === 100 && <span className="text-sm font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-2 sm:mt-0">Completed! 🎉</span>}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3.5 mb-1">
              <div 
                className="bg-purple-500 h-3.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${courseProgressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-right mb-3">{completedLessonsCount} / {totalLessons} lessons completed</p>

            {upcomingLiveLesson && upcomingLiveLesson.content.liveSessionDetails && (
                 <div className="p-2 bg-purple-100 rounded-md mb-3 text-sm text-purple-700">
                    <VideoCameraIcon className="h-5 w-5 inline mr-1"/>
                    Next Live Class: <strong>{upcomingLiveLesson.title}</strong> on {new Date(upcomingLiveLesson.content.liveSessionDetails.dateTime).toLocaleDateString()} at {new Date(upcomingLiveLesson.content.liveSessionDetails.dateTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </div>
            )}

            <h4 className="text-md font-medium text-gray-700 mb-2">Lessons:</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {course.lessons.map((lesson, index) => {
                const isCompleted = progress?.completedLessonIds?.includes(lesson.id);
                const isNext = index === nextLessonIndex;
                return (
                  <li key={lesson.id} className={`p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      isCompleted ? 'bg-green-50' : (isNext ? 'bg-purple-50 ring-1 ring-purple-300' : 'bg-gray-50 hover:bg-gray-100')
                    }`}
                  >
                    <div className="flex items-center">
                      {isCompleted ? <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0"/> : getLessonIcon(lesson.contentType)}
                      <span className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{lesson.title}</span>
                    </div>
                    {!isCompleted && (
                      <Button 
                        size="sm" 
                        onClick={() => handleContinueLesson(course, lesson)}
                        className={`!py-1 !px-2.5 ${isNext ? '!bg-purple-500 hover:!bg-purple-600' : '!bg-gray-300 hover:!bg-gray-400 !text-gray-700'}`}
                      >
                        {isNext ? <PlayCircleIcon className="h-4 w-4 mr-1 inline"/> : ''}
                        {isNext ? 'Start' : 'View'}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        );
      })}
    </div>
  );
};

export default KidLearningPathScreen;
