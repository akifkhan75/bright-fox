import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole } from '../types';
import Button from '../components/Button';
import { APP_NAME } from '../constants';
import Card from '../components/Card';
// Import icons from a React Native library

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const RoleSelectionScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  if (!context) return null;
  const { setViewWithPath, setAppState } = context;

  const handleRoleSelect = (role: UserRole) => {
    if (role === UserRole.Parent) {
      setAppState(prev => ({ ...prev, currentUserRole: UserRole.Parent }));
      navigation.navigate('Login', { role: UserRole.Parent });
    } else if (role === UserRole.Teacher) {
      setAppState(prev => ({ ...prev, currentUserRole: UserRole.Teacher }));
      navigation.navigate('Login', { role: UserRole.Teacher });
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://picsum.photos/seed/brightfoxV2roles/120/120' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to {APP_NAME}!</Text>
      <Text style={styles.subtitle}>Who are you?</Text>

      <View style={styles.buttonsContainer}>
        {/* Parent Button */}
        <Card style={styles.cardButton}>
          <Button
            onPress={() => handleRoleSelect(UserRole.Parent)}
            style={styles.roleButton}
            textStyle={styles.roleButtonText}
          >
            <View style={styles.buttonContent}>
              <Icon 
                name="shield-check" 
                size={40} 
                color="#f9a8d4" // pink-300
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonLabel}>I'm a Parent</Text>
            </View>
          </Button>
        </Card>

        {/* Teacher Button */}
        <Card style={styles.cardButton}>
          <Button
            onPress={() => handleRoleSelect(UserRole.Teacher)}
            style={styles.roleButton}
            textStyle={styles.roleButtonText}
          >
            <View style={styles.buttonContent}>
              <MaterialIcons 
                name="school" 
                size={40} 
                color="#86efac" // green-300
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonLabel}>I'm a Teacher</Text>
            </View>
          </Button>
        </Card>
      </View>

      <Text style={styles.footerText}>
        Select your role to start your learning adventure or creation journey!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#2dd4bf', // teal-400 as base color
    // For gradient: You'll need react-native-linear-gradient
    // backgroundImage: 'linear-gradient(to bottom right, #2dd4bf, #06b6d4, #0284c7)'
  },
  logo: {
    width: 112,
    height: 112,
    borderRadius: 56,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    // fontFamily: 'YourDisplayFont',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm
    gap: 20,
  },
  cardButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)', // Not supported in RN - alternative below
    borderRadius: 12,
    overflow: 'hidden',
    // For blur effect on iOS:
    // ios: {
    //   backdropFilter: 'blur(10px)',
    // }
    // Android may need a different approach
  },
  roleButton: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    paddingVertical: 24,
    borderRadius: 12,
  },
  roleButtonText: {
    color: 'white',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonLabel: {
    fontSize: 24,
    color: 'white',
    // fontFamily: 'KidFriendly',
  },
  footerText: {
    marginTop: 40,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default RoleSelectionScreen;