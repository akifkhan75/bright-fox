
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, Activity, ActivityStatus, Course, LessonContentType } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PencilIcon, TrashIcon, PlusCircleIcon, BookOpenIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline'; // AcademicCapIcon for courses

const TeacherContentManagementScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return <div className="p-4 text-center">Access Denied.</div>;
  }
  const { teacherProfile, allActivities, allCourses, setViewWithPath } = context;

  const teacherCreatedCourses = useMemo(() => {
    return allCourses.filter(course => course.teacherId === teacherProfile.id)
                     .sort((a,b) => (a.title > b.title ? 1 : -1));
  }, [allCourses, teacherProfile.id]);

  const teacherCreatedActivities = useMemo(() => { // Short activities
    return allActivities.filter(act => act.creatorId === teacherProfile.id && act.creatorType === 'Teacher')
                        .sort((a,b) => (a.name > b.name ? 1 : -1));
  }, [allActivities, teacherProfile.id]);


  const getStatusColor = (status?: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.Approved: case ActivityStatus.Active: return 'text-green-600 bg-green-100';
      case ActivityStatus.Pending: return 'text-yellow-600 bg-yellow-100';
      case ActivityStatus.Rejected: return 'text-red-600 bg-red-100';
      case ActivityStatus.Draft: return 'text-gray-600 bg-gray-100';
      case ActivityStatus.Completed: return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const handleEditContent = (contentId: string, isCourse: boolean) => {
    // Navigate to builder, ActivityBuilderScreen handles both via courseId param
    setViewWithPath(View.ActivityBuilder, `/activitybuilder/${contentId}`);
  };

  const handleDeleteContent = (contentId: string, isCourse: boolean) => {
    if(window.confirm(`Are you sure you want to delete this ${isCourse ? 'course' : 'activity'}? This action cannot be undone.`)) {
        alert(`${isCourse ? 'Course' : 'Activity'} ${contentId} would be deleted. (API call needed)`);
        // Example: context.deleteContent(contentId, isCourse);
    }
  };


  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-700 font-display">My Created Content</h2>
        <Button onClick={() => setViewWithPath(View.ActivityBuilder, '/activitybuilder')} className="bg-cyan-600 hover:bg-cyan-700">
          <PlusCircleIcon className="h-5 w-5 mr-2 inline"/> Create New
        </Button>
      </div>

      {teacherCreatedCourses.length === 0 && teacherCreatedActivities.length === 0 ? (
        <Card className="text-center py-8">
          <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
          <p className="text-gray-600 font-semibold mb-2">You haven't created any courses or activities yet.</p>
          <Button onClick={() => setViewWithPath(View.ActivityBuilder, '/activitybuilder')}>
            Start Creating!
          </Button>
        </Card>
      ) : (
        <>
          {teacherCreatedCourses.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">My Courses</h3>
              <div className="space-y-4">
                {teacherCreatedCourses.map(course => (
                  <Card key={course.id} className="!p-0 overflow-hidden shadow-md">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                          <div>
                              <h4 className="text-lg font-semibold text-gray-800">{course.title}</h4>
                              <p className="text-sm text-gray-500">Subject: {course.subject} | Duration: {course.durationWeeks} weeks</p>
                              <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${getStatusColor(course.status)}`}>
                                  Status: {course.status || 'Unknown'}
                              </p>
                              {(course.priceOneTime || course.priceMonthly) && <span className="ml-2 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Premium</span>}
                          </div>
                          <div className="flex space-x-2 flex-shrink-0">
                              <Button variant="ghost" size="sm" onClick={() => handleEditContent(course.id, true)} className="!p-1.5 sm:!p-2 text-blue-600 hover:!bg-blue-50">
                                  <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteContent(course.id, true)} className="!p-1.5 sm:!p-2 text-red-600 hover:!bg-red-50">
                                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                              </Button>
                          </div>
                      </div>
                       <p className="text-xs text-gray-400 mt-2">Target Ages: {course.ageGroups.join(', ')}</p>
                       <p className="text-sm text-gray-600 mt-1 truncate">{course.description}</p>
                    </div>
                    {course.status === ActivityStatus.Rejected && ( /* Example for rejected content */
                      <div className="bg-red-50 p-3 border-t border-red-200">
                          <p className="text-xs text-red-700"><strong>Rejection Reason (Mock):</strong> Course description needs more detail on learning outcomes.</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {teacherCreatedActivities.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">My Short Activities</h3>
              <div className="space-y-4">
                {teacherCreatedActivities.map(activity => (
                  <Card key={activity.id} className="!p-0 overflow-hidden shadow-md">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                          <div>
                              <h4 className="text-lg font-semibold text-gray-800">{activity.name}</h4>
                              <p className="text-sm text-gray-500">Type: {activity.contentType.replace(/([A-Z])/g, ' $1').trim()} | Difficulty: {activity.difficulty}</p>
                              <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${getStatusColor(activity.status)}`}>
                                  Status: {activity.status || 'Unknown'}
                              </p>
                              {activity.isPremium && <span className="ml-2 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Premium</span>}
                          </div>
                          <div className="flex space-x-2 flex-shrink-0">
                              <Button variant="ghost" size="sm" onClick={() => handleEditContent(activity.id, false)} className="!p-1.5 sm:!p-2 text-blue-600 hover:!bg-blue-50">
                                  <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteContent(activity.id, false)} className="!p-1.5 sm:!p-2 text-red-600 hover:!bg-red-50">
                                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                              </Button>
                          </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Target Ages: {activity.ageGroups.join(', ')}</p>
                      {activity.activityContent?.description && <p className="text-sm text-gray-600 mt-1 truncate">{activity.activityContent.description}</p>}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherContentManagementScreen;
