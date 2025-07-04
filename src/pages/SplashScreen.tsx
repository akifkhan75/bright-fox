
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient'; // For gradient background
import { AppContext } from '../../App'; // Assuming App.tsx is root
import { AppViewEnum, UserRole, KidProfile } from '../types'; // Renamed View to AppViewEnum, Imported KidProfile
import { APP_NAME } from '../constants';
// Use an icon library or local image for sparkles
// import { Ionicons } from '@expo/vector-icons'; // Example

const SplashScreen: React.FC = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (!context) return;
    const { appState, setViewWithPath, hasOnboardedKid, kidProfile } = context;

    const timer = setTimeout(() => {
      if (!appState.currentUserRole) {
        setViewWithPath(AppViewEnum.RoleSelection, 'RoleSelection', { replace: true });
      } else {
        switch (appState.currentUserRole) {
          case UserRole.Kid:
            if (kidProfile && kidProfile.ageGroup) { 
              setViewWithPath(AppViewEnum.KidHome, 'KidHome', { replace: true });
            } else {
              if (kidProfile?.parentId) {
                context.setAppState((prev: any) => ({...prev, currentUserRole: UserRole.Parent, currentKidProfileId: null }));
                setViewWithPath(AppViewEnum.ParentPostLoginSelection, 'ParentPostLoginSelection', {replace: true});
              } else {
                setViewWithPath(AppViewEnum.AgeSelection, 'AgeSelection', {replace: true});
              }
            }
            break;
          case UserRole.Parent:
             if (appState.kidProfiles.filter((k: KidProfile) => k.parentId === appState.currentParentProfileId).length === 0) {
                setViewWithPath(AppViewEnum.ParentSetup, 'ParentSetup', { replace: true });
            } else {
                setViewWithPath(AppViewEnum.ParentPostLoginSelection, 'ParentPostLoginSelection', { replace: true });
            }
            break;
          case UserRole.Teacher:
            setViewWithPath(AppViewEnum.TeacherDashboard, 'TeacherDashboard', { replace: true });
            break;
          case UserRole.Admin:
            setViewWithPath(AppViewEnum.AdminDashboard, 'AdminDashboard', { replace: true });
            break;
          default:
            setViewWithPath(AppViewEnum.RoleSelection, 'RoleSelection', { replace: true });
        }
      }
    }, 2000); // Splash screen duration

    return () => clearTimeout(timer);
  }, [context]);

  if (!context) {
    return (
      <LinearGradient colors={['#38BDF8', '#3B82F6', '#6366F1']} style={styles.container}>
        <Text style={[styles.appName, styles.fontKidFriendly]}>{APP_NAME}</Text>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    );
  }
  
  return (
    <LinearGradient colors={['#38BDF8', '#3B82F6', '#6366F1']} style={styles.container}>
      <Image 
        source={{ uri: 'https://picsum.photos/seed/brightfoxlogoV2/150/150' }} 
        style={styles.logo} 
      />
      <Text style={[styles.appName, styles.fontKidFriendly]}>{APP_NAME}</Text>
      <Text style={[styles.tagline, styles.fontDisplay]}>Where Kids Learn, Create, and Grow!</Text>
      
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="rgba(255,255,255,0.5)" />
      </View>
      <Text style={styles.loadingText}>Initializing your adventure...</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 144,
    height: 144,
    borderRadius: 72,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'white',
  },
  appName: {
    fontSize: 48, 
    fontWeight: 'bold',
    color: '#FFD700', 
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tagline: {
    fontSize: 18, 
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  fontKidFriendly: {
    fontFamily: 'Baloo2-Bold', 
  },
  fontDisplay: {
    fontFamily: 'FredokaOne-Regular',
  },
});

export default SplashScreen;
