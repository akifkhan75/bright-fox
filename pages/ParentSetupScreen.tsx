
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { View, KidProfile, ParentalControls, AgeGroup, LearningLevel, UserRole } from '../types';
import Button from '../components/Button';
import { INTERESTS_SUGGESTIONS, DEFAULT_KID_PROFILE, DEFAULT_PARENTAL_CONTROLS, AGE_GROUPS_V3, LEARNING_LEVELS, SUBJECTS_LIST, APP_NAME } from '../constants';
import Card from '../components/Card';

const ParentSetupScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  const [kidName, setKidName] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(AGE_GROUPS_V3[0]);
  // PIN fields removed for V5
  const [learningPathFocus, setLearningPathFocus] = useState<string[]>([]);
  const [currentLearningLevel, setCurrentLearningLevel] = useState<LearningLevel>(LEARNING_LEVELS[0]);
  const [screenTime, setScreenTime] = useState(DEFAULT_PARENTAL_CONTROLS.screenTimeLimit);
  const [error, setError] = useState('');


  if (!context) return null;
  const { setViewWithPath, addKidProfileToParent, appState, setAppState } = context;

  useEffect(() => {
    if (!appState.currentParentProfileId) {
      alert("Please log in as a parent first.");
      setViewWithPath(View.Login, '/login?role=Parent', { replace: true });
    }
  }, [appState.currentParentProfileId, setViewWithPath]);


  const toggleLearningPath = (path: string) => {
    setLearningPathFocus(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!kidName.trim()) {
        setError("Please enter a name for your child.");
        return;
    }
    if (!appState.currentParentProfileId) {
        setError("Parent session error. Please log in again.");
        return;
    }

    // Omit 'pin' from newKidData for V5
    const newKidData: Omit<KidProfile, 'id' | 'parentId' | 'avatar'> = {
      name: kidName.trim() || "Little Explorer",
      ageGroup: selectedAgeGroup,
      interests: [], 
      learningPathFocus: learningPathFocus,
      currentLearningLevel: currentLearningLevel,
      // Other fields will use defaults from DEFAULT_KID_PROFILE
    };
    const newControlsData: Omit<ParentalControls, 'kidId'> = {
        ...DEFAULT_PARENTAL_CONTROLS, 
        screenTimeLimit: screenTime,
    };

    const addedKid = addKidProfileToParent(newKidData, newControlsData);

    if (addedKid) {
      // V5: After first kid setup, go to parent's post-login selection or dashboard.
      // Avatar selection can be done from ParentManageKidDetailScreen.
      alert(`${addedKid.name}'s profile created! You can set their avatar from the 'Manage Kid' section on your dashboard.`);
      setAppState(prev => ({...prev, currentKidProfileId: null, currentUserRole: UserRole.Parent })); // Ensure parent role remains, no active kid
      setViewWithPath(View.ParentPostLoginSelection, '/parentpostloginselection', {replace: true});
    } else {
      setError("Failed to add kid profile. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-sky-100 p-4 md:p-6 pt-20"> {/* pt-20 for header */}
      <Card className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-skyBlue mb-6 text-center font-display">Setup Your First Child's Profile</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">Let's get {APP_NAME} ready for your little one!</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="kidName" className="block text-sm font-medium text-gray-700">Child's Name (or Nickname)</label>
            <input type="text" id="kidName" value={kidName} onChange={(e) => setKidName(e.target.value)} required placeholder="e.g., Alex" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>

          <div>
            <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">Age Group</label>
            <select id="ageGroup" value={selectedAgeGroup} onChange={e => setSelectedAgeGroup(e.target.value as AgeGroup)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm">
                {AGE_GROUPS_V3.map(ag => <option key={ag} value={ag}>{ag} years</option>)}
            </select>
          </div>
          
          {/* PIN fields removed for V5 */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Learning Path Focus (Optional)</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {SUBJECTS_LIST.slice(0, 6).map(path => ( 
                <button type="button" key={path} onClick={() => toggleLearningPath(path)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${learningPathFocus.includes(path) ? 'bg-skyBlue text-white border-skyBlue' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>
                  {path}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="learningLevel" className="block text-sm font-medium text-gray-700">Current Learning Level</label>
            <select id="learningLevel" value={currentLearningLevel} onChange={e => setCurrentLearningLevel(e.target.value as LearningLevel)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm">
                {LEARNING_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="screenTime" className="block text-sm font-medium text-gray-700">Daily Screen Time Limit (minutes)</label>
            <input type="number" id="screenTime" value={screenTime} onChange={(e) => setScreenTime(Math.max(10, parseInt(e.target.value)))} min="10" max="180" step="5" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
            <p className="text-xs text-gray-500 mt-1">Recommended: 30-60 minutes.</p>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button type="submit" fullWidth size="lg" className="!font-kidFriendly !text-xl">
            Create Profile & Continue
          </Button>
        </form>
      </Card>
      <p className="text-center text-xs text-gray-500 mt-6">
        You can manage these settings and add more kids later from your Parent Dashboard.
      </p>
    </div>
  );
};

export default ParentSetupScreen;
