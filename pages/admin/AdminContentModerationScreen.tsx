
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, ActivityStatus, Course, Activity } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { EyeIcon, CheckCircleIcon, XCircleIcon, AcademicCapIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid';

type ModerationTab = 'courses' | 'activities';

const AdminContentModerationScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<ModerationTab>('courses');

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return <div className="p-4 text-center">Access Denied. Admins only.</div>;
  }
  const { allCourses, allActivities, updateCourseStatus, updateActivityStatus, setViewWithPath, allTeacherProfiles } = context;

  const pendingCourses = useMemo(() => allCourses.filter(c => c.status === ActivityStatus.Pending), [allCourses]);
  const pendingActivities = useMemo(() => allActivities.filter(a => a.creatorType === 'Teacher' && a.status === ActivityStatus.Pending), [allActivities]);

  const handleApproveCourse = async (courseId: string) => {
    if (window.confirm("Are you sure you want to approve this course?")) {
        await updateCourseStatus(courseId, ActivityStatus.Active);
    }
  };
  const handleRejectCourse = async (courseId: string) => {
    if (window.confirm("Are you sure you want to reject this course?")) {
        await updateCourseStatus(courseId, ActivityStatus.Rejected);
    }
  };

  const handleApproveActivity = async (activityId: string) => {
    if (window.confirm("Are you sure you want to approve this activity?")) {
        await updateActivityStatus(activityId, ActivityStatus.Approved);
    }
  };
  const handleRejectActivity = async (activityId: string) => {
    if (window.confirm("Are you sure you want to reject this activity?")) {
        await updateActivityStatus(activityId, ActivityStatus.Rejected);
    }
  };
  
  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Unknown Teacher';
    return allTeacherProfiles.find(t => t.id === teacherId)?.name || teacherId;
  };

  const CourseItem: React.FC<{ course: Course }> = ({ course }) => (
    <Card className="!p-4 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="mb-3 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-700">{course.title}</h3>
          <p className="text-xs text-gray-500">By: {getTeacherName(course.teacherId)} | Subject: {course.subject}</p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description}</p>
          <Button size="sm" variant="ghost" className="!p-0 !text-xs text-blue-600 hover:!underline mt-1" onClick={() => setViewWithPath(View.CourseDetailView, `/coursedetailview/${course.id}`)}>
              View Details
          </Button>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <Button onClick={() => handleApproveCourse(course.id)} variant="primary" size="sm" className="!bg-green-500 hover:!bg-green-600">
            <CheckCircleIcon className="h-4 w-4 mr-1 inline"/> Approve
          </Button>
          <Button onClick={() => handleRejectCourse(course.id)} variant="danger" size="sm">
            <XCircleIcon className="h-4 w-4 mr-1 inline"/> Reject
          </Button>
        </div>
      </div>
    </Card>
  );

  const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => (
     <Card className="!p-4 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="mb-3 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-700">{activity.name}</h3>
          <p className="text-xs text-gray-500">By: {getTeacherName(activity.creatorId)} | Type: {activity.contentType}</p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{activity.activityContent?.description || 'No description.'}</p>
           <Button size="sm" variant="ghost" className="!p-0 !text-xs text-blue-600 hover:!underline mt-1" onClick={() => setViewWithPath(activity.view || View.ActivityPlaceholder, `/${View[activity.view || View.ActivityPlaceholder].toString().toLowerCase()}`)}>
              Preview Activity (Mock)
          </Button>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <Button onClick={() => handleApproveActivity(activity.id)} variant="primary" size="sm" className="!bg-green-500 hover:!bg-green-600">
            <CheckCircleIcon className="h-4 w-4 mr-1 inline"/> Approve
          </Button>
          <Button onClick={() => handleRejectActivity(activity.id)} variant="danger" size="sm">
            <XCircleIcon className="h-4 w-4 mr-1 inline"/> Reject
          </Button>
        </div>
      </div>
    </Card>
  );


  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <div className="flex items-center mb-6">
        <EyeIcon className="h-8 w-8 mr-3 text-orange-600" />
        <h1 className="text-2xl font-bold text-gray-800 font-display">Content Moderation Queue</h1>
      </div>

      <div className="mb-4 border-b border-gray-300">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('courses')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Pending Courses ({pendingCourses.length})
          </button>
          <button onClick={() => setActiveTab('activities')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'activities' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Pending Activities ({pendingActivities.length})
          </button>
        </nav>
      </div>

      {activeTab === 'courses' && (
        pendingCourses.length === 0 
        ? <Card className="text-center py-10"><AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-600 font-semibold">No courses pending review.</p></Card>
        : <div className="space-y-4">{pendingCourses.map(course => <CourseItem key={course.id} course={course} />)}</div>
      )}

      {activeTab === 'activities' && (
        pendingActivities.length === 0
        ? <Card className="text-center py-10"><PuzzlePieceIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-600 font-semibold">No activities pending review.</p></Card>
        : <div className="space-y-4">{pendingActivities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}</div>
      )}
    </div>
  );
};

export default AdminContentModerationScreen;
