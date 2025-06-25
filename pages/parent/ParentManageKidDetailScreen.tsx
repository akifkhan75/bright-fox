
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { View, KidProfile, ParentalControls, LearningLevel, AgeGroup } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { LEARNING_LEVELS, SUBJECTS_LIST, DEFAULT_PARENTAL_CONTROLS, AGE_GROUPS_V3 } from '../../constants';
import { PencilIcon, ClockIcon, BookOpenIcon, ArrowPathIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const ParentManageKidDetailScreen: React.FC = () => {
  const context = useContext(AppContext);
  const { kidId } = useParams<{ kidId: string }>();
  const navigate = useNavigate();

  const [managedKid, setManagedKid] = useState<KidProfile | null>(null);
  const [kidControls, setKidControls] = useState<ParentalControls | null>(null);

  // Local form state
  const [localName, setLocalName] = useState('');
  // Avatar is managed via KidAvatarSelectionScreen
  const [localScreenTime, setLocalScreenTime] = useState(0);
  const [localLearningPath, setLocalLearningPath] = useState<string[]>([]);
  const [localLearningLevel, setLocalLearningLevel] = useState<LearningLevel>('Basic');
  const [localAgeGroup, setLocalAgeGroup] = useState<AgeGroup | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (context && kidId) {
      const foundKid = context.appState.kidProfiles.find(kp => kp.id === kidId && kp.parentId === context.appState.currentParentProfileId);
      if (foundKid) {
        setManagedKid(foundKid);
        setLocalName(foundKid.name);
        // Avatar is displayed from foundKid.avatar, but selection is separate
        setLocalLearningPath(foundKid.learningPathFocus || []);
        setLocalLearningLevel(foundKid.currentLearningLevel || 'Basic');
        setLocalAgeGroup(foundKid.ageGroup);

        const controls = context.appState.parentalControlsMap[kidId] || {...DEFAULT_PARENTAL_CONTROLS, kidId: kidId};
        setKidControls(controls);
        setLocalScreenTime(controls.screenTimeLimit);

      } else {
        alert("Kid profile not found or access denied.");
        navigate('/parentdashboard');
      }
    }
  }, [context, kidId, navigate]);

  if (!context || !managedKid || !kidControls) {
    return <div className="p-4 text-center">Loading kid details...</div>;
  }
  const { updateKidProfileAndControls, setViewWithPath, setAppState } = context;

  const toggleLearningPath = (path: string) => {
    setLocalLearningPath(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };
  
  const handleSaveChanges = () => {
    setError('');
    if (!localName.trim()) {
        setError("Kid's name cannot be empty.");
        return;
    }

    const updatedKidProfile: KidProfile = {
      ...managedKid,
      name: localName,
      // Avatar is not changed here, but taken from managedKid (which is updated by KidAvatarSelectionScreen)
      learningPathFocus: localLearningPath,
      currentLearningLevel: localLearningLevel,
      ageGroup: localAgeGroup,
    };
    const updatedControls: ParentalControls = {
      ...kidControls,
      screenTimeLimit: localScreenTime,
    };

    updateKidProfileAndControls(updatedKidProfile, updatedControls);
    alert("Profile updated successfully!");
  };

  const handleChangeAvatar = () => {
    // Set this kid as active and navigate to avatar selection. Parent role maintained in AppState.
    setAppState(prev => ({...prev, currentKidProfileId: managedKid.id}));
    setViewWithPath(View.KidAvatarSelection, `/kidavatarselection`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 pt-20"> {/* pt-20 for header */}
      <Card className="max-w-lg mx-auto">
        <div className="flex items-center space-x-4 mb-6">
            <span className="text-6xl p-2 bg-sky-100 rounded-full">{managedKid.avatar}</span>
            <div>
                 <h2 className="text-2xl font-bold text-sky-700 font-display">{localName}'s Settings</h2>
                 <p className="text-sm text-gray-500">Manage learning experience and controls.</p>
            </div>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="kidName" className="block text-sm font-medium text-gray-700">Child's Name</label>
            <input type="text" id="kidName" value={localName} onChange={(e) => setLocalName(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          
          <div>
            <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">Age Group</label>
            <select id="ageGroup" value={localAgeGroup || ''} onChange={e => setLocalAgeGroup(e.target.value as AgeGroup)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm">
                {AGE_GROUPS_V3.map(ag => <option key={ag} value={ag}>{ag} years</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar</label>
            <div className="mt-1 flex items-center">
                <span className="text-4xl p-1 bg-gray-100 rounded-lg mr-3">{managedKid.avatar}</span>
                <Button type="button" onClick={handleChangeAvatar} variant="ghost">
                    <UserCircleIcon className="h-5 w-5 mr-1 inline"/> Change Avatar
                </Button>
            </div>
          </div>


          <div>
            <label htmlFor="screenTime" className="block text-sm font-medium text-gray-700">Daily Screen Time Limit</label>
            <div className="flex items-center gap-2 mt-1">
                <input type="range" id="screenTime" min="10" max="180" step="5" value={localScreenTime} 
                       onChange={(e) => setLocalScreenTime(parseInt(e.target.value))}
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-skyBlue"/>
                <span className="text-sm font-semibold text-skyBlue w-16 text-right">{localScreenTime} min</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Learning Path Focus</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {SUBJECTS_LIST.slice(0, 8).map(path => (
                <button type="button" key={path} onClick={() => toggleLearningPath(path)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${localLearningPath.includes(path) ? 'bg-skyBlue text-white border-skyBlue' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}>
                  {path}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="learningLevel" className="block text-sm font-medium text-gray-700">Current Learning Level</label>
            <select id="learningLevel" value={localLearningLevel} onChange={e => setLocalLearningLevel(e.target.value as LearningLevel)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm">
              {LEARNING_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button type="button" onClick={handleSaveChanges} fullWidth size="lg" className="!bg-green-500 hover:!bg-green-600">
            <PencilIcon className="h-5 w-5 mr-2 inline"/> Save Changes
          </Button>
          
          {/* PIN Reset Button Removed for V5 */}
          
          <Button type="button" onClick={() => alert("Mock performance data coming soon!")} fullWidth variant="ghost">
             <ChartBarIcon className="h-5 w-5 mr-2 inline"/> View Performance Report (Mock)
          </Button>

        </form>
      </Card>
    </div>
  );
};

export default ParentManageKidDetailScreen;
