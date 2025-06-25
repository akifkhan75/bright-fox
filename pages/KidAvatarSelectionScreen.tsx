
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { View, UserRole } from '../types';
import Button from '../components/Button';
import { AVATARS } from '../constants';
import Card from '../components/Card';

const KidAvatarSelectionScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  // This screen now expects kidProfile to be the one whose avatar is being changed by a parent.
  const { kidProfile, updateKidProfileAndControls, parentalControls, setViewWithPath, appState } = context || {};

  const [selectedAvatar, setSelectedAvatar] = useState(kidProfile?.avatar || AVATARS[0]);

  useEffect(() => {
    if (kidProfile) {
        setSelectedAvatar(kidProfile.avatar || AVATARS[0]);
    }
  }, [kidProfile]);

  if (!context || !kidProfile || !parentalControls || appState?.currentUserRole !== UserRole.Parent) {
      // If a kid somehow lands here, or parent context is lost, redirect.
      // This screen is primarily parent-driven for avatar changes.
      context?.setViewWithPath(View.ParentDashboard, '/parentdashboard', {replace: true});
      return <div className="p-4 text-center">Loading or invalid access...</div>;
  }


  const confirmAvatar = () => {
    if (updateKidProfileAndControls) {
        updateKidProfileAndControls(
            { ...kidProfile, avatar: selectedAvatar },
            parentalControls 
        );
        alert("Avatar updated!");
        // Navigate back to the kid's detail management screen
        setViewWithPath(View.ParentManageKidDetail, `/parentmanagekiddetail/${kidProfile.id}`);
    }
  };

  const handleGoBack = () => {
    // Navigate back to the kid's detail management screen
    setViewWithPath(View.ParentManageKidDetail, `/parentmanagekiddetail/${kidProfile.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 p-4 md:p-6 flex flex-col items-center justify-center pt-10">
      <Card className="w-full max-w-sm text-center">
        <h2 className="text-3xl font-bold text-teal-600 mb-2 font-kidFriendly">Choose Avatar for {kidProfile.name}</h2>
        <p className="text-gray-600 mb-6">Pick an avatar that {kidProfile.name} will love!</p>
        
        <div className="my-6 text-7xl p-4 bg-white rounded-full inline-block shadow-lg border-4 border-teal-400">
          {selectedAvatar}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8">
          {AVATARS.map(avatar => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`p-3 text-4xl rounded-xl transition-all duration-150 transform hover:scale-110
                ${selectedAvatar === avatar 
                  ? 'bg-teal-400 ring-4 ring-teal-200 shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200'}`}
              aria-label={`Select avatar ${avatar}`}
            >
              {avatar}
            </button>
          ))}
        </div>

        <Button onClick={confirmAvatar} fullWidth size="lg" className="!font-kidFriendly !text-xl bg-teal-500 hover:bg-teal-600">
          Set This Avatar
        </Button>
      </Card>
       <Button 
          onClick={handleGoBack} 
          variant="ghost"
          size="sm" 
          className="mt-6 !text-white hover:!bg-white/20 !border-white/50"
        >
          Back to {kidProfile.name}'s Settings
        </Button>
    </div>
  );
};

export default KidAvatarSelectionScreen;
