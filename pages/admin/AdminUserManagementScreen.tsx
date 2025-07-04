import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
// import UserGroupIcon from '../../assets/icons/UserGroupIcon';
// import AcademicCapIcon from '../../assets/icons/AcademicCapIcon';
// import FaceSmileIcon from '../../assets/icons/FaceSmileIcon';
// import ShieldCheckIcon from '../../assets/icons/ShieldCheckIcon';

const AdminUserManagementScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied. Admins only.</Text>
      </View>
    );
  }

  const { appState, allTeacherProfiles } = context;

  const totalParents = useMemo(() => new Set(appState.kidProfiles.map(kp => kp.parentId).filter(Boolean).size), [appState.kidProfiles]);
  const totalKids = appState.kidProfiles.length;
  const totalTeachers = allTeacherProfiles.length;
  const verifiedTeachers = useMemo(() => allTeacherProfiles.filter(t => t.isVerified).length, [allTeacherProfiles]);

  const StatDisplay: React.FC<{ label: string; value: number; icon: React.ElementType | string; color: string }> = 
    ({ label, value, icon: Icon, color }) => (
    <Card style={[styles.statCard, { backgroundColor: `${color}10`, borderColor: color }]}>
      <View style={styles.statContainer}>
        <Icon width={32} height={32} style={[styles.statIcon, { color }]} />
        <View>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
    </Card>
  );

  const featureItems = [
    "Search for users by email or name.",
    "Filter users by role, status (e.g., active, suspended).",
    "View detailed profile information.",
    "Manage account actions (e.g., reset password for parent, edit kid profile, suspend teacher)."
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <UserGroupIcon width={32} height={32} style={styles.headerIcon} /> */}
        <Text style={styles.title}>User Management Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statRow}>
          <StatDisplay label="Total Parents" value={totalParents}  color="#9333ea" />
          <StatDisplay label="Total Kids" value={totalKids} icon={''} color="#db2777" />
        </View>
        <View style={styles.statRow}>
          <StatDisplay label="Total Teachers" value={totalTeachers} icon={''} color="#0d9488" />
          <StatDisplay label="Verified Teachers" value={verifiedTeachers} icon={''} color="#16a34a" />
        </View>
      </View>

      <Card>
        <Text style={styles.subtitle}>Detailed User Lists (Placeholder)</Text>
        <Text style={styles.description}>
          In a full admin dashboard, this section would allow searching, filtering, viewing details,
          and performing actions (e.g., suspend, message, verify manually) on individual user accounts.
        </Text>
        <FlatList
          data={featureItems}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  deniedContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    marginRight: 12,
    color: '#2563eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statsGrid: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 4,
  },
  bullet: {
    marginRight: 8,
    color: '#6b7280',
  },
  listText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default AdminUserManagementScreen;