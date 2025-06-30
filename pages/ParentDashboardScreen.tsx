import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole, Course, KidProfile } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
// import { 
//   UsersIcon, UserPlusIcon, MagnifyingGlassIcon, 
//   CreditCardIcon, ShieldCheckIcon, Cog6ToothIcon,
//   EyeIcon, AdjustmentsVerticalIcon
// } from './icons'; // You'll need to create or import these icons

const ParentDashboardScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context || !context.appState.currentParentProfileId || context.appState.currentUserRole !== UserRole.Parent) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading parent dashboard or not authorized...</Text>
      </View>
    );
  }

  const { appState, setViewWithPath, allCourses, allTeacherProfiles, switchViewToKidAsParent } = context; 
  
  const parentKids = useMemo(() => {
    return appState.kidProfiles.filter(kp => kp.parentId === appState.currentParentProfileId);
  }, [appState.kidProfiles, appState.currentParentProfileId]);

  const KidCard: React.FC<{kid: KidProfile}> = ({ kid }) => {
    const enrolledCoursesCount = kid.enrolledCourseIds?.length || 0;

    return (
      <Card style={styles.kidCard}>
        <View style={styles.kidCardHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{kid.avatar}</Text>
          </View>
          <View style={styles.kidInfo}>
            <Text style={styles.kidName}>{kid.name}</Text>
            <Text style={styles.kidDetail}>Age Group: {kid.ageGroup} | Level: {kid.level || 1}</Text>
            <Text style={styles.kidDetail}>Learning Level: {kid.currentLearningLevel}</Text>
          </View>
        </View>
        <Text style={styles.kidMeta}>Enrolled Courses: {enrolledCoursesCount}</Text>
        <Text style={styles.kidMeta}>Learning Focus: {kid.learningPathFocus?.join(', ') || 'General'}</Text>
        <View style={styles.kidButtons}>
          <Button 
            size="sm"
            style={styles.kidViewButton}
            textStyle={styles.kidViewButtonText}
            onPress={() => switchViewToKidAsParent(kid.id)}
          >
            {/* <EyeIcon style={styles.buttonIcon} />  */}
            Kid's View
          </Button>
          <Button 
            size="sm"
            style={styles.manageKidButton}
            textStyle={styles.manageKidButtonText}
            onPress={() => setViewWithPath(ViewType.ParentManageKidDetail, `/parentmanagekiddetail/${kid.id}`)}
          >
            {/* <AdjustmentsVerticalIcon style={styles.buttonIcon} />  */}
            Manage
          </Button>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Parent Dashboard</Text>
            <Text style={styles.headerSubtitle}>Manage your family's learning journey.</Text>
          </View>
          {/* <UsersIcon style={styles.headerIcon} /> */}
          <Text>user Icon</Text>
        </View>
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Kids ({parentKids.length})</Text>
          <Button 
            size="sm"
            style={styles.addKidButton}
            textStyle={styles.addKidButtonText}
            onPress={() => setViewWithPath(ViewType.ParentAddKid, '/parentaddkid')}
          >
            {/* <UserPlusIcon style={styles.buttonIcon} />  */}
            Add Kid
          </Button>
        </View>
        {parentKids.length === 0 ? (
          <Card style={styles.emptyKidsCard}>
            <Text style={styles.emptyKidsText}>You haven't added any child profiles yet.</Text>
            <Button 
              style={styles.addFirstKidButton}
              onPress={() => setViewWithPath(ViewType.ParentAddKid, '/parentaddkid')}
            >
              Add Your First Child
            </Button>
          </Card>
        ) : (
          <View style={styles.kidsGrid}>
            {parentKids.map(kid => <KidCard key={kid.id} kid={kid} />)}
          </View>
        )}
      </View>

      <Card style={styles.discoverCard}>
        <View style={styles.discoverHeader}>
          {/* <MagnifyingGlassIcon style={styles.discoverIcon} /> */}
          <Text style={styles.discoverTitle}>Discover Learning Adventures</Text>
        </View>
        <Text style={styles.discoverText}>Explore structured courses and activities from verified teachers for your kids.</Text>
        <Button 
          onPress={() => setViewWithPath(ViewType.ParentCourseDiscoveryView, '/parentcoursediscoveryview')}
          size="md"
          style={styles.discoverButton}
          textStyle={styles.discoverButtonText}
        >
          Find Courses & Teachers
        </Button>
      </Card>
      
      <View style={styles.gridContainer}>
        <Card style={styles.gridCard}>
          <View style={styles.gridCardHeader}>
            {/* <CreditCardIcon style={styles.gridCardIcon} /> */}
            <Text style={styles.gridCardTitle}>Family Subscriptions</Text>
          </View>
          <Text style={styles.gridCardText}>Access premium content across all kid profiles.</Text>
          <Button 
            onPress={() => setViewWithPath(ViewType.ParentSubscriptionScreen, '/parentsubscription')}
            size="sm"
            style={styles.subscriptionButton}
            textStyle={styles.subscriptionButtonText}
          >
            Manage Subscriptions
          </Button>
        </Card>
        <Card style={styles.gridCard}>
          <View style={styles.gridCardHeader}>
            {/* <ShieldCheckIcon style={styles.gridCardIcon} /> */}
            <Text style={styles.gridCardTitle}>Global Parental Controls</Text>
          </View>
          <Text style={styles.gridCardText}>Set general app preferences. Individual kid settings are managed per profile.</Text>
          <Button 
            onPress={() => setViewWithPath(ViewType.Settings, '/settings')}
            size="sm"
            style={styles.settingsButton}
            textStyle={styles.settingsButtonText}
          >
            {/* <Cog6ToothIcon style={styles.buttonIcon} />  */}
            General App Settings
          </Button>
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
  loadingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginBottom: 24,
    backgroundColor: '#6366f1', // indigo-500 as base for gradient
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerIcon: {
    width: 40,
    height: 40,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155', // gray-700
  },
  addKidButton: {
    backgroundColor: '#22c55e', // green-500
  },
  addKidButtonText: {
    color: 'white',
  },
  emptyKidsCard: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyKidsText: {
    color: '#4b5563', // gray-600
    marginBottom: 12,
    textAlign: 'center',
  },
  addFirstKidButton: {
    backgroundColor: '#22c55e', // green-500
  },
  kidsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  kidCard: {
    width: '48%',
    padding: 12,
  },
  kidCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    backgroundColor: '#e0f2fe', // sky-100
    borderRadius: 100,
    padding: 4,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 32,
  },
  kidInfo: {
    flex: 1,
  },
  kidName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369a1', // sky-700
  },
  kidDetail: {
    fontSize: 10,
    color: '#6b7280', // gray-500
  },
  kidMeta: {
    fontSize: 10,
    color: '#4b5563', // gray-600
    marginBottom: 4,
  },
  kidButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  kidViewButton: {
    flex: 1,
    marginRight: 4,
    backgroundColor: '#0ea5e9', // sky-500
  },
  kidViewButtonText: {
    fontSize: 10,
    color: 'white',
  },
  manageKidButton: {
    flex: 1,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: '#bae6fd', // sky-200
    backgroundColor: 'transparent',
  },
  manageKidButtonText: {
    fontSize: 10,
    color: '#0284c7', // sky-600
  },
  buttonIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    color: 'white',
  },
  discoverCard: {
    marginBottom: 24,
    padding: 16,
  },
  discoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  discoverIcon: {
    width: 28,
    height: 28,
    color: '#0d9488', // teal-600
    marginRight: 8,
  },
  discoverTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d9488', // teal-600
  },
  discoverText: {
    fontSize: 12,
    color: '#4b5563', // gray-600
    marginBottom: 12,
  },
  discoverButton: {
    backgroundColor: '#0d9488', // teal-500
  },
  discoverButtonText: {
    color: 'white',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  gridCard: {
    width: '48%',
    padding: 12,
  },
  gridCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridCardIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  gridCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  gridCardText: {
    fontSize: 12,
    color: '#4b5563', // gray-600
    marginBottom: 12,
  },
  subscriptionButton: {
    backgroundColor: '#22c55e', // green-500
  },
  subscriptionButtonText: {
    fontSize: 12,
    color: 'white',
  },
  settingsButton: {
    backgroundColor: '#0ea5e9', // sky-500
  },
  settingsButtonText: {
    fontSize: 12,
    color: 'white',
  },
});

export default ParentDashboardScreen;