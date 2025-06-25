
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import Button from '../components/Button';
import Card from '../components/Card';
import { DEFAULT_KID_PROFILE, DEFAULT_PARENTAL_CONTROLS } from '../constants';
import { View, UserRole, KidProfile, ParentalControls, AppState } from '../types'; 

const SettingsScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appState, parentalControls, setParentalControls, setKidProfile, kidProfile, setHasOnboardedKid, setViewWithPath, setAppState } = context;

  const handleResetApp = () => {
    if (window.confirm("Are you sure you want to reset ALL app data? This will clear all profiles (parent, kids, teachers) and settings.")) {
      localStorage.clear(); 
      
      // Reset AppState completely
      setAppState({ 
        currentUserRole: null, 
        currentKidProfileId: null, 
        currentParentProfileId: null, 
        currentTeacherProfileId: null,
        currentAdminProfileId: null, // Added to satisfy AppState type
        adminProfile: null,          // Added to satisfy AppState type
        kidProfiles: [], 
        parentalControlsMap: {},
        chatConversations: [], 
        chatMessages: [], 
      } as AppState); // Ensure the object matches AppState structure
      // Context states for active profiles will be cleared by App.tsx's useEffects
      setViewWithPath(View.Splash, '/', {replace: true});
    }
  };


  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center font-display">Settings</h2>
        
        <div className="space-y-6">
          {appState.currentUserRole === UserRole.Parent && (
            <Card className="!bg-sky-50 !border !border-sky-200">
                <h3 className="text-lg font-semibold text-sky-700 mb-2">Manage Kid Profiles & Controls</h3>
                <p className="text-sm text-gray-600 mb-3">
                    To adjust screen time, learning paths, PINs, or other settings for your children, please go to your Parent Dashboard.
                </p>
                <Button 
                    onClick={() => setViewWithPath(View.ParentDashboard, '/parentdashboard')}
                    variant="primary"
                    className="!bg-sky-600 hover:!bg-sky-700"
                >
                    Go to Parent Dashboard
                </Button>
            </Card>
          )}

          {appState.currentUserRole === UserRole.Teacher && (
             <Card className="!bg-teal-50 !border !border-teal-200">
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Teacher Account</h3>
                <p className="text-sm text-gray-600 mb-3">
                   Manage your profile, content, and earnings from your Teacher Dashboard.
                </p>
                <Button 
                    onClick={() => setViewWithPath(View.TeacherDashboard, '/teacherdashboard')}
                    variant="primary"
                    className="!bg-teal-600 hover:!bg-teal-700"
                >
                    Go to Teacher Dashboard
                </Button>
            </Card>
          )}
          
          {appState.currentUserRole === UserRole.Kid && (
             <Card className="!bg-yellow-50 !border !border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">My Settings</h3>
                <p className="text-sm text-gray-600 mb-3">
                   Most settings are managed by your parent. If you need help, ask a grown-up!
                </p>
                 {/* Kid-specific settings could go here if any, e.g., theme preferences */}
            </Card>
          )}


          <hr className="my-6"/>
          <h3 className="text-lg font-semibold text-red-600 mb-2">App Data</h3>
          <p className="text-xs text-gray-500 mb-3">Warning: Resetting will erase all profiles and progress stored on this device.</p>
          <Button onClick={handleResetApp} fullWidth variant="danger" size="md">
            Reset All App Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsScreen;
