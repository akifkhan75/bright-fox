
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// For icons, you'd use a library like react-native-vector-icons or SVGs
// Placeholder icons (using Ionicons as example)
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../App'; // Assuming App.tsx is now the root
import { AppViewEnum, UserRole } from '../types'; // Renamed View to AppViewEnum to avoid conflict

// This component is a custom tab bar. It would be passed to `tabBar` prop of Tab.Navigator
// For simplicity, this is a standalone component representation. Actual integration
// with React Navigation's `createBottomTabNavigator` would involve mapping `state.routes`
// and using `navigation.navigate`.

interface RNNavigationBottomProps {
  // Props that would be passed by React Navigation if used as custom tabBar
  state?: any; 
  descriptors?: any;
  navigation?: any;
}

const RNNavigationBottom: React.FC<RNNavigationBottomProps> = ({ state, descriptors, navigation }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appState, setViewWithPath, currentView } = context; // currentView is from AppContext

  const getNavItems = () => {
    switch (appState.currentUserRole) {
      case UserRole.Kid:
        return [
          { id: AppViewEnum.KidHome, routeName: 'KidHome', iconName: 'home', label: 'Home' },
          { id: AppViewEnum.KidAchievements, routeName: 'KidAchievements', iconName: 'star', label: 'Awards' },
          { id: AppViewEnum.KidLearningPathView, routeName: 'KidLearningPathView', iconName: 'book', label: 'Courses' },
          { id: AppViewEnum.AppInfo, routeName: 'AppInfo', iconName: 'information-circle', label: 'Info' },
        ];
      case UserRole.Parent:
        return [
          { id: AppViewEnum.ParentDashboard, routeName: 'ParentDashboard', iconName: 'person-circle', label: 'Dashboard' },
          { id: AppViewEnum.ParentCourseDiscoveryView, routeName: 'ParentCourseDiscoveryView', iconName: 'search', label: 'Discover' },
          // "Manage Kids" could be a specific screen or part of Dashboard.
          // For now, let's assume it's part of ParentDashboard view or a dedicated route.
          // To keep it simple, I'll reuse ParentDashboard's ID but label it differently.
          { id: AppViewEnum.ParentDashboard, routeName: 'ParentDashboard', iconName: 'people', label: 'Manage Kids' },
          { id: AppViewEnum.ChatListScreen, routeName: 'ChatListScreen', iconName: 'chatbubbles', label: 'Chats' },
        ];
      case UserRole.Teacher:
        return [
          { id: AppViewEnum.TeacherDashboard, routeName: 'TeacherDashboard', iconName: 'school', label: 'Dashboard' },
          { id: AppViewEnum.TeacherContentManagement, routeName: 'TeacherContentManagement', iconName: 'document-text', label: 'Content' },
          { id: AppViewEnum.ChatListScreen, routeName: 'ChatListScreen', iconName: 'chatbubbles', label: 'Chats' },
          { id: AppViewEnum.TeacherEarnings, routeName: 'TeacherEarnings', iconName: 'cash', label: 'Earnings' },
        ];
      case UserRole.Admin:
        return [
          { id: AppViewEnum.AdminDashboard, routeName: 'AdminDashboard', iconName: 'server', label: 'Dashboard' },
          { id: AppViewEnum.AdminTeacherVerificationApproval, routeName: 'AdminTeacherVerificationApproval', iconName: 'shield-checkmark', label: 'Verify' },
          { id: AppViewEnum.AdminContentModeration, routeName: 'AdminContentModeration', iconName: 'eye', label: 'Moderate' },
          { id: AppViewEnum.AdminUserManagement, routeName: 'AdminUserManagement', iconName: 'people-circle', label: 'Users' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  if (navItems.length === 0) return null;

  const handleNavClick = (viewEnum: AppViewEnum, routeName: string, itemLabel: string) => {
    // If using React Navigation, this would be: navigation.navigate(routeName);
    // For now, using context's setViewWithPath.
    // The 'Manage Kids' special case needs careful handling with React Navigation structure.
    // If 'Manage Kids' is a separate screen in ParentStack, navigate to that screen.
    // If it's a section within ParentDashboard, it might involve setting a param or state.
    if (itemLabel === 'Manage Kids' && viewEnum === AppViewEnum.ParentDashboard && appState.currentUserRole === UserRole.Parent) {
        // This might mean navigating to ParentDashboard with a specific param or just focusing the tab
        // For simplicity with current context, just navigate to ParentDashboard
        setViewWithPath(AppViewEnum.ParentDashboard, routeName); 
    } else {
       setViewWithPath(viewEnum, routeName);
    }
  };

  const currentRouteName = state?.routes[state.index]?.name; // Get current route from React Navigation state

  return (
    <View style={styles.navContainer}>
      {navItems.map((item, index) => {
        // Determine if active based on React Navigation state or AppContext's currentView
        const isActive = currentRouteName === item.routeName || (currentView === item.id && !currentRouteName);
        // Special case for "Manage Kids" tab if it shares a route with ParentDashboard
        const isManageKidsActive = item.label === 'Manage Kids' && (currentView === AppViewEnum.ParentDashboard || currentRouteName === 'ParentDashboard');


        return (
          <TouchableOpacity
            key={item.routeName + item.label}
            style={styles.navItem}
            onPress={() => handleNavClick(item.id, item.routeName, item.label)}
            accessibilityLabel={item.label}
          >
            <Ionicons 
              name={item.iconName as any} 
              size={22} 
              color={isActive || (item.label === 'Manage Kids' && isManageKidsActive) ? '#0EA5E9' : '#6B7280'} // sky-500 or gray-500
            />
            <Text style={[styles.navLabel, (isActive || (item.label === 'Manage Kids' && isManageKidsActive)) && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // white with slight transparency
    height: Platform.OS === 'ios' ? 80 : 60, // Taller on iOS for home indicator
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280', // gray-500
    marginTop: 2,
  },
  activeLabel: {
    color: '#0EA5E9', // sky-500
    fontWeight: '600',
  },
});

export default RNNavigationBottom;
