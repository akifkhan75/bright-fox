import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { View, UserRole } from '../types';
import Button from '../components/Button'; // Keep for potential future use or parent login
import { APP_NAME } from '../constants';
import { SparklesIcon } from '@heroicons/react/24/solid'; // Example Icon

const SplashScreen: React.FC = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (!context) return;
    const { appState, setViewWithPath, hasOnboardedKid, kidProfile } = context;

    const timer = setTimeout(() => {
      if (!appState.currentUserRole) {
        setViewWithPath(View.RoleSelection, '/roleselection', { replace: true });
      } else {
        // User role is set, App.tsx's useEffect for redirection will handle it
        // This logic might be redundant if App.tsx handles all redirection from "/"
        switch (appState.currentUserRole) {
          case UserRole.Kid:
            if (hasOnboardedKid && kidProfile?.ageGroup) {
              setViewWithPath(View.KidHome, '/kidhome', { replace: true });
            } else {
              // Onboarding not complete, or no kid profile selected for parent
              setViewWithPath(View.AgeSelection, '/ageselection', {replace: true}); // Or parent's kid selection
            }
            break;
          case UserRole.Parent:
            setViewWithPath(View.ParentDashboard, '/parentdashboard', { replace: true });
            break;
          case UserRole.Teacher:
            setViewWithPath(View.TeacherDashboard, '/teacherdashboard', { replace: true });
            break;
          default:
            setViewWithPath(View.RoleSelection, '/roleselection', { replace: true });
        }
      }
    }, 1500); // Splash screen duration

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]); // Rerun if context becomes available

  if (!context) {
    // Show a minimal loading state until context is ready
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-6 text-white text-center">
        <SparklesIcon className="h-20 w-20 text-yellow-300 animate-pulse mb-4" />
        <h1 className="text-5xl md:text-6xl font-bold font-kidFriendly tracking-wide" style={{ WebkitTextStroke: '1px white', color: '#FFD700' }}>{APP_NAME}</h1>
        <p className="text-lg md:text-xl font-display">Loading...</p>
      </div>
    );
  }
  
  // const speakWelcome = () => {
  //   if ('speechSynthesis' in window) {
  //     const utterance = new SpeechSynthesisUtterance(`Welcome to ${APP_NAME}! Learning is an adventure!`);
  //     utterance.lang = 'en-US';
  //     window.speechSynthesis.speak(utterance);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-6 text-white text-center">
      <img src="https://picsum.photos/seed/brightfoxlogoV2/150/150" alt="BrightFox Logo" className="w-36 h-36 md:w-44 md:h-44 rounded-full mb-6 shadow-2xl border-4 border-white animate-pulse" />
      <h1 className="text-5xl md:text-6xl font-bold font-kidFriendly mb-3 tracking-wide" style={{ WebkitTextStroke: '1px white', color: '#FFD700' }}>{APP_NAME}</h1>
      <p className="text-lg md:text-xl mb-8 font-display">Where Kids Learn, Create, and Grow!</p>
      
      {/* Optional: Add a subtle loading indicator or animation if needed */}
      <div className="w-16 h-16 border-4 border-dashed border-white/50 rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-white/80">Initializing your adventure...</p>
    </div>
  );
};

export default SplashScreen;
