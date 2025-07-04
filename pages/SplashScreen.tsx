import React, { useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole } from '../types';
import { APP_NAME } from '../constants';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SplashScreen: React.FC = () => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (!context) return;
    const { appState, setViewWithPath, hasOnboardedKid, kidProfile } = context;

    const timer = setTimeout(() => {
      if (!appState.currentUserRole) {
        setViewWithPath(ViewType.RoleSelection, '/roleselection', { replace: true });
      } else {
        switch (appState.currentUserRole) {
          case UserRole.Kid:
            if (hasOnboardedKid && kidProfile?.ageGroup) {
              setViewWithPath(ViewType.KidHome, '/kidhome', { replace: true });
            } else {
              setViewWithPath(ViewType.AgeSelection, '/ageselection', {replace: true});
            }
            break;
          case UserRole.Parent:
            setViewWithPath(ViewType.ParentDashboard, '/parentdashboard', { replace: true });
            break;
          case UserRole.Teacher:
            setViewWithPath(ViewType.TeacherDashboard, '/teacherdashboard', { replace: true });
            break;
          default:
            setViewWithPath(ViewType.RoleSelection, '/roleselection', { replace: true });
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [context]);

  if (!context) {
    return (
      <View style={styles.container}>
        <Icon 
          name="star-four-points" 
          size={80} 
          color="#fde047" // yellow-300
          style={styles.pulseIcon}
        />
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://picsum.photos/seed/brightfoxlogoV2/150/150' }}
        style={styles.logo}
      />
      <Text style={styles.appName}>{APP_NAME}</Text>
      <Text style={styles.tagline}>Where Kids Learn, Create, and Grow!</Text>
      
      <ActivityIndicator 
        size="large" 
        color="rgba(255, 255, 255, 0.5)" 
        style={styles.spinner}
      />
      <Text style={styles.loadingMessage}>Initializing your adventure...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#38bdf8', // sky-400 as base color
    // For gradient: You'll need react-native-linear-gradient
    // backgroundImage: 'linear-gradient(to bottom right, #38bdf8, #3b82f6, #4f46e5)'
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  pulseIcon: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    // fontFamily: 'KidFriendly',
    marginBottom: 8,
    color: '#FFD700', // gold
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 1,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    // fontFamily: 'YourDisplayFont',
  },
  tagline: {
    fontSize: 20,
    color: 'white',
    marginBottom: 32,
    // fontFamily: 'YourDisplayFont',
  },
  spinner: {
    marginTop: 32,
  },
  loadingMessage: {
    marginTop: 16,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default SplashScreen;