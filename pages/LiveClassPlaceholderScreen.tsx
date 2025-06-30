import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppContext } from '../App';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
// import { VideoCameraIcon } from './icons'; // You'll need to create or import this icon
import { Course, Lesson, View as ViewType } from '../types';

const LiveClassPlaceholderScreen: React.FC<{ route?: any }> = ({ route }) => {
  const context = useContext(AppContext);
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  // Get params from navigation route
  const { courseId, lessonId } = route?.params || {};

  useEffect(() => {
    if (context && courseId && lessonId) {
      const foundCourse = context.allCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        const foundLesson = foundCourse.lessons.find(l => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
        } else {
          console.error("Lesson not found for live class.");
        }
      } else {
        console.error("Course not found for live class.");
      }
    }
  }, [context, courseId, lessonId]);

  if (!context) return <LoadingSpinner text="Loading..." />;

  const handleLeave = () => {
    // Navigate back to learning path or kid home
    if (courseId) {
      context.setViewWithPath(ViewType.KidLearningPathView, '/kidlearningpathview', { state: { courseId } });
    } else {
      context.setViewWithPath(ViewType.KidHome, '/kidhome');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* <VideoCameraIcon style={styles.videoIcon} /> */}
        <Text>Video Cam Icon</Text>
        
        <Text style={styles.title}>Joining Live Class...</Text>
        
        {lesson && course && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Course:</Text> {course.title}</Text>
            <Text style={styles.detailText}><Text style={styles.detailLabel}>Lesson:</Text> {lesson.title}</Text>
            {lesson.content.liveSessionDetails?.dateTime && (
              <Text style={styles.detailText}>
                Scheduled for: {new Date(lesson.content.liveSessionDetails.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
        )}

        <LoadingSpinner 
          text="Connecting to your teacher..." 
          style={styles.spinner}
          textStyle={styles.spinnerText}
        />

        <Text style={styles.noteText}>
          Please wait a moment. Your teacher will start the class soon!
          {'\n'}
          (This is a placeholder. In a real app, Zoom/Jitsi would launch.)
        </Text>

        <Button 
          onPress={handleLeave} 
          style={styles.leaveButton}
          textStyle={styles.leaveButtonText}
        >
          Leave Class
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ec4899', // pink-500 as base for gradient
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: 400,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  videoIcon: {
    width: 64,
    height: 64,
    color: 'white',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  spinner: {
    marginVertical: 24,
  },
  spinnerText: {
    color: 'white',
  },
  noteText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  leaveButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  leaveButtonText: {
    color: 'white',
  },
});

export default LiveClassPlaceholderScreen;