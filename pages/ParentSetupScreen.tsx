import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, KidProfile, ParentalControls, AgeGroup, LearningLevel, UserRole } from '../types';
import Button from '../components/Button';
import { INTERESTS_SUGGESTIONS, DEFAULT_KID_PROFILE, DEFAULT_PARENTAL_CONTROLS, AGE_GROUPS_V3, LEARNING_LEVELS, SUBJECTS_LIST, APP_NAME } from '../constants';
import Card from '../components/Card';

const ParentSetupScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  const [kidName, setKidName] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(AGE_GROUPS_V3[0]);
  const [learningPathFocus, setLearningPathFocus] = useState<string[]>([]);
  const [currentLearningLevel, setCurrentLearningLevel] = useState<LearningLevel>(LEARNING_LEVELS[0]);
  const [screenTime, setScreenTime] = useState(DEFAULT_PARENTAL_CONTROLS.screenTimeLimit.toString());
  const [error, setError] = useState('');

  if (!context) return null;
  const { setViewWithPath, addKidProfileToParent, appState, setAppState } = context;

  useEffect(() => {
    if (!appState.currentParentProfileId) {
      Alert.alert("Login Required", "Please log in as a parent first.");
      setViewWithPath(ViewType.Login, '/login?role=Parent', { replace: true });
    }
  }, [appState.currentParentProfileId, setViewWithPath]);

  const toggleLearningPath = (path: string) => {
    setLearningPathFocus(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleSubmit = () => {
    setError('');
    
    if (!kidName.trim()) {
      setError("Please enter a name for your child.");
      return;
    }
    if (!appState.currentParentProfileId) {
      setError("Parent session error. Please log in again.");
      return;
    }

    const newKidData: Omit<KidProfile, 'id' | 'parentId' | 'avatar'> = {
      name: kidName.trim() || "Little Explorer",
      ageGroup: selectedAgeGroup,
      interests: [], 
      learningPathFocus: learningPathFocus,
      currentLearningLevel: currentLearningLevel,
    };
    const newControlsData: Omit<ParentalControls, 'kidId'> = {
      ...DEFAULT_PARENTAL_CONTROLS, 
      screenTimeLimit: parseInt(screenTime) || DEFAULT_PARENTAL_CONTROLS.screenTimeLimit,
    };

    const addedKid = addKidProfileToParent(newKidData, newControlsData);

    if (addedKid) {
      Alert.alert(
        "Profile Created", 
        `${addedKid.name}'s profile created! You can set their avatar from the 'Manage Kid' section on your dashboard.`
      );
      setAppState(prev => ({...prev, currentKidProfileId: null, currentUserRole: UserRole.Parent }));
      setViewWithPath(ViewType.ParentPostLoginSelection, '/parentpostloginselection', {replace: true});
    } else {
      setError("Failed to add kid profile. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Setup Your First Child's Profile</Text>
        <Text style={styles.subtitle}>Let's get {APP_NAME} ready for your little one!</Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Child's Name (or Nickname)</Text>
            <TextInput
              style={styles.input}
              value={kidName}
              onChangeText={setKidName}
              placeholder="e.g., Alex"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age Group</Text>
            <View style={styles.selectContainer}>
              {AGE_GROUPS_V3.map(ag => (
                <TouchableOpacity
                  key={ag}
                  style={[
                    styles.ageGroupOption,
                    selectedAgeGroup === ag && styles.selectedAgeGroupOption
                  ]}
                  onPress={() => setSelectedAgeGroup(ag)}
                >
                  <Text style={selectedAgeGroup === ag ? styles.selectedOptionText : styles.optionText}>
                    {ag} years
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Learning Path Focus (Optional)</Text>
            <View style={styles.learningPathContainer}>
              {SUBJECTS_LIST.slice(0, 6).map(path => (
                <TouchableOpacity
                  key={path}
                  style={[
                    styles.learningPathButton,
                    learningPathFocus.includes(path) && styles.selectedLearningPathButton
                  ]}
                  onPress={() => toggleLearningPath(path)}
                >
                  <Text style={learningPathFocus.includes(path) ? styles.selectedPathText : styles.pathText}>
                    {path}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Learning Level</Text>
            <View style={styles.selectContainer}>
              {LEARNING_LEVELS.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.learningLevelOption,
                    currentLearningLevel === level && styles.selectedLearningLevelOption
                  ]}
                  onPress={() => setCurrentLearningLevel(level)}
                >
                  <Text style={currentLearningLevel === level ? styles.selectedOptionText : styles.optionText}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Daily Screen Time Limit (minutes)</Text>
            <TextInput
              style={styles.input}
              value={screenTime}
              onChangeText={(text) => setScreenTime(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#9ca3af"
            />
            <Text style={styles.hintText}>Recommended: 30-60 minutes.</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button 
            onPress={handleSubmit}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
          >
            Create Profile & Continue
          </Button>
        </View>
      </Card>
      <Text style={styles.footerText}>
        You can manage these settings and add more kids later from your Parent Dashboard.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#e0f2fe', // sky-100
  },
  card: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0284c7', // skyBlue
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563', // gray-600
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151', // gray-700
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 6,
    padding: 12,
    backgroundColor: 'white',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageGroupOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    backgroundColor: '#f3f4f6', // gray-100
  },
  selectedAgeGroupOption: {
    backgroundColor: '#0284c7', // skyBlue
    borderColor: '#0284c7',
  },
  learningLevelOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    backgroundColor: '#f3f4f6', // gray-100
  },
  selectedLearningLevelOption: {
    backgroundColor: '#0284c7', // skyBlue
    borderColor: '#0284c7',
  },
  optionText: {
    color: '#374151', // gray-700
  },
  selectedOptionText: {
    color: 'white',
  },
  learningPathContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  learningPathButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    backgroundColor: '#f3f4f6', // gray-100
  },
  selectedLearningPathButton: {
    backgroundColor: '#0284c7', // skyBlue
    borderColor: '#0284c7',
  },
  pathText: {
    fontSize: 12,
    color: '#374151', // gray-700
  },
  selectedPathText: {
    fontSize: 12,
    color: 'white',
  },
  hintText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginTop: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626', // red-600
    textAlign: 'center',
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 18,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ParentSetupScreen;