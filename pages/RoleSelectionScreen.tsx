
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { View, UserRole } from '../types';
import Button from '../components/Button';
import { APP_NAME } from '../constants';
import { UserIcon, AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'; 
import Card from '../components/Card';

const RoleSelectionScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { setViewWithPath, setAppState } = context;

  const handleRoleSelect = (role: UserRole) => {
    if (role === UserRole.Parent) {
      setAppState(prev => ({ ...prev, currentUserRole: UserRole.Parent }));
      setViewWithPath(View.Login, '/login?role=Parent');
    } else if (role === UserRole.Teacher) {
      setAppState(prev => ({ ...prev, currentUserRole: UserRole.Teacher }));
      setViewWithPath(View.Login, '/login?role=Teacher');
    }
    // Kid selection is removed from here. Access is through parent.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 p-6 text-white text-center">
      <img src="https://picsum.photos/seed/brightfoxV2roles/120/120" alt={`${APP_NAME} Mascot`} className="w-28 h-28 rounded-full mb-4 shadow-xl border-4 border-white" />
      <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">Welcome to {APP_NAME}!</h1>
      <p className="text-lg md:text-xl mb-10">Who are you?</p>

      <div className="space-y-5 w-full max-w-sm">
        {/* "I'm a Kid" button removed for V5 */}
        
        <Card className="!bg-white/20 hover:!bg-white/30 !backdrop-blur-sm !p-0">
            <Button 
            onClick={() => handleRoleSelect(UserRole.Parent)} 
            size="lg" 
            fullWidth 
            className="!bg-transparent !shadow-none !text-white !py-6 !rounded-xl group"
            >
            <div className="flex items-center justify-center">
                <ShieldCheckIcon className="h-10 w-10 mr-4 text-pink-300 group-hover:scale-110 transition-transform" />
                <span className="font-kidFriendly text-2xl">I'm a Parent</span>
            </div>
            </Button>
        </Card>

        <Card className="!bg-white/20 hover:!bg-white/30 !backdrop-blur-sm !p-0">
            <Button 
            onClick={() => handleRoleSelect(UserRole.Teacher)} 
            size="lg" 
            fullWidth 
            className="!bg-transparent !shadow-none !text-white !py-6 !rounded-xl group"
            >
            <div className="flex items-center justify-center">
                <AcademicCapIcon className="h-10 w-10 mr-4 text-green-300 group-hover:scale-110 transition-transform" />
                <span className="font-kidFriendly text-2xl">I'm a Teacher</span>
            </div>
            </Button>
        </Card>
      </div>
      <p className="mt-10 text-xs text-white/70">
        Select your role to start your learning adventure or creation journey!
      </p>
    </div>
  );
};

export default RoleSelectionScreen;
