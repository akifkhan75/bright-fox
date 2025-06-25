
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { View, UserRole, AgeGroup } from '../types';
import Button from '../components/Button';
import { APP_NAME, DEFAULT_KID_PROFILE, DEFAULT_PARENTAL_CONTROLS, AGE_GROUPS_V3 } from '../constants'; 

const AgeSelectionScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { kidProfile, setKidProfile, setViewWithPath, appState, setParentalControls, hasOnboardedKid, setHasOnboardedKid } = context;

  const handleAgeSelectAndProceed = (ageGroup: AgeGroup) => {
    if (!appState.currentKidProfileId) {
        console.error("No currentKidProfileId to associate age with.");
        if (appState.currentUserRole === UserRole.Kid) {
            const newKidId = `kid_${Date.now()}`;
            context.setAppState(prev => ({...prev, currentKidProfileId: newKidId}));
            setKidProfile({
                ...DEFAULT_KID_PROFILE, 
                id: newKidId, 
                ageGroup: ageGroup,
            });
            setParentalControls({
                ...DEFAULT_PARENTAL_CONTROLS,
                kidId: newKidId,
            });
            setViewWithPath(View.ParentSetup, '/parentsetup');
            return;
        }
        setViewWithPath(View.RoleSelection, '/roleselection', {replace: true});
        return;
    }

    setKidProfile(prev => ({
        ...(prev || DEFAULT_KID_PROFILE), 
        id: appState.currentKidProfileId!, 
        ageGroup: ageGroup,
    }));
    
    setParentalControls(prev => ({
        ...(prev || DEFAULT_PARENTAL_CONTROLS),
        kidId: appState.currentKidProfileId!,
    }));

    setViewWithPath(View.ParentSetup, '/parentsetup');
  };

  if (appState.currentUserRole === UserRole.Kid && hasOnboardedKid && kidProfile?.ageGroup) {
    setViewWithPath(View.KidHome, '/kidhome', { replace: true });
    return <div className="p-4 text-center">Redirecting...</div>;
  }
  
  useEffect(() => {
    if (appState.currentUserRole === UserRole.Kid && !kidProfile && appState.currentKidProfileId) {
      setKidProfile({ ...DEFAULT_KID_PROFILE, id: appState.currentKidProfileId });
      setParentalControls({ ...DEFAULT_PARENTAL_CONTROLS, kidId: appState.currentKidProfileId });
    }
  }, [appState.currentUserRole, appState.currentKidProfileId, kidProfile, setKidProfile, setParentalControls]);


  if (!kidProfile && appState.currentUserRole === UserRole.Kid) {
    return <div className="p-4 text-center">Initializing your adventure...</div>;
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 p-6 text-white text-center">
      <img src="https://picsum.photos/seed/ageselecticonV3/120/120" alt="BrightFox character" className="w-28 h-28 rounded-full mb-6 shadow-lg border-4 border-white"/>
      <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">How old are you?</h1>
      <p className="text-lg md:text-xl mb-8">
        This helps {APP_NAME} find the best learning adventures for you!
      </p>
      
      <div className="w-full max-w-sm space-y-4">
        {AGE_GROUPS_V3.map(ageGroup => (
          <Button 
            key={ageGroup}
            onClick={() => handleAgeSelectAndProceed(ageGroup)} 
            size="lg" 
            fullWidth
            // Dynamic styling based on age group can be added here if desired
            className={`!bg-sky-500 hover:!bg-sky-600 !text-xl sm:!text-2xl !font-kidFriendly !py-4 sm:!py-5 shadow-xl transform hover:scale-105 transition-transform`}
            aria-label={`Select age ${ageGroup} years`}
          >
            I'm {ageGroup} Years Old
          </Button>
        ))}
      </div>

      <Button 
          onClick={() => setViewWithPath(View.RoleSelection, '/roleselection', { replace: true })} 
          variant="ghost"
          size="sm" 
          className="mt-8 !text-white hover:!bg-white/20 !border-white/50"
        >
        Go Back
      </Button>

      <p className="mt-6 text-xs text-white/80 fixed bottom-4 px-4">
        A grown-up will help with a few more quick things after this!
      </p>
    </div>
  );
};

export default AgeSelectionScreen;
