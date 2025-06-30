import React, { useContext, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, ActivityStatus, Course } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const TeacherDashboardScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading teacher dashboard or not authorized...</Text>
      </View>
    );
  }

  const { teacherProfile, setViewWithPath, allCourses, allActivities } = context;

  const teacherCreatedCourses = useMemo(() => {
    return allCourses.filter(course => course.teacherId === teacherProfile.id);
  }, [allCourses, teacherProfile.id]);
  
  const teacherCreatedActivities = useMemo(() => {
    return allActivities.filter(act => act.creatorId === teacherProfile.id && act.creatorType === 'Teacher');
  }, [allActivities, teacherProfile.id]);

  const activeCourses = teacherCreatedCourses.filter(c => c.status === ActivityStatus.Active).length;
  const pendingCourses = teacherCreatedCourses.filter(c => c.status === ActivityStatus.Pending).length;
  const approvedActivities = teacherCreatedActivities.filter(act => act.status === ActivityStatus.Approved).length;

  const verificationStatusText = {
    NotSubmitted: "Not Verified (Submit Docs)",
    Pending: "Verification Pending",
    Verified: "Verified Teacher",
    Rejected: "Verification Rejected",
  };
  const verificationStatusColor = {
    NotSubmitted: "#9ca3af",
    Pending: "#eab308",
    Verified: "#10b981",
    Rejected: "#ef4444",
  };

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color?: string; style?: any }> = ({ title, value, icon, color = '#0ea5e9', style }) => (
    <Card style={[styles.statCard, style]}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );

  const DashboardCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    color: string; 
    bgColor?: string;
    onPress: () => void;
  }> = ({ title, description, icon, color, bgColor, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.dashboardCard, { borderColor: color, backgroundColor: bgColor }]}>
        <View style={styles.dashboardCardContent}>
          <View style={{ color }}>
            {icon}
          </View>
          <View style={styles.dashboardCardText}>
            <Text style={[styles.dashboardCardTitle, { color }]}>{title}</Text>
            <Text style={styles.dashboardCardDescription}>{description}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: teacherProfile.avatarUrl || 'https://picsum.photos/seed/defaultteacher/80/80' }} 
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Welcome, {teacherProfile.name}!</Text>
            <Text style={styles.profileSubtitle}>Your Creator Dashboard</Text>
          </View>
          <View style={[styles.verificationBadge, { backgroundColor: verificationStatusColor[teacherProfile.verificationStatus || 'NotSubmitted'] }]}>
            <Text style={styles.verificationText}>
              {verificationStatusText[teacherProfile.verificationStatus || 'NotSubmitted']}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#f59e0b" />
          <Text style={styles.ratingText}>
            Rating: {teacherProfile.ratingAverage?.toFixed(1) || 'N/A'} ({teacherProfile.ratingCount || 0} reviews)
          </Text>
        </View>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Active Courses" 
          value={activeCourses} 
          icon={<Icon name="school" size={24} color="white" />} 
          color="#10b981" 
        />
        <StatCard 
          title="Courses Pending" 
          value={pendingCourses} 
          icon={<MaterialIcons name="description" size={24} color="white" />} 
          color="#eab308" 
        />
        <StatCard 
          title="Approved Activities" 
          value={approvedActivities} 
          icon={<Icon name="lightbulb-on" size={24} color="white" />} 
          color="#3b82f6" 
        />
        <StatCard 
          title="Total Earnings" 
          value="$123" 
          icon={<FontAwesome name="dollar" size={24} color="white" />} 
          color="#0ea5e9" 
        />
      </View>

      {/* Dashboard Cards Grid */}
      <View style={styles.dashboardGrid}>
        <DashboardCard
          title="Create New Content"
          description="Design long courses or short, fun activities."
          icon={<Icon name="plus-circle" size={32} color="#0d9488" />}
          color="#0d9488"
          bgColor="#ccfbf1"
          onPress={() => setViewWithPath(ViewType.ActivityBuilder, '/activitybuilder')}
        />
        <DashboardCard
          title="Manage My Content"
          description="View, edit, or unpublish your courses & activities."
          icon={<MaterialIcons name="description" size={32} color="#0891b2" />}
          color="#0891b2"
          onPress={() => setViewWithPath(ViewType.TeacherContentManagement, '/teachercontent')}
        />
        <DashboardCard
          title="My Teacher Profile"
          description="View and edit your public profile details."
          icon={<Icon name="school" size={32} color="#7e22ce" />}
          color="#7e22ce"
          onPress={() => setViewWithPath(ViewType.TeacherProfileView, `/teacherprofileview/${teacherProfile.id}`, {state: {isEditing: true}})}
        />
        <DashboardCard
          title="My Messages"
          description="Communicate with parents."
          icon={<Icon name="message-text" size={32} color="#be185d" />}
          color="#be185d"
          bgColor="#fce7f3"
          onPress={() => setViewWithPath(ViewType.ChatListScreen, '/chatlistscreen')}
        />
        <DashboardCard
          title="Verification Center"
          description="Manage your verification documents and status."
          icon={<Icon name="shield-check" size={32} color="#ea580c" />}
          color="#ea580c"
          onPress={() => setViewWithPath(ViewType.TeacherVerificationView, '/teacherverificationview')}
        />
        <DashboardCard
          title="Earnings & Payouts"
          description="Track revenue from premium content."
          icon={<FontAwesome name="dollar" size={32} color="#0284c7" />}
          color="#0284c7"
          onPress={() => setViewWithPath(ViewType.TeacherEarnings, '/teacherearnings')}
        />
      </View>

      {/* Settings Button */}
      <View style={styles.settingsButtonContainer}>
        <Button
          onPress={() => setViewWithPath(ViewType.Settings, '/settings')}
          style={styles.settingsButton}
          textStyle={styles.settingsButtonText}
        >
          <Feather name="settings" size={16} color="#4b5563" />
          <Text style={styles.settingsButtonText}> Account Settings</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#14b8a6',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  verificationText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  dashboardGrid: {
    gap: 12,
    marginBottom: 16,
  },
  dashboardCard: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
  },
  dashboardCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashboardCardText: {
    flex: 1,
    marginLeft: 12,
  },
  dashboardCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  dashboardCardDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  settingsButtonContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'transparent',
  },
  settingsButtonText: {
    color: '#4b5563',
    fontSize: 14,
  },
});

export default TeacherDashboardScreen;