import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, KidProfile, ParentalControls, AgeGroup, LearningLevel } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { AGE_GROUPS_V3, LEARNING_LEVELS, SUBJECTS_LIST, DEFAULT_PARENTAL_CONTROLS } from '../../constants';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const ParentAddKidScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  const [kidName, setKidName] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(AGE_GROUPS_V3[0]);
  const [learningPathFocus, setLearningPathFocus] = useState<string[]>([]);
  const [currentLearningLevel, setCurrentLearningLevel] = useState<LearningLevel>(LEARNING_LEVELS[0]);
  const [screenTime, setScreenTime] = useState<string>(DEFAULT_PARENTAL_CONTROLS.screenTimeLimit.toString());
  const [error, setError] = useState('');

  if (!context) return null;
  const { addKidProfileToParent, appState } = context;

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
      name: kidName.trim(),
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
      alert(`${addedKid.name}'s profile added successfully! You can change their avatar from the 'Manage' screen.`);
      navigation.navigate('ParentDashboard');
    } else {
      setError("Failed to add kid profile. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Add New Child Profile</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Child's Name</Text>
          <TextInput
            style={styles.input}
            value={kidName}
            onChangeText={setKidName}
            placeholder="e.g., Jamie"
            required
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age Group</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAgeGroup}
              onValueChange={(itemValue) => setSelectedAgeGroup(itemValue as AgeGroup)}
              style={styles.picker}
            >
              {AGE_GROUPS_V3.map(ag => (
                <Picker.Item key={ag} label={`${ag} years`} value={ag} />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Learning Path Focus (Optional)</Text>
          <View style={styles.pathContainer}>
            {SUBJECTS_LIST.slice(0, 6).map(path => (
              <TouchableOpacity
                key={path}
                onPress={() => toggleLearningPath(path)}
                style={[
                  styles.pathButton,
                  learningPathFocus.includes(path) ? styles.pathButtonActive : styles.pathButtonInactive
                ]}
              >
                <Text style={learningPathFocus.includes(path) ? styles.pathButtonTextActive : styles.pathButtonText}>
                  {path}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Learning Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={currentLearningLevel}
              onValueChange={(itemValue) => setCurrentLearningLevel(itemValue as LearningLevel)}
              style={styles.picker}
            >
              {LEARNING_LEVELS.map(level => (
                <Picker.Item key={level} label={level} value={level} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Daily Screen Time Limit (minutes)</Text>
          <TextInput
            style={styles.input}
            value={screenTime}
            onChangeText={(text) => setScreenTime(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            min="10"
            max="180"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Add Child Profile</Text>
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 80,
    backgroundColor: '#e0f2fe',
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
    color: '#0369a1',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
  },
  pathContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  pathButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pathButtonInactive: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  pathButtonActive: {
    backgroundColor: '#0369a1',
    borderColor: '#0369a1',
  },
  pathButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  pathButtonTextActive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#0369a1',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ParentAddKidScreen;