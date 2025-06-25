
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
import { UserGroupIcon, AcademicCapIcon, FaceSmileIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const AdminUserManagementScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return <div className="p-4 text-center">Access Denied. Admins only.</div>;
  }
  const { appState, allTeacherProfiles } = context;

  const totalParents = useMemo(() => new Set(appState.kidProfiles.map(kp => kp.parentId).filter(Boolean)).size, [appState.kidProfiles]);
  const totalKids = appState.kidProfiles.length;
  const totalTeachers = allTeacherProfiles.length;
  const verifiedTeachers = useMemo(() => allTeacherProfiles.filter(t => t.isVerified).length, [allTeacherProfiles]);

  const StatDisplay: React.FC<{ label: string; value: number; icon: React.ElementType; color: string }> = 
    ({ label, value, icon: Icon, color }) => (
    <Card className={`!p-4 !bg-opacity-10 ${color.replace('text-', 'bg-').replace('-600','-50')} border ${color.replace('text-','border-')}`}>
      <div className="flex items-center">
        <Icon className={`h-8 w-8 mr-3 ${color}`} />
        <div>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </Card>
  );


  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <div className="flex items-center mb-6">
        <UserGroupIcon className="h-8 w-8 mr-3 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800 font-display">User Management Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatDisplay label="Total Parents" value={totalParents} icon={UserGroupIcon} color="text-purple-600" />
        <StatDisplay label="Total Kids" value={totalKids} icon={FaceSmileIcon} color="text-pink-600" />
        <StatDisplay label="Total Teachers" value={totalTeachers} icon={AcademicCapIcon} color="text-teal-600" />
        <StatDisplay label="Verified Teachers" value={verifiedTeachers} icon={ShieldCheckIcon} color="text-green-600" />
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Detailed User Lists (Placeholder)</h2>
        <p className="text-sm text-gray-600">
          In a full admin dashboard, this section would allow searching, filtering, viewing details,
          and performing actions (e.g., suspend, message, verify manually) on individual user accounts.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-500 mt-2 pl-4">
            <li>Search for users by email or name.</li>
            <li>Filter users by role, status (e.g., active, suspended).</li>
            <li>View detailed profile information.</li>
            <li>Manage account actions (e.g., reset password for parent, edit kid profile, suspend teacher).</li>
        </ul>
      </Card>
    </div>
  );
};

export default AdminUserManagementScreen;
