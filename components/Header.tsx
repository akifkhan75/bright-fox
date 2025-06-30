import React, { useContext } from 'react';
import { View as RNView, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeftIcon, Cog6ToothIcon, UserCircleIcon, ArrowRightOnRectangleIcon, AcademicCapIcon, HomeModernIcon, ShieldCheckIcon } from 'react-native-heroicons/solid';
import { AppContext } from '../App';
import { View, UserRole } from '../types';
import { APP_NAME, ACTIVITY_CATEGORIES_CONFIG } from '../constants';

const IconButton = ({ icon, onClick, ariaLabel, style }: { icon: React.ReactNode, onClick: () => void, ariaLabel: string, style?: any }) => {
  return (
    <TouchableOpacity 
      onPress={onClick} 
      accessibilityLabel={ariaLabel}
      style={[styles.iconButton, style]}
    >
      {icon}
    </TouchableOpacity>
  );
};

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();

  if (!context) return null;
  const { appState, currentView, goBack, setViewWithPath, kidProfile, teacherProfile, adminProfile, logout, switchToParentView } = context;

  const handleBack = () => {
    goBack();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  
  const getTitle = () => {
    if (!appState.currentUserRole) return APP_NAME;

    switch (currentView) {
      // Kid Views
      case View.KidHome:
        return kidProfile ? `Hi, ${kidProfile.name}!` : "Kid's Home";
      case View.KidAchievements:
        return "My Achievements";
      case View.KidLearningPathView: 
        return "My Learning Path";
      case View.LiveClassPlaceholderView: 
        return "Live Class";
      case View.DrawAndTell:
        return "Draw & Tell";
      case View.WhyZone:
        return "Why Zone";
      case View.EmotionalLearning:
        return "My Feelings";
      
      // Parent Views
      case View.ParentDashboard:
        return "Parent Dashboard";
      case View.ParentAddKid: 
        return "Add New Kid";
      case View.ParentManageKidDetail: 
        const kidId = route.params?.kidId;
        const managedKid = kidId ? appState.kidProfiles.find(kp => kp.id === kidId) : null;
        return managedKid ? `${managedKid.name}'s Settings` : "Manage Kid";
      case View.ParentCourseDiscoveryView: 
        return "Discover Courses";
      case View.CourseDetailView: 
        return "Course Details";
      case View.TeacherProfileView: 
        return "Teacher Profile"; 
      case View.Settings:
        return "Settings";
      case View.CompareProgress:
        return "Compare Progress";
      case View.ParentPostLoginSelection:
        return "Welcome Parent!";
      case View.ChatListScreen:
        return "My Messages";
      case View.ChatRoomScreen:
        const conversationId = route.params?.conversationId;
        const convo = appState.chatConversations.find(c => c.id === conversationId);
        const otherParticipant = convo?.participants.find(p => p.id !== (appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId));
        return otherParticipant ? `Chat with ${otherParticipant.name}` : "Chat";

      // Teacher Views
      case View.TeacherDashboard:
        return "Teacher Dashboard";
      case View.ActivityBuilder:
        return "Content Builder"; 
      case View.TeacherContentManagement:
        return "My Content";
      case View.TeacherEarnings:
        return "My Earnings";
      case View.TeacherVerificationView: 
        return "Verification Center";
      
      // Admin Views
      case View.AdminDashboard:
        return "Admin Dashboard";
      case View.AdminTeacherVerificationApproval:
        return "Teacher Approvals";
      case View.AdminContentModeration:
        return "Content Moderation";
      case View.AdminUserManagement:
        return "User Management";
      
      case View.CountingGameScreen: return "Counting Fun";
      case View.FairytaleReaderScreen: return "Story Time";
      case View.CategoryActivitiesScreen: 
        const catIdParam = route.params?.categoryId;
        const categoryStateName = route.params?.categoryName;
        const catConfig = ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === catIdParam);
        return categoryStateName || catConfig?.name || "Activities";

      case View.AppInfo:
        return "App Info";
      default:
        const viewKey = (Object.keys(View) as Array<keyof typeof View>).find(key => View[key] === currentView);
        if (viewKey) {
            return viewKey
                .replace(/([A-Z])/g, ' $1') 
                .replace(/^./, str => str.toUpperCase()) 
                .trim();
        }
        return APP_NAME;
    }
  };

  const showBackButton = ![
    View.Splash, View.RoleSelection, View.Login, 
    View.KidHome, View.ParentDashboard, View.TeacherDashboard, View.AdminDashboard, View.ParentPostLoginSelection
    ].includes(currentView);

  const isKid = appState.currentUserRole === UserRole.Kid;
  const isParent = appState.currentUserRole === UserRole.Parent;
  const isTeacher = appState.currentUserRole === UserRole.Teacher;
  const isAdmin = appState.currentUserRole === UserRole.Admin;
  const parentIsMasquerading = isKid && appState.currentParentProfileId;

  return (
    <RNView style={styles.header}>
      <RNView style={styles.leftContainer}>
        {showBackButton && (
          <IconButton
            icon={<ArrowLeftIcon size={24} color="white" />}
            onClick={handleBack}
            ariaLabel="Go back"
            style={styles.backButton}
          />
        )}
        <Text style={styles.title} numberOfLines={1}>{getTitle()}</Text>
      </RNView>
      <RNView style={styles.rightContainer}>
        {isKid && kidProfile?.avatar && (
            <Text style={styles.avatarText}>{kidProfile.avatar}</Text>
        )}
        
        {isTeacher && teacherProfile && (
             <IconButton 
                icon={
                  <Image 
                    source={{ uri: teacherProfile.avatarUrl || 'https://picsum.photos/seed/defaultteacher/40/40' }} 
                    style={styles.teacherAvatar}
                  />
                }
                onClick={() => setViewWithPath(View.TeacherProfileView, `/teacherprofileview/${teacherProfile.id}`, { state: {isEditing: true} })} 
                ariaLabel="My Teacher Profile"
                style={styles.teacherButton}
            />
        )}

        {isAdmin && adminProfile && (
             <IconButton 
                icon={<ShieldCheckIcon size={28} color="white" />}
                ariaLabel={`Admin: ${adminProfile.name}`}
                style={styles.adminButton}
            />
        )}

        {parentIsMasquerading && ( 
             <IconButton 
                icon={<HomeModernIcon size={28} color="white" />}
                onClick={switchToParentView}
                ariaLabel="Back to Parent View"
                style={styles.parentButton}
            />
        )}
        
        {((isParent && currentView === View.ParentDashboard) || 
          (isTeacher && currentView === View.TeacherDashboard) ||
          (isAdmin && currentView === View.AdminDashboard) 
          ) && (
             <IconButton 
                icon={<Cog6ToothIcon size={28} color="white" />}
                onClick={() => setViewWithPath(View.Settings, '/settings')} 
                ariaLabel="Settings"
                style={styles.settingsButton}
            />
        )}

        {appState.currentUserRole && appState.currentUserRole !== UserRole.Kid && ( 
            <IconButton
                icon={<ArrowRightOnRectangleIcon size={28} color="white" />}
                onClick={logout} 
                ariaLabel="Logout"
                style={styles.logoutButton}
            />
        )}
      </RNView>
    </RNView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#0ea5e9', // sky-500 equivalent
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 60,
    maxWidth: 420,
    marginHorizontal: 'auto',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    overflow: 'hidden',
  },
  iconButton: {
    padding: 4,
    borderRadius: 20,
  },
  backButton: {
    marginRight: 8,
  },
  avatarText: {
    fontSize: 24,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  teacherAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  teacherButton: {
    padding: 2,
  },
  adminButton: {
    padding: 4,
  },
  parentButton: {
    padding: 4,
  },
  settingsButton: {
    padding: 4,
  },
  logoutButton: {
    padding: 6,
  },
});

export default Header;