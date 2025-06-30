import React, { useState, useContext, useEffect } from 'react';
import { View as RNView, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../App';
import { View, KidProfile, ParentalControls, LearningLevel, AgeGroup } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { LEARNING_LEVELS, SUBJECTS_LIST, DEFAULT_PARENTAL_CONTROLS, AGE_GROUPS_V3 } from '../../constants';
import { PencilIcon, ClockIcon, BookOpenIcon, ArrowPathIcon, ChartBarIcon, UserCircleIcon } from 'react-native-heroicons/solid';
import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select';

const ParentManageKidDetailScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { kidId } = route.params;

  const [managedKid, setManagedKid] = useState<KidProfile | null>(null);
  const [kidControls, setKidControls] = useState<ParentalControls | null>(null);
  const [localName, setLocalName] = useState('');
  const [localScreenTime, setLocalScreenTime] = useState(0);
  const [localLearningPath, setLocalLearningPath] = useState<string[]>([]);
  const [localLearningLevel, setLocalLearningLevel] = useState<LearningLevel>('Basic');
  const [localAgeGroup, setLocalAgeGroup] = useState<AgeGroup | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (context && kidId) {
      const foundKid = context.appState.kidProfiles.find(kp => 
        kp.id === kidId && kp.parentId === context.appState.currentParentProfileId
      );
      if (foundKid) {
        setManagedKid(foundKid);
        setLocalName(foundKid.name);
        setLocalLearningPath(foundKid.learningPathFocus || []);
        setLocalLearningLevel(foundKid.currentLearningLevel || 'Basic');
        setLocalAgeGroup(foundKid.ageGroup);

        const controls = context.appState.parentalControlsMap[kidId] || 
          {...DEFAULT_PARENTAL_CONTROLS, kidId: kidId};
        setKidControls(controls);
        setLocalScreenTime(controls.screenTimeLimit);
      } else {
        alert("Kid profile not found or access denied.");
        navigation.goBack();
      }
    }
  }, [context, kidId, navigation]);

  if (!context || !managedKid || !kidControls) {
    return (
      <RNView style={styles.loadingContainer}>
        <Text>Loading kid details...</Text>
      </RNView>
    );
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
    setAppState(prev => ({...prev, currentKidProfileId: managedKid.id}));
    setViewWithPath(View.KidAvatarSelection, `/kidavatarselection`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.mainCard}>
        <RNView style={styles.headerContainer}>
          <RNView style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{managedKid.avatar}</Text>
          </RNView>
          <RNView>
            <Text style={styles.title}>{localName}'s Settings</Text>
            <Text style={styles.subtitle}>Manage learning experience and controls.</Text>
          </RNView>
        </RNView>

        <RNView style={styles.formContainer}>
          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Child's Name</Text>
            <TextInput
              style={styles.textInput}
              value={localName}
              onChangeText={setLocalName}
              placeholder="Enter child's name"
            />
          </RNView>
          
          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Age Group</Text>
            <RNView style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setLocalAgeGroup(value)}
                items={AGE_GROUPS_V3.map(ag => ({
                  label: `${ag} years`,
                  value: ag,
                }))}
                value={localAgeGroup}
                style={pickerSelectStyles}
              />
            </RNView>
          </RNView>

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Avatar</Text>
            <RNView style={styles.avatarChangeContainer}>
              <RNView style={styles.currentAvatarContainer}>
                <Text style={styles.currentAvatarText}>{managedKid.avatar}</Text>
              </RNView>
              <Button 
                onPress={handleChangeAvatar}
                style={styles.changeAvatarButton}
                textStyle={styles.changeAvatarButtonText}
              >
                <UserCircleIcon size={20} color="#3b82f6" style={styles.buttonIcon}/>
                Change Avatar
              </Button>
            </RNView>
          </RNView>

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Daily Screen Time Limit</Text>
            <RNView style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={180}
                step={5}
                value={localScreenTime}
                onValueChange={setLocalScreenTime}
                minimumTrackTintColor="#0ea5e9"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#0ea5e9"
              />
              <Text style={styles.sliderValue}>{localScreenTime} min</Text>
            </RNView>
          </RNView>

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Learning Path Focus</Text>
            <RNView style={styles.learningPathContainer}>
              {SUBJECTS_LIST.slice(0, 8).map(path => (
                <TouchableOpacity
                  key={path}
                  onPress={() => toggleLearningPath(path)}
                  style={[
                    styles.learningPathButton,
                    localLearningPath.includes(path) && styles.learningPathButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.learningPathButtonText,
                    localLearningPath.includes(path) && styles.learningPathButtonTextSelected
                  ]}>
                    {path}
                  </Text>
                </TouchableOpacity>
              ))}
            </RNView>
          </RNView>

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Current Learning Level</Text>
            <RNView style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setLocalLearningLevel(value)}
                items={LEARNING_LEVELS.map(level => ({
                  label: level,
                  value: level,
                }))}
                value={localLearningLevel}
                style={pickerSelectStyles}
              />
            </RNView>
          </RNView>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button 
            onPress={handleSaveChanges}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          >
            <PencilIcon size={20} color="white" style={styles.buttonIcon}/>
            Save Changes
          </Button>
          
          <Button 
            onPress={() => alert("Mock performance data coming soon!")}
            style={styles.performanceButton}
            textStyle={styles.performanceButtonText}
          >
            <ChartBarIcon size={20} color="#3b82f6" style={styles.buttonIcon}/>
            View Performance Report (Mock)
          </Button>
        </RNView>
      </Card>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#1f2937',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#1f2937',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mainCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 40,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  formContainer: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  avatarChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentAvatarContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  currentAvatarText: {
    fontSize: 24,
  },
  changeAvatarButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  changeAvatarButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginRight: 12,
  },
  sliderValue: {
    width: 60,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  learningPathContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  learningPathButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  learningPathButtonSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  learningPathButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  learningPathButtonTextSelected: {
    color: 'white',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  performanceButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
  },
  performanceButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ParentManageKidDetailScreen;