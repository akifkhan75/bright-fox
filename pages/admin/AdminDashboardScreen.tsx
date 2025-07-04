import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, ActivityStatus } from '../../types';
import Card from '../../components/Card';
// import { 
//   ShieldCheckIcon, 
//   EyeIcon, 
//   UserGroupIcon, 
//   AcademicCapIcon, 
//   ArrowRightIcon 
// } from 'react-native-vector-icons'; // You'll need to create or import these icons

const AdminDashboardScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied. Admins only.</Text>
      </View>
    );
  }

  const { appState, allTeacherProfiles, allCourses, allActivities, setViewWithPath } = context;

  const pendingVerifications = useMemo(() => 
    allTeacherProfiles.filter(t => t.verificationStatus === 'Pending').length, 
    [allTeacherProfiles]
  );
  const pendingCourses = useMemo(() => 
    allCourses.filter(c => c.status === ActivityStatus.Pending).length, 
    [allCourses]
  );
  const pendingActivities = useMemo(() => 
    allActivities.filter(a => a.creatorType === 'Teacher' && a.status === ActivityStatus.Pending).length, 
    [allActivities]
  );

  const totalParents = useMemo(() => 
    new Set(appState.kidProfiles.map(kp => kp.parentId).filter(Boolean)).size, 
    [appState.kidProfiles]
  );
  const totalKids = appState.kidProfiles.length;
  const totalTeachers = allTeacherProfiles.length;

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ElementType | string; 
    color?: string; 
    onPress?: () => void 
  }> = ({ title, value, icon: Icon, color = '#0ea5e9', onPress }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Card style={styles.statCard}>
        <View style={styles.statCardContent}>
          <View>
            <Text style={styles.statCardTitle}>{title}</Text>
            <Text style={styles.statCardValue}>{value}</Text>
          </View>
          <View style={[styles.statCardIconContainer, { backgroundColor: color }]}>
            <Icon style={styles.statCardIcon} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const ActionCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ElementType | string; 
    onPress: () => void; 
    badgeCount?: number; 
    badgeColor?: string; 
  }> = ({ title, description, icon: Icon, onPress, badgeCount, badgeColor = '#ef4444' }) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.actionCard}>
        {badgeCount && badgeCount > 0 && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
        <View style={styles.actionCardHeader}>
          <Icon style={styles.actionCardIcon} />
          <Text style={styles.actionCardTitle}>{title}</Text>
        </View>
        <Text style={styles.actionCardDescription}>{description}</Text>
        <View style={styles.actionCardFooter}>
          <Text style={styles.actionCardLink}>
            Go to Section 
            {/* <ArrowRightIcon style={styles.arrowIcon} /> */}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        <StatCard 
          title="Pending Verifications" 
          value={pendingVerifications} 
          icon={'ShieldCheckIcon'} 
          color="#eab308" 
          onPress={() => setViewWithPath(ViewType.AdminTeacherVerificationApproval, '/adminteacherapproval')}
        />
        <StatCard 
          title="Pending Content (Courses)" 
          value={pendingCourses} 
          icon={'AcademicCapIcon'} 
          color="#f97316" 
          onPress={() => setViewWithPath(ViewType.AdminContentModeration, '/admincontentmoderation')}
        />
        <StatCard 
          title="Pending Content (Activities)" 
          value={pendingActivities} 
          icon={'EyeIcon'} 
          color="#ec4899" 
          onPress={() => setViewWithPath(ViewType.AdminContentModeration, '/admincontentmoderation')}
        />
      </View>
      
      <View style={styles.actionsContainer}>
        <ActionCard 
          title="Teacher Approvals" 
          description="Review and approve/reject teacher verification submissions."
          icon={'ShieldCheckIcon'}
          onPress={() => setViewWithPath(ViewType.AdminTeacherVerificationApproval, '/adminteacherapproval')}
          badgeCount={pendingVerifications}
          badgeColor="#eab308"
        />
        <ActionCard 
          title="Content Moderation" 
          description="Review and approve/reject courses and activities created by teachers."
          icon={'EyeIcon'}
          onPress={() => setViewWithPath(ViewType.AdminContentModeration, '/admincontentmoderation')}
          badgeCount={pendingCourses + pendingActivities}
          badgeColor="#f97316"
        />
      </View>
      
      <View style={styles.bottomContainer}>
        <ActionCard 
          title="User Management" 
          description="View user statistics and manage accounts (basic view)."
          icon={'UserGroupIcon'}
          onPress={() => setViewWithPath(ViewType.AdminUserManagement, '/adminusermanagement')}
        />
        <Card style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>App Statistics</Text>
          <View style={styles.statsList}>
            <Text style={styles.statsItem}>
              Total Parents: <Text style={styles.statsValue}>{totalParents}</Text>
            </Text>
            <Text style={styles.statsItem}>
              Total Kids: <Text style={styles.statsValue}>{totalKids}</Text>
            </Text>
            <Text style={styles.statsItem}>
              Total Teachers: <Text style={styles.statsValue}>{totalTeachers}</Text>
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f1f5f9', // slate-100
  },
  deniedContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b', // slate-800
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCardTitle: {
    fontSize: 14,
    color: '#64748b', // slate-500
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#334155', // slate-700
  },
  statCardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardIcon: {
    width: 24,
    height: 24,
    color: 'white',
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    padding: 16,
    backgroundColor: '#f8fafc', // slate-50
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionCardIcon: {
    width: 32,
    height: 32,
    color: '#0284c7', // sky-600
    marginRight: 12,
  },
  actionCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0369a1', // sky-700
  },
  actionCardDescription: {
    fontSize: 14,
    color: '#475569', // slate-600
    marginBottom: 16,
  },
  actionCardFooter: {
    alignItems: 'flex-end',
  },
  actionCardLink: {
    fontSize: 12,
    color: '#0ea5e9', // sky-500
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 12,
    height: 12,
    marginLeft: 4,
    color: '#0ea5e9', // sky-500
  },
  bottomContainer: {
    gap: 16,
  },
  statsCard: {
    padding: 16,
    backgroundColor: '#f8fafc', // slate-50
  },
  statsCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0369a1', // sky-700
    marginBottom: 12,
  },
  statsList: {
    gap: 4,
  },
  statsItem: {
    fontSize: 14,
    color: '#475569', // slate-600
  },
  statsValue: {
    fontWeight: '600',
  },
});

export default AdminDashboardScreen;