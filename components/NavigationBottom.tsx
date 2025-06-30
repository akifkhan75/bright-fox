import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppContext } from '../App';
import { View as ViewType, UserRole } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.navItem}
      activeOpacity={0.7}
      accessibilityLabel={label}
    >
      <View style={[styles.iconContainer, isActive && styles.activeIcon]}>
        {React.cloneElement(icon, {
          size: 22,
          color: isActive ? '#0ea5e9' : '#9ca3af',
        })}
      </View>
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const NavigationBottom: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appState, currentView, setViewWithPath } = context;

  let navItems: Array<{ id: ViewType; icon: React.ReactElement; label: string }> = [];

  if (appState.currentUserRole === UserRole.Kid) {
    navItems = [
      { id: ViewType.KidHome, icon: <MaterialCommunityIcons name="home" />, label: 'Home' },
      { id: ViewType.KidAchievements, icon: <MaterialCommunityIcons name="star" />, label: 'Awards' },
      { id: ViewType.KidLearningPathView, icon: <MaterialCommunityIcons name="book-open" />, label: 'Courses' },
      { id: ViewType.AppInfo, icon: <MaterialCommunityIcons name="information" />, label: 'Info' },
    ];
  } else if (appState.currentUserRole === UserRole.Parent) {
    navItems = [
      { id: ViewType.ParentDashboard, icon: <MaterialCommunityIcons name="account" />, label: 'Dashboard' },
      { id: ViewType.ParentCourseDiscoveryView, icon: <MaterialCommunityIcons name="magnify" />, label: 'Discover' },
      { id: ViewType.ParentDashboard, icon: <MaterialCommunityIcons name="account-group" />, label: 'Manage Kids' },
      { id: ViewType.ChatListScreen, icon: <MaterialCommunityIcons name="message-text" />, label: 'Chats' },
    ];
  } else if (appState.currentUserRole === UserRole.Teacher) {
    navItems = [
      { id: ViewType.TeacherDashboard, icon: <MaterialCommunityIcons name="school" />, label: 'Dashboard' },
      { id: ViewType.TeacherContentManagement, icon: <MaterialCommunityIcons name="file-document" />, label: 'Content' },
      { id: ViewType.ChatListScreen, icon: <MaterialCommunityIcons name="message-text" />, label: 'Chats' },
      { id: ViewType.TeacherEarnings, icon: <MaterialCommunityIcons name="currency-usd" />, label: 'Earnings' },
    ];
  } else if (appState.currentUserRole === UserRole.Admin) {
    navItems = [
      { id: ViewType.AdminDashboard, icon: <MaterialCommunityIcons name="home" />, label: 'Dashboard' },
      { id: ViewType.AdminTeacherVerificationApproval, icon: <MaterialCommunityIcons name="shield-check" />, label: 'Verify' },
      { id: ViewType.AdminContentModeration, icon: <MaterialCommunityIcons name="eye" />, label: 'Moderate' },
      { id: ViewType.AdminUserManagement, icon: <MaterialCommunityIcons name="account-group" />, label: 'Users' },
    ];
  }

  if (navItems.length === 0) return null;

  const handleNavClick = (viewId: ViewType, itemLabel: string) => {
    let path = `/${ViewType[viewId].toLowerCase()}`;
    
    if (itemLabel === 'Manage Kids' && viewId === ViewType.ParentDashboard && appState.currentUserRole === UserRole.Parent) {
      setViewWithPath(ViewType.ParentDashboard, path); 
      return;
    }
    setViewWithPath(viewId, path);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <NavItem
          key={`${item.id}-${item.label}`}
          icon={item.icon}
          label={item.label}
          isActive={currentView === item.id || (item.label === 'Manage Kids' && currentView === ViewType.ParentDashboard)}
          onPress={() => handleNavClick(item.id, item.label)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 10,
    maxWidth: 420,
    alignSelf: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconContainer: {
    marginBottom: 4,
  },
  activeIcon: {
    // Additional active icon styles if needed
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#0ea5e9',
  },
});

export default NavigationBottom;