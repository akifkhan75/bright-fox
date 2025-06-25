
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { VideoCameraIcon } from '@heroicons/react/24/solid';
import { Course, Lesson, View } from '../types'; // Import View

const LiveClassPlaceholderScreen: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const { courseId, lessonId } = location.state as { courseId?: string; lessonId?: string } || {};

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
    if(courseId) {
        context.setViewWithPath(View.KidLearningPathView, '/kidlearningpathview', {state: {courseId}});
    } else {
        context.setViewWithPath(View.KidHome, '/kidhome');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 min-h-full flex flex-col items-center justify-center text-white">
      <Card className="max-w-md w-full text-center !bg-white/10 !backdrop-blur-md">
        <VideoCameraIcon className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
        
        <h1 className="text-3xl font-bold font-display mb-3">Joining Live Class...</h1>
        
        {lesson && course && (
            <div className="mb-6 text-sm opacity-90">
                <p><strong>Course:</strong> {course.title}</p>
                <p><strong>Lesson:</strong> {lesson.title}</p>
                {lesson.content.liveSessionDetails?.dateTime && (
                    <p>Scheduled for: {new Date(lesson.content.liveSessionDetails.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                )}
            </div>
        )}

        <LoadingSpinner text="Connecting to your teacher..." className="!text-white child:!text-white" />

        <p className="text-xs opacity-80 mt-6 mb-4">
          Please wait a moment. Your teacher will start the class soon!
          <br/>
          (This is a placeholder. In a real app, Zoom/Jitsi would launch.)
        </p>

        <Button 
          onClick={handleLeave} 
          variant="ghost"
          className="!text-white !border-white/50 hover:!bg-white/20"
        >
          Leave Class
        </Button>
      </Card>
    </div>
  );
};

export default LiveClassPlaceholderScreen;
