
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { AppContext } from '../../App'; // Assuming App.tsx is now the root and provides context
import { AppViewEnum, UserRole } from '../types';
import { APP_NAME, ACTIVITY_CATEGORIES_CONFIG } from '../constants';
// For icons, you'd use a library like react-native-vector-icons or SVGs
// Placeholder icons used here
import { Ionicons } from '@expo/vector-icons'; // Example, if using Expo and vector icons

const Header: React.FC<{ navigationProps: any }> = ({ navigationProps }) => {
  const context = useContext(AppContext);
  
  // Extract route name and params from navigationProps
  const routeName = navigationProps.route?.name;
  const params = navigationProps.route?.params || {};

  if (!context) return null;
  const { appState, goBack, setViewWithPath, kidProfile, teacherProfile, adminProfile, logout, switchToParentView, currentView } = context;

  const handleBack = () => {
    if (navigationProps.navigation.canGoBack()) {
        navigationProps.navigation.goBack();
    } else {
        goBack(); // Fallback to context goBack if RN nav can't go back (e.g. first screen in stack)
    }
  };
  
  const getTitle = () => {
    if (!appState.currentUserRole) return APP_NAME;

    // Simplified title logic for RN. In a real app, you'd map routeName to titles.
    // The currentView from context might be slightly out of sync with navigation's routeName
    // due to how navigation state updates. Prioritize routeName if available.
    
    const currentRouteName = routeName || AppViewEnum[currentView];

    switch (currentRouteName) {
      case 'KidHome':
        return kidProfile ? `Hi, ${kidProfile.name}!` : "Kid's Home";
      case 'ParentDashboard': return "Parent Dashboard";
      case 'TeacherDashboard': return "Teacher Dashboard";
      case 'AdminDashboard': return "Admin Dashboard";
      case 'Settings': return "Settings";
      case 'CategoryActivitiesScreen':
        const category = ACTIVITY_CATEGORIES_CONFIG.find(c => c.id.toLowerCase() === params.categoryId?.toLowerCase());
        return category?.name || params.categoryName || "Activities";
      case 'CourseDetailView': return "Course Details";
      case 'TeacherProfileView': return "Teacher Profile";
      case 'ChatListScreen': return "My Messages";
      case 'ChatRoomScreen':
        const convo = appState.chatConversations.find((c: any) => c.id === params.conversationId);
        const otherP = convo?.participants.find((p: any) => p.id !== (appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId));
        return otherP ? `Chat with ${otherP.name}` : "Chat";
      // Add more cases as needed based on your route names
      default:
        return currentRouteName ? currentRouteName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim() : APP_NAME;
    }
  };

  const showBackButton = navigationProps.navigation.canGoBack(); // React Navigation provides this

  const isKid = appState.currentUserRole === UserRole.Kid;
  const isParent = appState.currentUserRole === UserRole.Parent;
  const isTeacher = appState.currentUserRole === UserRole.Teacher;
  const isAdmin = appState.currentUserRole === UserRole.Admin;
  const parentIsMasquerading = isKid && appState.currentParentProfileId;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftItems}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>{getTitle()}</Text>
      </View>
      <View style={styles.rightItems}>
        {isKid && kidProfile?.avatar && (
            <Text style={styles.avatarText}>{kidProfile.avatar}</Text>
        )}
        {isTeacher && teacherProfile?.avatarUrl && (
             <TouchableOpacity onPress={() => setViewWithPath(AppViewEnum.TeacherProfileView, 'TeacherProfileView', { teacherId: teacherProfile.id, isEditing: true })} style={styles.iconButton}>
                <Image source={{ uri: teacherProfile.avatarUrl }} style={styles.profileImage} />
            </TouchableOpacity>
        )}
        {isAdmin && (
            <View style={styles.iconButton}>
                <Ionicons name="shield-checkmark" size={26} color="white" />
            </View>
        )}
        {parentIsMasquerading && ( 
             <TouchableOpacity onPress={switchToParentView} style={styles.iconButton}>
                <Ionicons name="home" size={24} color="white" />
            </TouchableOpacity>
        )}
        {(isParent && routeName === 'ParentDashboard' || 
          isTeacher && routeName === 'TeacherDashboard' ||
          isAdmin && routeName === 'AdminDashboard' 
          ) && (
             <TouchableOpacity onPress={() => setViewWithPath(AppViewEnum.Settings, 'Settings')} style={styles.iconButton}>
                <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
        )}
        {appState.currentUserRole && appState.currentUserRole !== UserRole.Kid && ( 
            <TouchableOpacity onPress={logout} style={styles.iconButton}>
                <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 12 : 10, // Adjust for status bar
    backgroundColor: '#0EA5E9', // Default gradient start color (sky-500)
    height: Platform.OS === 'android' ? 56 : 64, // Typical header height
    // For gradient, you might need a library like expo-linear-gradient
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // If not using a dedicated status bar component
  },
  leftItems: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow title to take available space
  },
  rightItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginHorizontal: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    fontFamily: 'FredokaOne-Regular', // Assuming Fredoka One is loaded
    maxWidth: '80%', // Prevent title from overlapping right icons excessively
  },
  avatarText: {
    fontSize: 28,
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    overflow: 'hidden', // For text avatars if they have bg
    textAlign: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  }
});

export default Header;
