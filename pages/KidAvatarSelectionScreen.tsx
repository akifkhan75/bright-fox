import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole } from '../types';
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
      context?.setViewWithPath(ViewType.ParentDashboard, '/parentdashboard', {replace: true});
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading or invalid access...</Text>
        </View>
      );
  }

  const confirmAvatar = () => {
    if (updateKidProfileAndControls) {
        updateKidProfileAndControls(
            { ...kidProfile, avatar: selectedAvatar },
            parentalControls 
        );
        Alert.alert("Success", "Avatar updated!");
        // Navigate back to the kid's detail management screen
        setViewWithPath(ViewType.ParentManageKidDetail, `/parentmanagekiddetail/${kidProfile.id}`);
    }
  };

  const handleGoBack = () => {
    // Navigate back to the kid's detail management screen
    setViewWithPath(ViewType.ParentManageKidDetail, `/parentmanagekiddetail/${kidProfile.id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Choose Avatar for {kidProfile.name}</Text>
        <Text style={styles.subtitle}>Pick an avatar that {kidProfile.name} will love!</Text>
        
        <View style={styles.selectedAvatarContainer}>
          <Text style={styles.selectedAvatar}>{selectedAvatar}</Text>
        </View>

        <View style={styles.avatarsGrid}>
          {AVATARS.map(avatar => (
            <TouchableOpacity
              key={avatar}
              onPress={() => setSelectedAvatar(avatar)}
              style={[
                styles.avatarButton,
                selectedAvatar === avatar 
                  ? styles.selectedAvatarButton 
                  : styles.unselectedAvatarButton
              ]}
              accessibilityLabel={`Select avatar ${avatar}`}
            >
              <Text style={styles.avatarText}>{avatar}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button 
          onPress={confirmAvatar} 
          fullWidth 
          size="lg" 
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        >
          Set This Avatar
        </Button>
      </Card>
      
      <Button 
        onPress={handleGoBack} 
        style={styles.backButton}
        textStyle={styles.backButtonText}
        size="sm"
      >
        Back to {kidProfile.name}'s Settings
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#6ee7b7', // green-300 as base for gradient
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d9488', // teal-600
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#4b5563', // gray-600
    marginBottom: 24,
    textAlign: 'center',
  },
  selectedAvatarContainer: {
    marginVertical: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#2dd4bf', // teal-400
  },
  selectedAvatar: {
    fontSize: 56,
    textAlign: 'center',
  },
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  avatarButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
  },
  selectedAvatarButton: {
    backgroundColor: '#2dd4bf', // teal-400
    borderWidth: 4,
    borderColor: '#ccfbf1', // teal-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unselectedAvatarButton: {
    backgroundColor: '#f3f4f6', // gray-100
  },
  avatarText: {
    fontSize: 32,
  },
  confirmButton: {
    backgroundColor: '#0d9488', // teal-500
  },
  confirmButtonText: {
    fontSize: 18,
  },
  backButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: 'white',
  },
});

export default KidAvatarSelectionScreen;