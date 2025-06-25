
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, KidProfile } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { UserGroupIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';

const ParentPostLoginSelectionScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.appState.currentParentProfileId || context.appState.currentUserRole !== UserRole.Parent) {
    // Should not happen if routed correctly, but good to check
    context?.setViewWithPath(View.Login, '/login?role=Parent', { replace: true });
    return <div className="p-4 text-center">Loading or unauthorized...</div>;
  }

  const { appState, setViewWithPath, switchViewToKidAsParent } = context;

  const parentKids = useMemo(() => {
    return appState.kidProfiles.filter(kp => kp.parentId === appState.currentParentProfileId);
  }, [appState.kidProfiles, appState.currentParentProfileId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6 flex flex-col items-center justify-center text-white">
      <Card className="w-full max-w-md text-center !bg-white/20 !backdrop-blur-md">
        <SparklesIcon className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold font-display mb-3">Welcome Back, Parent!</h1>
        <p className="text-lg opacity-90 mb-8">What would you like to do?</p>

        <div className="space-y-5">
          <Button
            onClick={() => setViewWithPath(View.ParentDashboard, '/parentdashboard')}
            size="lg"
            fullWidth
            className="!bg-sky-500 hover:!bg-sky-600 !py-4 group"
          >
            <ShieldCheckIcon className="h-7 w-7 mr-3 inline transition-transform group-hover:rotate-12" />
            <span className="font-kidFriendly text-xl">Go to Parent Dashboard</span>
          </Button>

          {parentKids.length > 0 && (
            <div>
              <p className="text-lg opacity-90 my-4">- OR -</p>
              <h2 className="text-xl font-semibold font-kidFriendly mb-3">Switch to a Child's View:</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                {parentKids.map(kid => (
                  <Button
                    key={kid.id}
                    onClick={() => switchViewToKidAsParent(kid.id)}
                    size="md"
                    fullWidth
                    variant="secondary"
                    className="!bg-pink-500 hover:!bg-pink-600 !py-3 group"
                  >
                    <span className="text-3xl mr-3 inline-block transition-transform group-hover:scale-110">{kid.avatar}</span>
                    <span className="font-kidFriendly text-lg">View as {kid.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
           {parentKids.length === 0 && (
             <Button
                onClick={() => setViewWithPath(View.ParentAddKid, '/parentaddkid')}
                size="md"
                fullWidth
                variant="ghost"
                className="!bg-green-500 hover:!bg-green-600 !py-3 !text-white"
             >
                Add Your First Child
            </Button>
           )}
        </div>
      </Card>
    </div>
  );
};

export default ParentPostLoginSelectionScreen;
