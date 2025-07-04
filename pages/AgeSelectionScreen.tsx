import React, { useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole, AgeGroup } from '../types';
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
        setViewWithPath(ViewType.ParentSetup, '/parentsetup');
        return;
      }
      setViewWithPath(ViewType.RoleSelection, '/roleselection', {replace: true});
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

    setViewWithPath(ViewType.ParentSetup, '/parentsetup');
  };

  if (appState.currentUserRole === UserRole.Kid && hasOnboardedKid && kidProfile?.ageGroup) {
    setViewWithPath(ViewType.KidHome, '/kidhome', { replace: true });
    return (
      <View style={styles.centeredContainer}>
        <Text>Redirecting...</Text>
      </View>
    );
  }
  
  useEffect(() => {
    if (appState.currentUserRole === UserRole.Kid && !kidProfile && appState.currentKidProfileId) {
      setKidProfile({ ...DEFAULT_KID_PROFILE, id: appState.currentKidProfileId });
      setParentalControls({ ...DEFAULT_PARENTAL_CONTROLS, kidId: appState.currentKidProfileId });
    }
  }, [appState.currentUserRole, appState.currentKidProfileId, kidProfile, setKidProfile, setParentalControls]);

  if (!kidProfile && appState.currentUserRole === UserRole.Kid) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Initializing your adventure...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Image 
          source={{ uri: 'https://picsum.photos/seed/ageselecticonV3/120/120' }} 
          style={styles.avatar}
        />
        <Text style={styles.title}>How old are you?</Text>
        <Text style={styles.subtitle}>
          This helps {APP_NAME} find the best learning adventures for you!
        </Text>
        
        <View style={styles.buttonsContainer}>
          {AGE_GROUPS_V3.map(ageGroup => (
            <Button
              key={ageGroup}
              onPress={() => handleAgeSelectAndProceed(ageGroup)}
              style={[styles.ageButton, { backgroundColor: '#0ea5e9' }]} // sky-500
              textStyle={styles.ageButtonText}
            >
              I'm {ageGroup} Years Old
            </Button>
          ))}
        </View>

        <Button
          onPress={() => setViewWithPath(ViewType.RoleSelection, '/roleselection', { replace: true })}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        >
          Go Back
        </Button>

        <Text style={styles.footerText}>
          A grown-up will help with a few more quick things after this!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fbbf24', // yellow-300
    backgroundImage: 'linear-gradient(to bottom right, #fbbf24, #f97316, #f87171)', // yellow-300 to orange-400 to red-400
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 384, // sm:max-w-sm
    alignItems: 'center',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
    // fontFamily: 'YourDisplayFont',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    color: 'white',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  ageButton: {
    width: '100%',
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  ageButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    // fontFamily: 'KidFriendly',
  },
  backButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
  },
  footerText: {
    marginTop: 24,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    position: 'absolute',
    bottom: 16,
    paddingHorizontal: 16,
  },
});

export default AgeSelectionScreen;