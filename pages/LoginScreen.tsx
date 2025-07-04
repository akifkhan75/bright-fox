import React, { useState, useContext, useEffect } from 'react';
import { View as RNView, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../App';
import { View, UserRole, TeacherProfile, AdminProfile } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { APP_NAME, DEFAULT_TEACHER_PROFILE, DEFAULT_ADMIN_PROFILE } from '../constants';
// import { ArrowLeftIcon } from 'react-native-vector-icons';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // In React Native, you might get the role from navigation params
    // const roleFromParams = navigation.getParam('role');
    const roleFromParams = route.params?.role;
    if (roleFromParams && Object.values(UserRole).includes(roleFromParams)) {
      setRole(roleFromParams);
    } else {
      context?.setViewWithPath(View.RoleSelection, '/roleselection', {replace: true});
    }
  }, [navigation, context]);

  if (!context) return null;
  const { appState, setAppState, setViewWithPath, setTeacherProfile, setAllTeacherProfiles, allTeacherProfiles, setAdminProfile } = context;

  const handleSubmit = () => {
    setError('');

    // Mock Login Logic
    if (email === "test@example.com" && password === "password") {
      if (role === UserRole.Parent) {
        const parentId = 'parent123'; // Mock parent ID
        setAppState(prev => ({ 
          ...prev, 
          currentUserRole: UserRole.Parent, 
          currentParentProfileId: parentId,
        }));
        setViewWithPath(View.ParentPostLoginSelection, '/parentpostloginselection', {replace: true}); 
      } else if (role === UserRole.Teacher) {
        const teacherId = `teacher_test_${Date.now()}`; 
        const newTeacherProfile: TeacherProfile = { 
          ...DEFAULT_TEACHER_PROFILE, 
          id: teacherId, 
          email: email, 
          name: "Test Teacher" 
        };
        setTeacherProfile(newTeacherProfile); 
        
        setAllTeacherProfiles(prevTeachers => {
            if (!prevTeachers.find(tp => tp.id === newTeacherProfile.id)) {
                return [...prevTeachers, newTeacherProfile];
            }
            return prevTeachers;
        });

        setAppState(prev => ({ 
            ...prev, 
            currentUserRole: UserRole.Teacher, 
            currentTeacherProfileId: teacherId 
        }));
        setViewWithPath(View.TeacherDashboard, '/teacherdashboard', {replace: true});
      } else {
         setError("Invalid role for login.");
      }
    } else if (email === "admin@example.com" && password === "password" && role === UserRole.Admin) {
        const adminId = 'admin001';
        const newAdminProfile: AdminProfile = {
            ...DEFAULT_ADMIN_PROFILE,
            id: adminId,
            email: email,
            name: "App Admin"
        };
        setAdminProfile(newAdminProfile);
        setAppState(prev => ({
            ...prev,
            currentUserRole: UserRole.Admin,
            currentAdminProfileId: adminId,
            adminProfile: newAdminProfile
        }));
        setViewWithPath(View.AdminDashboard, '/admindashboard', {replace: true});
    } else {
      setError("Invalid email or password. (Hint: test@example.com / password or admin@example.com / password for Admin)");
    }
  };

  if (!role) {
    return (
      <RNView style={styles.loadingContainer}>
        <Text>Loading login screen...</Text>
      </RNView>
    );
  }

  return (
    <LinearGradient 
      colors={['#818cf8', '#a855f7', '#ec4899']} 
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <Card style={styles.card}>
        <TouchableOpacity 
          onPress={() => setViewWithPath(View.RoleSelection, '/roleselection')} 
          style={styles.backButton}
          accessibilityLabel="Go back to role selection"
        >
          {/* <ArrowLeftIcon size={24} color="#4b5563" /> */}
        </TouchableOpacity>
        
        <RNView style={styles.header}>
          <Image 
            source={{ uri: `https://picsum.photos/seed/${role}LoginIcon/160/160` }}
            style={styles.avatar}
          />
          <Text style={styles.title}>{role} Login</Text>
          <Text style={styles.subtitle}>Welcome back to {APP_NAME}!</Text>
        </RNView>

        <RNView style={styles.form}>
          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />
          </RNView>

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              required
            />
          </RNView>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button 
            onPress={handleSubmit}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          >
            Log In
          </Button>

          <TouchableOpacity 
            onPress={() => alert('Sign up is not implemented in this demo.')}
            style={styles.signupLink}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupHighlight}>Sign up (demo)</Text>
            </Text>
          </TouchableOpacity>
        </RNView>
      </Card>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#a5b4fc',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3730a3',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  form: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  signupLink: {
    marginTop: 16,
  },
  signupText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  signupHighlight: {
    color: '#4f46e5',
    fontWeight: '500',
  },
});

export default LoginScreen;