
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, ActivityStatus } from '../../types';
import Card from '../../components/Card';
import { ShieldCheckIcon, EyeIcon, UserGroupIcon, AcademicCapIcon, ChartBarIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const AdminDashboardScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return <div className="p-4 text-center">Access Denied. Admins only.</div>;
  }
  const { appState, allTeacherProfiles, allCourses, allActivities, setViewWithPath } = context;

  const pendingVerifications = useMemo(() => allTeacherProfiles.filter(t => t.verificationStatus === 'Pending').length, [allTeacherProfiles]);
  const pendingCourses = useMemo(() => allCourses.filter(c => c.status === ActivityStatus.Pending).length, [allCourses]);
  const pendingActivities = useMemo(() => allActivities.filter(a => a.creatorType === 'Teacher' && a.status === ActivityStatus.Pending).length, [allActivities]);

  const totalParents = useMemo(() => new Set(appState.kidProfiles.map(kp => kp.parentId).filter(Boolean)).size, [appState.kidProfiles]);
  const totalKids = appState.kidProfiles.length;
  const totalTeachers = allTeacherProfiles.length;

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color?: string; onClick?: () => void }> = 
    ({ title, value, icon: Icon, color = 'bg-sky-500', onClick }) => (
    <Card className={`!p-4 transform hover:scale-105 transition-transform duration-150 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-700">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white"/>
        </div>
      </div>
    </Card>
  );

  const ActionCard: React.FC<{ title: string; description: string; icon: React.ElementType; onClick: () => void; badgeCount?: number; badgeColor?: string; }> = 
  ({ title, description, icon: Icon, onClick, badgeCount, badgeColor = 'bg-red-500' }) => (
    <Card onClick={onClick} className="relative hover:!shadow-xl transition-shadow !bg-slate-50 hover:!bg-slate-100">
        {badgeCount && badgeCount > 0 && (
            <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${badgeColor}`}>
                {badgeCount}
            </span>
        )}
        <div className="flex items-center mb-2">
            <Icon className="h-8 w-8 mr-3 text-sky-600"/>
            <h3 className="text-xl font-semibold text-sky-700">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <div className="text-right">
            <span className="text-xs text-sky-500 hover:text-sky-700 font-semibold flex items-center justify-end">
                Go to Section <ArrowRightIcon className="h-3 w-3 ml-1"/>
            </span>
        </div>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 font-display">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Pending Verifications" value={pendingVerifications} icon={ShieldCheckIcon} color="bg-yellow-500" onClick={() => setViewWithPath(View.AdminTeacherVerificationApproval, '/adminteacherapproval')}/>
        <StatCard title="Pending Content (Courses)" value={pendingCourses} icon={AcademicCapIcon} color="bg-orange-500" onClick={() => setViewWithPath(View.AdminContentModeration, '/admincontentmoderation')}/>
        <StatCard title="Pending Content (Activities)" value={pendingActivities} icon={EyeIcon} color="bg-pink-500" onClick={() => setViewWithPath(View.AdminContentModeration, '/admincontentmoderation')}/>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ActionCard 
            title="Teacher Approvals" 
            description="Review and approve/reject teacher verification submissions."
            icon={ShieldCheckIcon}
            onClick={() => setViewWithPath(View.AdminTeacherVerificationApproval, '/adminteacherapproval')}
            badgeCount={pendingVerifications}
            badgeColor="bg-yellow-500"
        />
         <ActionCard 
            title="Content Moderation" 
            description="Review and approve/reject courses and activities created by teachers."
            icon={EyeIcon}
            onClick={() => setViewWithPath(View.AdminContentModeration, '/admincontentmoderation')}
            badgeCount={pendingCourses + pendingActivities}
            badgeColor="bg-orange-500"
        />
      </div>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard 
            title="User Management" 
            description="View user statistics and manage accounts (basic view)."
            icon={UserGroupIcon}
            onClick={() => setViewWithPath(View.AdminUserManagement, '/adminusermanagement')}
        />
        <Card className="!bg-slate-50">
            <h3 className="text-xl font-semibold text-sky-700 mb-2">App Statistics</h3>
            <div className="space-y-1 text-sm text-gray-600">
                <p>Total Parents: <span className="font-semibold">{totalParents}</span></p>
                <p>Total Kids: <span className="font-semibold">{totalKids}</span></p>
                <p>Total Teachers: <span className="font-semibold">{totalTeachers}</span></p>
            </div>
        </Card>
       </div>
    </div>
  );
};

export default AdminDashboardScreen;
