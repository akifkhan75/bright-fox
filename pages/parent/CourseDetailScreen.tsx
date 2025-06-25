
import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { UserRole, Course, TeacherProfile, Lesson, View, Review, LessonContentType, KidProfile } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AcademicCapIcon, ClockIcon, UsersIcon, StarIcon, CheckCircleIcon, PlayCircleIcon, InformationCircleIcon, CurrencyDollarIcon, VideoCameraIcon, BookOpenIcon, PuzzlePieceIcon, PencilIcon } from '@heroicons/react/24/solid';

const CourseDetailScreen: React.FC = () => {
  const context = useContext(AppContext);
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false); // For enrollment action
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  if (!context || !context.appState.currentUserRole) { 
    return <div className="p-4 text-center">Loading...</div>;
  }
  const { allCourses, allTeacherProfiles, setViewWithPath, enrollInCourse, kidProfile, addReview, allReviews, appState } = context;

  const course = allCourses.find(c => c.id === courseId);
  const teacher = course ? allTeacherProfiles.find(t => t.id === course.teacherId) : undefined;
  
  const courseReviews = allReviews.filter(r => r.courseId === courseId);


  if (!course || !teacher) {
    return (
      <div className="p-4 md:p-6 text-center">
        <LoadingSpinner text="Loading course details..." />
        <p className="mt-4 text-gray-600">If this persists, the course might not be available.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  // V6: Check if the *active* kid (if parent is viewing as kid or has an active kid selected) is enrolled.
  // Or, if parent is viewing generally, check if ANY of their kids are enrolled.
  // For simplicity here, we'll check based on the 'active' kidProfile if role is Parent.
  const isKidActuallyEnrolled = appState.currentUserRole === UserRole.Parent && kidProfile ? 
    kidProfile.enrolledCourseIds?.includes(course.id) : false;
    
  // A more robust check for parent to review:
  const parentCanReview = appState.currentUserRole === UserRole.Parent && 
    appState.kidProfiles.some(kp => kp.parentId === appState.currentParentProfileId && kp.enrolledCourseIds?.includes(course.id));


  const handleEnroll = async () => {
    if (!kidProfile) { // This kidProfile is the *active* one
        alert("Please select or create a kid profile to enroll. You can do this from your Parent Dashboard.");
        setViewWithPath(View.ParentDashboard, '/parentdashboard');
        return;
    }
    setIsLoading(true);
    const success = await enrollInCourse(kidProfile.id, course.id);
    setIsLoading(false);
    if (success) {
      setViewWithPath(View.KidLearningPathView, `/kidlearningpathview`, {state: {courseId: course.id}});
    } else {
      alert("Enrollment failed. Please try again.");
    }
  };
  
  const handleWriteReview = () => {
    if (!newReviewText.trim() || !appState.currentParentProfileId) { 
        alert("Please write your review and ensure you're logged in as a parent.");
        return;
    }
    setIsSubmittingReview(true);
    const reviewData: Review = {
        id: `review_${Date.now()}`,
        parentId: appState.currentParentProfileId, 
        parentName: "A Parent (Mock)", // Mock parent name
        teacherId: teacher.id,
        courseId: course.id,
        rating: newReviewRating,
        comment: newReviewText,
        timestamp: Date.now(),
    };
    addReview(reviewData);
    setTimeout(() => { 
        setIsSubmittingReview(false);
        setNewReviewText("");
        setNewReviewRating(5);
        alert("Review submitted! Thank you.");
    }, 500);
  };

  const getLessonIcon = (contentType: LessonContentType) => {
    switch (contentType) {
      case LessonContentType.Video: return <VideoCameraIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0"/>;
      case LessonContentType.LiveSessionLink: return <VideoCameraIcon className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0"/>;
      case LessonContentType.InteractiveQuiz: case LessonContentType.Game: case LessonContentType.Puzzle: return <PuzzlePieceIcon className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0"/>;
      case LessonContentType.DrawingChallenge: return <PencilIcon className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0"/>;
      default: return <BookOpenIcon className="h-5 w-5 mr-2 text-sky-500 flex-shrink-0"/>;
    }
  };


  return (
    <div className="p-0 sm:p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="max-w-2xl mx-auto !rounded-none sm:!rounded-xl !shadow-none sm:!shadow-xl">
        <img src={course.imageUrl || `https://picsum.photos/seed/${course.id}/600/300`} alt={course.title} className="w-full h-48 sm:h-64 object-cover sm:rounded-t-lg mb-4"/>
        
        <div className="px-4 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">{course.title}</h1>
            
            <div className="flex items-center mb-3 cursor-pointer" onClick={() => setViewWithPath(View.TeacherProfileView, `/teacherprofileview/${teacher.id}`)}>
                <img src={teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/50/50`} alt={teacher.name} className="w-10 h-10 rounded-full mr-2 object-cover"/>
                <div>
                    <p className="text-sm font-semibold text-indigo-600 hover:underline">{teacher.name}</p>
                    <p className="text-xs text-gray-500">{teacher.subjects?.join(', ')} Specialist</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mb-4">
                <span className="flex items-center"><AcademicCapIcon className="h-4 w-4 mr-1 text-indigo-500"/> Subject: {course.subject}</span>
                <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1 text-indigo-500"/> Ages: {course.ageGroups.join(', ')}</span>
                <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1 text-indigo-500"/> Duration: {course.durationWeeks} weeks</span>
                 <span className="flex items-center"><StarIcon className="h-4 w-4 mr-1 text-amber-500"/> Rating: {course.ratingAverage?.toFixed(1) || 'New'} ({course.ratingCount || 0})</span>
            </div>

            <p className={`text-sm text-gray-700 mb-2 ${!showFullDescription && 'line-clamp-3'}`}>
                {course.description}
            </p>
            {course.description.length > 150 && ( 
                 <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-xs text-indigo-500 hover:underline mb-3">
                    {showFullDescription ? 'Show Less' : 'Show More'}
                </button>
            )}
            
            <Card className="!bg-indigo-50 !p-4 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        {course.priceOneTime && <p className="text-xl font-bold text-indigo-700">${course.priceOneTime} <span className="text-xs font-normal">one-time</span></p>}
                        {course.priceMonthly && <p className="text-lg font-semibold text-indigo-600">${course.priceMonthly} <span className="text-xs font-normal">/month</span></p>}
                        {!course.priceOneTime && !course.priceMonthly && <p className="text-lg font-semibold text-green-600">Free</p>}
                    </div>
                    {appState.currentUserRole === UserRole.Parent && (
                        isKidActuallyEnrolled ? ( // Use isKidActuallyEnrolled
                            <Button 
                                onClick={() => setViewWithPath(View.KidLearningPathView, `/kidlearningpathview`, {state: {courseId: course.id}})}
                                className="!bg-green-500 mt-2 sm:mt-0"
                            >
                                <CheckCircleIcon className="h-5 w-5 mr-1 inline"/> Go to Learning Path
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleEnroll} 
                                disabled={isLoading}
                                className="!bg-orange-500 hover:!bg-orange-600 mt-2 sm:mt-0"
                            >
                                {isLoading ? <LoadingSpinner size="sm" /> : <><CurrencyDollarIcon className="h-5 w-5 mr-1 inline"/> Enroll {kidProfile?.name || 'Child'}</>}
                            </Button>
                        )
                    )}
                </div>
                {appState.currentUserRole !== UserRole.Parent && !isKidActuallyEnrolled && (
                    <p className="text-xs text-gray-500 mt-2">Parents can enroll their children in this course.</p>
                )}
            </Card>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What you'll learn (Lessons):</h3>
                <ul className="space-y-1.5">
                {course.lessons.map(lesson => (
                    <li key={lesson.id} className="p-2 bg-gray-50 rounded-md flex items-center">
                        {getLessonIcon(lesson.contentType)}
                        <span className="text-sm text-gray-700">{lesson.title}</span>
                    </li>
                ))}
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Parent Reviews ({courseReviews.length})</h3>
                {courseReviews.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {courseReviews.map(review => (
                        <Card key={review.id} className="!p-3 !bg-slate-50 !shadow-sm">
                        <div className="flex items-center mb-1">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`}/>)}
                            <span className="ml-2 text-sm font-semibold text-gray-700">{review.parentName || "A Parent"}</span>
                        </div>
                        <p className="text-xs text-gray-600">{review.comment}</p>
                        <p className="text-[10px] text-gray-400 mt-1 text-right">{new Date(review.timestamp).toLocaleDateString()}</p>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No reviews for this course yet. Be the first!</p>
                )}
            </div>
            
            {parentCanReview && ( // V6: Use parentCanReview
                <Card className="!bg-slate-100 !p-3">
                    <h4 className="text-md font-semibold text-gray-700 mb-1">Write a Review for {course.title}:</h4>
                    <div className="flex mb-2">
                        {[1,2,3,4,5].map(star => (
                            <StarIcon key={star} className={`h-6 w-6 cursor-pointer ${star <= newReviewRating ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'}`} onClick={() => setNewReviewRating(star as 1|2|3|4|5)}/>
                        ))}
                    </div>
                    <textarea 
                        value={newReviewText} 
                        onChange={e => setNewReviewText(e.target.value)}
                        rows={2} 
                        placeholder={`Share your experience with ${course.title}...`}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <Button onClick={handleWriteReview} disabled={isSubmittingReview || !newReviewText.trim()} size="sm" className="mt-2">
                        {isSubmittingReview ? <LoadingSpinner size="sm"/> : "Submit Review"}
                    </Button>
                </Card>
            )}

        </div>
      </Card>
    </div>
  );
};

export default CourseDetailScreen;
