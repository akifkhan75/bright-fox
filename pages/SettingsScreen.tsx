import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AppContext } from '../App';
import Button from '../components/Button';
import Card from '../components/Card';
import { View as ViewType, UserRole, AppState } from '../types';

const SettingsScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appState, setViewWithPath, setAppState } = context;

  const handleResetApp = () => {
    Alert.alert(
      "Reset App Data",
      "Are you sure you want to reset ALL app data? This will clear all profiles (parent, kids, teachers) and settings.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => {
            // Clear storage (implementation depends on your storage solution)
            // For AsyncStorage: AsyncStorage.clear();
            
            // Reset AppState completely
            setAppState({ 
              currentUserRole: null, 
              currentKidProfileId: null, 
              currentParentProfileId: null, 
              currentTeacherProfileId: null,
              currentAdminProfileId: null,
              adminProfile: null,
              kidProfiles: [], 
              parentalControlsMap: {},
              chatConversations: [], 
              chatMessages: [], 
            } as AppState);
            
            setViewWithPath(ViewType.Splash, '/', {replace: true});
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          {appState.currentUserRole === UserRole.Parent && (
            <Card style={styles.parentCard}>
              <Text style={styles.cardTitle}>Manage Kid Profiles & Controls</Text>
              <Text style={styles.cardText}>
                To adjust screen time, learning paths, PINs, or other settings for your children, please go to your Parent Dashboard.
              </Text>
              <Button 
                onPress={() => setViewWithPath(ViewType.ParentDashboard, '/parentdashboard')}
                style={styles.parentButton}
                textStyle={styles.buttonText}
              >
                Go to Parent Dashboard
              </Button>
            </Card>
          )}

          {appState.currentUserRole === UserRole.Teacher && (
            <Card style={styles.teacherCard}>
              <Text style={styles.cardTitle}>Teacher Account</Text>
              <Text style={styles.cardText}>
                Manage your profile, content, and earnings from your Teacher Dashboard.
              </Text>
              <Button 
                onPress={() => setViewWithPath(ViewType.TeacherDashboard, '/teacherdashboard')}
                style={styles.teacherButton}
                textStyle={styles.buttonText}
              >
                Go to Teacher Dashboard
              </Button>
            </Card>
          )}
          
          {appState.currentUserRole === UserRole.Kid && (
            <Card style={styles.kidCard}>
              <Text style={styles.cardTitle}>My Settings</Text>
              <Text style={styles.cardText}>
                Most settings are managed by your parent. If you need help, ask a grown-up!
              </Text>
            </Card>
          )}

          <View style={styles.divider} />
          <Text style={styles.warningTitle}>App Data</Text>
          <Text style={styles.warningText}>Warning: Resetting will erase all profiles and progress stored on this device.</Text>
          <Button 
            onPress={handleResetApp} 
            style={styles.resetButton}
            textStyle={styles.resetButtonText}
          >
            Reset All App Data
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9', // slate-100
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
    color: '#374151', // gray-700
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    gap: 24,
  },
  parentCard: {
    backgroundColor: '#f0f9ff', // sky-50
    borderWidth: 1,
    borderColor: '#bae6fd', // sky-200
    padding: 16,
  },
  teacherCard: {
    backgroundColor: '#f0fdf4', // teal-50
    borderWidth: 1,
    borderColor: '#a7f3d0', // teal-200
    padding: 16,
  },
  kidCard: {
    backgroundColor: '#fefce8', // yellow-50
    borderWidth: 1,
    borderColor: '#fef08a', // yellow-200
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  parentCardTitle: {
    color: '#0369a1', // sky-700
  },
  teacherCardTitle: {
    color: '#0f766e', // teal-700
  },
  kidCardTitle: {
    color: '#854d0e', // yellow-700
  },
  cardText: {
    fontSize: 14,
    color: '#4b5563', // gray-600
    marginBottom: 12,
  },
  parentButton: {
    backgroundColor: '#0284c7', // sky-600
  },
  teacherButton: {
    backgroundColor: '#0d9488', // teal-600
  },
  buttonText: {
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb', // gray-200
    marginVertical: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626', // red-600
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#dc2626', // red-600
  },
  resetButtonText: {
    color: 'white',
  },
});

export default SettingsScreen;