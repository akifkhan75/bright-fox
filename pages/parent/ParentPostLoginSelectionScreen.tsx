import React, { useContext, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, KidProfile } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
// import SparklesIcon from '../../assets/icons/SparklesIcon';
// import ShieldCheckIcon from '../../assets/icons/ShieldCheckIcon';
// import UserGroupIcon from '../../assets/icons/UserGroupIcon';
import { useNavigation } from '@react-navigation/native';

const ParentPostLoginSelectionScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  if (!context || !context.appState.currentParentProfileId || context.appState.currentUserRole !== UserRole.Parent) {
    navigation.navigate('Login', { role: 'Parent' });
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading or unauthorized...</Text>
      </View>
    );
  }

  const { appState, switchViewToKidAsParent } = context;

  const parentKids = useMemo(() => {
    return appState.kidProfiles.filter(kp => kp.parentId === appState.currentParentProfileId);
  }, [appState.kidProfiles, appState.currentParentProfileId]);

  const navigateToParentDashboard = () => {
    navigation.navigate('ParentDashboard');
  };

  const navigateToAddKid = () => {
    navigation.navigate('ParentAddKid');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* <SparklesIcon width={64} height={64} fill="#facc15" style={styles.sparkleIcon} /> */}
        <Text>Icon</Text>
        <Text style={styles.title}>Welcome Back, Parent!</Text>
        <Text style={styles.subtitle}>What would you like to do?</Text>

        <View style={styles.buttonContainer}>
          <Button 
            onPress={navigateToParentDashboard}
            style={styles.dashboardButton}
          >
            {/* <ShieldCheckIcon width={28} height={28} fill="#ffffff" style={styles.buttonIcon} /> */}
            <Text>Icon</Text>
            <Text style={styles.buttonText}>Go to Parent Dashboard</Text>
          </Button>

          {parentKids.length > 0 ? (
            <>
              <Text style={styles.orText}>- OR -</Text>
              <Text style={styles.switchTitle}>Switch to a Child's View:</Text>
              <ScrollView 
                style={styles.kidsScroll}
                contentContainerStyle={styles.kidsScrollContent}
              >
                {parentKids.map(kid => (
                  <Button
                    key={kid.id}
                    onPress={() => switchViewToKidAsParent(kid.id)}
                    style={styles.kidButton}
                  >
                    <Text style={styles.kidAvatar}>{kid.avatar}</Text>
                    <Text style={styles.kidName}>View as {kid.name}</Text>
                  </Button>
                ))}
              </ScrollView>
            </>
          ) : (
            <Button
              onPress={navigateToAddKid}
              style={styles.addKidButton}
            >
              <Text style={styles.addKidText}>Add Your First Child</Text>
            </Button>
          )}
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'purple',
    backgroundImage: 'linear-gradient(to bottom right, #a78bfa, #ec4899, #ef4444)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  sparkleIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  dashboardButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    marginVertical: 16,
  },
  switchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  kidsScroll: {
    maxHeight: 240,
    marginBottom: 16,
  },
  kidsScrollContent: {
    paddingHorizontal: 4,
  },
  kidButton: {
    backgroundColor: '#ec4899',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  kidAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  kidName: {
    fontSize: 18,
    color: 'white',
  },
  addKidButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
  },
  addKidText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default ParentPostLoginSelectionScreen;