
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, TeacherProfile } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const AdminTeacherVerificationApprovalScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return <div className="p-4 text-center">Access Denied. Admins only.</div>;
  }
  const { allTeacherProfiles, updateTeacherVerificationStatus } = context;

  const pendingTeachers = useMemo(() => {
    return allTeacherProfiles.filter(t => t.verificationStatus === 'Pending');
  }, [allTeacherProfiles]);

  const handleApprove = async (teacherId: string) => {
    if (window.confirm("Are you sure you want to approve this teacher?")) {
        await updateTeacherVerificationStatus(teacherId, 'Verified');
        // State update will re-render
    }
  };

  const handleReject = async (teacherId: string) => {
     if (window.confirm("Are you sure you want to reject this teacher's verification?")) {
        await updateTeacherVerificationStatus(teacherId, 'Rejected');
         // State update will re-render
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="h-8 w-8 mr-3 text-yellow-600" />
        <h1 className="text-2xl font-bold text-gray-800 font-display">Teacher Verification Approvals</h1>
      </div>

      {pendingTeachers.length === 0 ? (
        <Card className="text-center py-10">
          <ShieldCheckIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No pending teacher verifications at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingTeachers.map(teacher => (
            <Card key={teacher.id} className="!p-4 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-3 sm:mb-0">
                  <div className="flex items-center mb-1">
                    <img src={teacher.avatarUrl || 'https://picsum.photos/seed/default/50/50'} alt={teacher.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">{teacher.name}</h3>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2"><strong>Bio:</strong> {teacher.bio || 'N/A'}</p>
                  <p className="text-xs text-gray-600"><strong>Subjects:</strong> {teacher.subjects?.join(', ') || 'N/A'}</p>
                  {/* Mock: Display submitted documents if available */}
                  <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">View Submitted Documents (Mock)</p>
                </div>
                <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
                  <Button onClick={() => handleApprove(teacher.id)} variant="primary" size="sm" className="!bg-green-500 hover:!bg-green-600">
                    <CheckCircleIcon className="h-4 w-4 mr-1 inline"/> Approve
                  </Button>
                  <Button onClick={() => handleReject(teacher.id)} variant="danger" size="sm">
                    <XCircleIcon className="h-4 w-4 mr-1 inline"/> Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTeacherVerificationApprovalScreen;
