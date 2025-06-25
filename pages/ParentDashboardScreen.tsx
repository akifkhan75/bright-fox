
import React, { useContext, useState, useMemo } from 'react'; 
import { AppContext } from '../../App';
import { View, UserRole, Course, KidProfile } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { ClockIcon, SparklesIcon, Cog6ToothIcon, ShieldCheckIcon, UserGroupIcon, AcademicCapIcon, EyeIcon, ChartBarIcon, MagnifyingGlassIcon, BookOpenIcon, StarIcon, PlusCircleIcon, UserPlusIcon, UsersIcon, AdjustmentsVerticalIcon, CreditCardIcon } from '@heroicons/react/24/outline'; // Updated icons

const ParentDashboardScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context || !context.appState.currentParentProfileId || context.appState.currentUserRole !== UserRole.Parent) {
     return <div className="p-4 text-center">Loading parent dashboard or not authorized...</div>;
  }

  const { appState, setViewWithPath, allCourses, allTeacherProfiles, switchViewToKidAsParent } = context; 
  
  const parentKids = useMemo(() => {
    return appState.kidProfiles.filter(kp => kp.parentId === appState.currentParentProfileId);
  }, [appState.kidProfiles, appState.currentParentProfileId]);


  const KidCard: React.FC<{kid: KidProfile}> = ({ kid }) => {
    const kidProgress = context.kidProgress; // This is for the active kid, not ideal here. Need per-kid progress.
                                             // For now, use kid.level as a placeholder.
    const enrolledCoursesCount = kid.enrolledCourseIds?.length || 0;

    return (
        <Card className="!p-3 sm:!p-4 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
                <span className="text-4xl sm:text-5xl p-1 bg-sky-100 rounded-full">{kid.avatar}</span>
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-sky-700">{kid.name}</h3>
                    <p className="text-xs text-gray-500">Age Group: {kid.ageGroup} | Level: {kid.level || 1}</p>
                    <p className="text-xs text-gray-500">Learning Level: {kid.currentLearningLevel}</p>
                </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">Enrolled Courses: {enrolledCoursesCount}</p>
            <p className="text-xs text-gray-600 mb-3">Learning Focus: {kid.learningPathFocus?.join(', ') || 'General'}</p>
            <div className="grid grid-cols-2 gap-2">
                <Button 
                    size="sm" 
                    variant="primary"
                    className="!bg-sky-500 hover:!bg-sky-600 !text-xs"
                    onClick={() => switchViewToKidAsParent(kid.id)}
                >
                    <EyeIcon className="h-4 w-4 mr-1 inline"/> Kid's View
                </Button>
                <Button 
                    size="sm" 
                    variant="ghost" 
                    className="!text-sky-600 hover:!bg-sky-50 !border-sky-300 !text-xs"
                    onClick={() => setViewWithPath(View.ParentManageKidDetail, `/parentmanagekiddetail/${kid.id}`)}
                >
                    <AdjustmentsVerticalIcon className="h-4 w-4 mr-1 inline"/> Manage
                </Button>
            </div>
        </Card>
    );
  };


  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Parent Dashboard</h2>
            <p className="text-sm opacity-90">Manage your family's learning journey.</p>
          </div>
          <UsersIcon className="h-10 w-10 text-white/70"/>
        </div>
      </Card>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-700">My Kids ({parentKids.length})</h3>
            <Button 
                size="sm" 
                variant="primary" 
                className="!bg-green-500 hover:!bg-green-600"
                onClick={() => setViewWithPath(View.ParentAddKid, '/parentaddkid')}
            >
                <UserPlusIcon className="h-4 w-4 mr-1 inline"/> Add Kid
            </Button>
        </div>
        {parentKids.length === 0 ? (
            <Card className="text-center py-6">
                <p className="text-gray-600 mb-2">You haven't added any child profiles yet.</p>
                <Button 
                    variant="primary" 
                    onClick={() => setViewWithPath(View.ParentAddKid, '/parentaddkid')}
                >
                    Add Your First Child
                </Button>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parentKids.map(kid => <KidCard key={kid.id} kid={kid} />)}
            </div>
        )}
      </section>


      <Card className="mb-6">
        <div className="flex items-center text-teal-600 mb-3">
            <MagnifyingGlassIcon className="h-7 w-7 mr-2" />
            <h3 className="text-xl font-semibold">Discover Learning Adventures</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">Explore structured courses and activities from verified teachers for your kids.</p>
        <Button 
            onClick={() => setViewWithPath(View.ParentCourseDiscoveryView, '/parentcoursediscoveryview')}
            size="md" 
            variant="primary" 
            className="w-full !bg-teal-500 hover:!bg-teal-600"
        >
            Find Courses & Teachers
        </Button>
      </Card>
      
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center text-green-600 mb-2">
            <CreditCardIcon className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Family Subscriptions</h3>
          </div>
          <p className="text-sm text-gray-600">Access premium content across all kid profiles.</p>
          <Button 
            onClick={() => setViewWithPath(View.ParentSubscriptionScreen, '/parentsubscription')}
            size="sm" 
            variant="primary" 
            className="mt-3 text-sm !bg-green-500 hover:!bg-green-600"
          >
            Manage Subscriptions
          </Button>
        </Card>
        <Card>
          <div className="flex items-center text-skyBlue mb-2">
            <ShieldCheckIcon className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Global Parental Controls</h3>
          </div>
          <p className="text-sm text-gray-600">Set general app preferences. Individual kid settings are managed per profile.</p>
          <Button 
            onClick={() => setViewWithPath(View.Settings, '/settings')}
            size="sm" 
            variant="primary" 
            className="mt-3 text-sm"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-1 inline"/> General App Settings
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboardScreen;
