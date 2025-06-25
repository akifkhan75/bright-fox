
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, ActivityStatus, Course } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { PlusCircleIcon, DocumentTextIcon, CurrencyDollarIcon, UserGroupIcon, Cog6ToothIcon, LightBulbIcon, AcademicCapIcon, ShieldCheckIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const TeacherDashboardScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return <div className="p-4 text-center">Loading teacher dashboard or not authorized...</div>;
  }
  const { teacherProfile, setViewWithPath, allCourses, allActivities } = context;

  const teacherCreatedCourses = useMemo(() => {
    return allCourses.filter(course => course.teacherId === teacherProfile.id);
  }, [allCourses, teacherProfile.id]);
  
  const teacherCreatedActivities = useMemo(() => { // Short activities
    return allActivities.filter(act => act.creatorId === teacherProfile.id && act.creatorType === 'Teacher');
  }, [allActivities, teacherProfile.id]);

  const activeCourses = teacherCreatedCourses.filter(c => c.status === ActivityStatus.Active).length;
  const pendingCourses = teacherCreatedCourses.filter(c => c.status === ActivityStatus.Pending).length;
  const approvedActivities = teacherCreatedActivities.filter(act => act.status === ActivityStatus.Approved).length;

  const verificationStatusText = {
    NotSubmitted: "Not Verified (Submit Docs)",
    Pending: "Verification Pending",
    Verified: "Verified Teacher",
    Rejected: "Verification Rejected",
  };
  const verificationStatusColor = {
    NotSubmitted: "bg-gray-400",
    Pending: "bg-yellow-500",
    Verified: "bg-green-500",
    Rejected: "bg-red-500",
  };


  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string; className?: string }> = ({ title, value, icon, color = 'bg-sky-500', className }) => (
    <Card className={`!p-3 sm:!p-4 transform hover:scale-105 transition-transform duration-150 ${className}`}>
      <div className={`p-2 rounded-full inline-block mb-1 sm:mb-2 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-700">{value}</h3>
      <p className="text-xs sm:text-sm text-gray-500">{title}</p>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="mb-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <img src={teacherProfile.avatarUrl || 'https://picsum.photos/seed/defaultteacher/80/80'} alt={teacherProfile.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/50 object-cover"/>
          <div className="flex-grow">
            <h2 className="text-xl sm:text-2xl font-bold">Welcome, {teacherProfile.name}!</h2>
            <p className="text-sm opacity-90">Your Creator Dashboard</p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full text-white font-semibold whitespace-nowrap ${verificationStatusColor[teacherProfile.verificationStatus || 'NotSubmitted']}`}>
            {verificationStatusText[teacherProfile.verificationStatus || 'NotSubmitted']}
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
            <StarIcon className="h-4 w-4 mr-1 text-yellow-300"/> 
            <span>Rating: {teacherProfile.ratingAverage?.toFixed(1) || 'N/A'} ({teacherProfile.ratingCount || 0} reviews)</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard title="Active Courses" value={activeCourses} icon={<AcademicCapIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>} color="bg-green-500" />
        <StatCard title="Courses Pending Review" value={pendingCourses} icon={<DocumentTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>} color="bg-yellow-500" />
        <StatCard title="Approved Activities" value={approvedActivities} icon={<LightBulbIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>} color="bg-blue-500" />
        <StatCard title="Total Earnings (Mock)" value="$123" icon={<CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>} color="bg-sky-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card onClick={() => setViewWithPath(View.ActivityBuilder, '/activitybuilder')} className="hover:!shadow-2xl hover:!border-teal-500 border-2 border-transparent transition-all !bg-teal-50 hover:!bg-teal-100">
          <div className="flex items-center text-teal-700 mb-2">
            <PlusCircleIcon className="h-8 w-8 mr-3" />
            <div>
                <h3 className="text-xl font-semibold">Create New Course / Activity</h3>
                <p className="text-sm text-gray-600">Design long courses or short, fun activities.</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => setViewWithPath(View.TeacherContentManagement, '/teachercontent')} className="hover:!shadow-2xl hover:!border-cyan-500 border-2 border-transparent transition-all">
          <div className="flex items-center text-cyan-700 mb-2">
            <DocumentTextIcon className="h-8 w-8 mr-3" />
            <div>
                <h3 className="text-xl font-semibold">Manage My Content</h3>
                <p className="text-sm text-gray-500">View, edit, or unpublish your courses & activities.</p>
            </div>
          </div>
        </Card>
         <Card onClick={() => setViewWithPath(View.TeacherProfileView, `/teacherprofileview/${teacherProfile.id}`, {state: {isEditing: true}})} className="hover:!shadow-2xl hover:!border-purple-500 border-2 border-transparent transition-all">
          <div className="flex items-center text-purple-700 mb-2">
            <AcademicCapIcon className="h-8 w-8 mr-3" />
            <div>
                <h3 className="text-xl font-semibold">My Teacher Profile</h3>
                <p className="text-sm text-gray-500">View and edit your public profile details.</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => setViewWithPath(View.ChatListScreen, '/chatlistscreen')} className="hover:!shadow-2xl hover:!border-pink-500 border-2 border-transparent transition-all !bg-pink-50 hover:!bg-pink-100">
          <div className="flex items-center text-pink-700 mb-2">
            <ChatBubbleLeftRightIcon className="h-8 w-8 mr-3" />
            <div>
                <h3 className="text-xl font-semibold">My Messages</h3>
                <p className="text-sm text-gray-600">Communicate with parents.</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => setViewWithPath(View.TeacherVerificationView, '/teacherverificationview')} className="hover:!shadow-2xl hover:!border-orange-500 border-2 border-transparent transition-all">
          <div className="flex items-center text-orange-700 mb-2">
            <ShieldCheckIcon className="h-8 w-8 mr-3" />
            <div>
                <h3 className="text-xl font-semibold">Verification Center</h3>
                <p className="text-sm text-gray-500">Manage your verification documents and status.</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => setViewWithPath(View.TeacherEarnings, '/teacherearnings')} className="hover:!shadow-2xl hover:!border-sky-500 border-2 border-transparent transition-all">
          <div className="flex items-center text-sky-700 mb-2">
            <CurrencyDollarIcon className="h-8 w-8 mr-3" />
             <div>
                <h3 className="text-xl font-semibold">Earnings & Payouts</h3>
                <p className="text-sm text-gray-500">Track revenue from premium content.</p>
            </div>
          </div>
        </Card>
        {/* Student Progress (Classroom) - Placeholder */}
        {/* <Card onClick={() => alert("Student progress view coming soon for classroom settings!")} className="hover:!shadow-2xl hover:!border-indigo-500 border-2 border-transparent transition-all opacity-70 cursor-not-allowed">
          <div className="flex items-center text-indigo-700 mb-2">
            <UserGroupIcon className="h-8 w-8 mr-3" />
            <div>
                <h3 className="text-xl font-semibold">Student Progress (Classroom)</h3>
                <p className="text-sm text-gray-500">Monitor progress for linked students (Soon).</p>
            </div>
          </div>
        </Card> */}
      </div>

      <div className="mt-8 text-center">
        <Button 
            onClick={() => setViewWithPath(View.Settings, '/settings')} 
            variant="ghost" 
            className="text-gray-600"
        >
            <Cog6ToothIcon className="h-5 w-5 mr-1 inline"/> Account Settings
        </Button>
      </div>
    </div>
  );
};

export default TeacherDashboardScreen;
