
import React, { useContext, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { UserRole, TeacherProfile, Course, View, Review, ActivityStatus } from '../../types'; 
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AcademicCapIcon, StarIcon, ShieldCheckIcon, PencilIcon, BookOpenIcon, PlusCircleIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid'; 

const TeacherProfileViewScreen: React.FC = () => {
  const context = useContext(AppContext);
  const { teacherId } = useParams<{ teacherId: string }>();
  const location = useLocation(); 
  const navigate = useNavigate();

  const isEditingOwnProfile = location.state?.isEditing === true && context?.appState.currentUserRole === UserRole.Teacher && context?.teacherProfile?.id === teacherId;

  const [editBio, setEditBio] = useState('');

  if (!context) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  const { allTeacherProfiles, allCourses, setViewWithPath, appState, addReview, startOrGoToChat } = context;

  const teacher = allTeacherProfiles.find(t => t.id === teacherId);
  const coursesByThisTeacher = teacher ? allCourses.filter(c => c.teacherId === teacher.id && c.status === ActivityStatus.Active) : [];
  const reviewsForThisTeacher = teacher ? context.allReviews.filter(r => r.teacherId === teacher.id && !r.courseId) : []; 

  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  React.useEffect(() => {
    if (isEditingOwnProfile && teacher) {
        setEditBio(teacher.bio || '');
    }
  }, [isEditingOwnProfile, teacher]);


  if (!teacher) {
    return (
      <div className="p-4 md:p-6 text-center">
        <LoadingSpinner text="Loading teacher details..." />
        <p className="mt-4 text-gray-600">Teacher not found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  const handleSaveProfileChanges = () => {
    if (!isEditingOwnProfile || !context.teacherProfile) return;
    const updatedTeacher = {...context.teacherProfile, bio: editBio};
    alert("Profile changes saved (mock)!");
  };

  const handleWriteTeacherReview = () => {
     if (!newReviewText.trim() || !appState.currentParentProfileId) {
        alert("Please write your review and ensure you're logged in as a parent.");
        return;
    }
    setIsSubmittingReview(true);
    const reviewData: Review = {
        id: `review_teacher_${Date.now()}`,
        parentId: appState.currentParentProfileId, 
        parentName: "A Parent (Mock)", 
        teacherId: teacher.id,
        rating: newReviewRating,
        comment: newReviewText,
        timestamp: Date.now(),
    };
    addReview(reviewData); 
    setTimeout(() => { 
        setIsSubmittingReview(false);
        setNewReviewText("");
        setNewReviewRating(5);
        alert("Review for teacher submitted! Thank you.");
    }, 500);
  }

  const handleMessageTeacher = () => {
    if (appState.currentUserRole === UserRole.Parent && appState.currentParentProfileId) {
        const conversationId = startOrGoToChat(teacher.id, UserRole.Teacher, teacher.name, teacher.avatarUrl);
        if (conversationId) {
            setViewWithPath(View.ChatRoomScreen, `/chatroomscreen/${conversationId}`);
        } else {
            alert("Could not start chat. Please try again.");
        }
    } else {
        alert("Please log in as a parent to message teachers.");
    }
  };


  const verificationStatusText = {
    NotSubmitted: "Not Verified",
    Pending: "Verification Pending",
    Verified: "Verified Teacher",
    Rejected: "Verification Issues",
  };
   const verificationStatusColor = {
    NotSubmitted: "text-gray-500 bg-gray-100",
    Pending: "text-yellow-700 bg-yellow-100",
    Verified: "text-green-700 bg-green-100",
    Rejected: "text-red-700 bg-red-100",
  };


  return (
    <div className="p-0 sm:p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="max-w-2xl mx-auto !rounded-none sm:!rounded-xl !shadow-none sm:!shadow-xl">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 text-white sm:rounded-t-lg">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <img src={teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/120/120`} alt={teacher.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/50 object-cover mb-3 sm:mb-0 sm:mr-4"/>
                <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold">{teacher.name}</h1>
                    <p className="text-sm opacity-90">{teacher.subjects?.join(' • ')} Specialist</p>
                    <div className="flex items-center justify-center sm:justify-start mt-1">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < (teacher.ratingAverage || 0) ? 'text-yellow-300' : 'text-white/40'}`}/>)}
                        <span className="ml-1.5 text-xs">({teacher.ratingAverage?.toFixed(1) || 'N/A'} from {teacher.ratingCount || 0} reviews)</span>
                    </div>
                     <div className={`mt-2 text-xs px-2 py-0.5 rounded-full inline-block font-semibold ${verificationStatusColor[teacher.verificationStatus || 'NotSubmitted']}`}>
                        <ShieldCheckIcon className="h-3.5 w-3.5 inline mr-1"/>
                        {verificationStatusText[teacher.verificationStatus || 'NotSubmitted']}
                    </div>
                </div>
                 {isEditingOwnProfile && (
                    <Button onClick={() => alert("Edit Profile Picture - Mock")} size="sm" variant="ghost" className="!text-white !border-white/50 hover:!bg-white/20 mt-2 sm:mt-0 sm:ml-auto">
                        <PencilIcon className="h-4 w-4 mr-1"/> Edit Photo
                    </Button>
                )}
            </div>
        </div>

        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">About Me</h2>
                {isEditingOwnProfile ? (
                    <textarea 
                        value={editBio} 
                        onChange={e => setEditBio(e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{teacher.bio || "No biography provided."}</p>
                )}
                 {isEditingOwnProfile && <Button onClick={handleSaveProfileChanges} size="sm" className="mt-2">Save Bio Changes</Button>}
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Courses by {teacher.name.split(' ')[0]}</h2>
                {coursesByThisTeacher.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {coursesByThisTeacher.map(course => (
                        <Card key={course.id} className="!p-3 !shadow-sm hover:!shadow-md transition-shadow cursor-pointer" onClick={() => setViewWithPath(View.CourseDetailView, `/coursedetailview/${course.id}`)}>
                            <h3 className="font-semibold text-indigo-700 text-sm truncate">{course.title}</h3>
                            <p className="text-xs text-gray-500 mb-1">{course.subject} • {course.ageGroups.join(', ')} yrs</p>
                            <div className="flex items-center text-xs text-amber-600"><StarIcon className="h-3 w-3 mr-0.5"/>{course.ratingAverage?.toFixed(1) || 'New'}</div>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">{isEditingOwnProfile ? "You haven't published any courses yet." : "This teacher currently has no active courses."}</p>
                )}
                 {isEditingOwnProfile && <Button onClick={() => setViewWithPath(View.ActivityBuilder, '/activitybuilder')} size="sm" variant="primary" className="mt-3"><PlusCircleIcon className="h-4 w-4 mr-1"/>Create New Course</Button>}
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">General Reviews for {teacher.name.split(' ')[0]} ({reviewsForThisTeacher.length})</h3>
                {reviewsForThisTeacher.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {reviewsForThisTeacher.map(review => (
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
                    <p className="text-sm text-gray-500">No general reviews for this teacher yet.</p>
                )}
            </div>

            {appState.currentUserRole === UserRole.Parent && !isEditingOwnProfile && (
                <>
                    <Card className="!bg-slate-100 !p-3 mt-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-1">Review {teacher.name.split(' ')[0]}:</h4>
                        <div className="flex mb-2">
                            {[1,2,3,4,5].map(star => (
                                <StarIcon key={star} className={`h-6 w-6 cursor-pointer ${star <= newReviewRating ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'}`} onClick={() => setNewReviewRating(star as 1|2|3|4|5)}/>
                            ))}
                        </div>
                        <textarea 
                            value={newReviewText} 
                            onChange={e => setNewReviewText(e.target.value)}
                            rows={2} 
                            placeholder={`Share your overall experience with ${teacher.name.split(' ')[0]}...`}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <Button onClick={handleWriteTeacherReview} disabled={isSubmittingReview || !newReviewText.trim()} size="sm" className="mt-2">
                            {isSubmittingReview ? <LoadingSpinner size="sm"/> : "Submit Teacher Review"}
                        </Button>
                    </Card>
                    <Button 
                        onClick={handleMessageTeacher}
                        fullWidth 
                        variant="primary"
                        className="!bg-teal-500 hover:!bg-teal-600 mt-6"
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2 inline"/> Message {teacher.name.split(' ')[0]}
                    </Button>
                    <Button 
                        onClick={() => alert("Book a trial class - Feature coming soon!")}
                        fullWidth 
                        className="!bg-orange-500 hover:!bg-orange-600 mt-3"
                    >
                        Book a Trial Class (Coming Soon)
                    </Button>
                </>
            )}
            
        </div>
      </Card>
    </div>
  );
};

export default TeacherProfileViewScreen;
