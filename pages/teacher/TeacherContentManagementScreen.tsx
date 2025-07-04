import React, { useContext, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, Activity, ActivityStatus, Course } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import PencilIcon from '../../assets/icons/PencilIcon';
// import TrashIcon from '../../assets/icons/TrashIcon';
// import PlusCircleIcon from '../../assets/icons/PlusCircleIcon';
// import BookOpenIcon from '../../assets/icons/BookOpenIcon';
import { useNavigation } from '@react-navigation/native';

const TeacherContentManagementScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied.</Text>
      </View>
    );
  }

  const { teacherProfile, allActivities, allCourses } = context;

  const teacherCreatedCourses = useMemo(() => {
    return allCourses.filter(course => course.teacherId === teacherProfile.id)
                     .sort((a,b) => (a.title > b.title ? 1 : -1));
  }, [allCourses, teacherProfile.id]);

  const teacherCreatedActivities = useMemo(() => {
    return allActivities.filter(act => act.creatorId === teacherProfile.id && act.creatorType === 'Teacher')
                        .sort((a,b) => (a.name > b.name ? 1 : -1));
  }, [allActivities, teacherProfile.id]);

  const getStatusColor = (status?: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.Approved: 
      case ActivityStatus.Active: 
        return { text: '#059669', bg: '#d1fae5' };
      case ActivityStatus.Pending: 
        return { text: '#d97706', bg: '#fef3c7' };
      case ActivityStatus.Rejected: 
        return { text: '#dc2626', bg: '#fee2e2' };
      case ActivityStatus.Draft: 
        return { text: '#4b5563', bg: '#f3f4f6' };
      case ActivityStatus.Completed: 
        return { text: '#2563eb', bg: '#dbeafe' };
      default: 
        return { text: '#4b5563', bg: '#f3f4f6' };
    }
  };
  
  const handleEditContent = (contentId: string, isCourse: boolean) => {
    navigation.navigate('ActivityBuilder', { contentId });
  };

  const handleDeleteContent = (contentId: string, isCourse: boolean) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete this ${isCourse ? 'course' : 'activity'}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(`${isCourse ? 'Course' : 'Activity'} ${contentId} would be deleted. (API call needed)`);
            // Example: context.deleteContent(contentId, isCourse);
          }
        }
      ]
    );
  };

  const navigateToCreate = () => {
    navigation.navigate('ActivityBuilder');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Created Content</Text>
        <Button onPress={navigateToCreate} style={styles.createButton}>
          {/* <PlusCircleIcon width={20} height={20} fill="#ffffff" /> */}
          <Text style={styles.createButtonText}>Create New</Text>
        </Button>
      </View>

      {teacherCreatedCourses.length === 0 && teacherCreatedActivities.length === 0 ? (
        <Card style={styles.emptyCard}>
          {/* <BookOpenIcon width={64} height={64} fill="#d1d5db" /> */}
          <Text style={styles.emptyText}>You haven't created any courses or activities yet.</Text>
          <Button onPress={navigateToCreate} style={styles.emptyButton}>
            Start Creating!
          </Button>
        </Card>
      ) : (
        <>
          {teacherCreatedCourses.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Courses</Text>
              <View style={styles.contentList}>
                {teacherCreatedCourses.map(course => {
                  const statusColor = getStatusColor(course.status);
                  return (
                    <Card key={course.id} style={styles.contentCard}>
                      <View style={styles.contentHeader}>
                        <View style={styles.contentInfo}>
                          <Text style={styles.contentName}>{course.title}</Text>
                          <Text style={styles.contentMeta}>Subject: {course.subject} | Duration: {course.durationWeeks} weeks</Text>
                          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                            <Text style={[styles.statusText, { color: statusColor.text }]}>Status: {course.status || 'Unknown'}</Text>
                          </View>
                          {(course.priceOneTime || course.priceMonthly) && (
                            <View style={styles.premiumBadge}>
                              <Text style={styles.premiumText}>Premium</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.actionButtons}>
                          <Button 
                            onPress={() => handleEditContent(course.id, true)} 
                            style={styles.editButton}
                          >
                            {/* <PencilIcon width={20} height={20} fill="#2563eb" /> */}
                          </Button>
                          <Button 
                            onPress={() => handleDeleteContent(course.id, true)} 
                            style={styles.deleteButton}
                          >
                            {/* <TrashIcon width={20} height={20} fill="#dc2626" /> */}
                          </Button>
                        </View>
                      </View>
                      <Text style={styles.ageGroups}>Target Ages: {course.ageGroups.join(', ')}</Text>
                      <Text style={styles.description} numberOfLines={1}>{course.description}</Text>
                      {course.status === ActivityStatus.Rejected && (
                        <View style={styles.rejectionNote}>
                          <Text style={styles.rejectionText}>
                            <Text style={styles.rejectionLabel}>Rejection Reason (Mock):</Text> Course description needs more detail on learning outcomes.
                          </Text>
                        </View>
                      )}
                    </Card>
                  );
                })}
              </View>
            </View>
          )}

          {teacherCreatedActivities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Short Activities</Text>
              <View style={styles.contentList}>
                {teacherCreatedActivities.map(activity => {
                  const statusColor = getStatusColor(activity.status);
                  const contentType = activity.contentType.replace(/([A-Z])/g, ' $1').trim();
                  return (
                    <Card key={activity.id} style={styles.contentCard}>
                      <View style={styles.contentHeader}>
                        <View style={styles.contentInfo}>
                          <Text style={styles.contentName}>{activity.name}</Text>
                          <Text style={styles.contentMeta}>Type: {contentType} | Difficulty: {activity.difficulty}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                            <Text style={[styles.statusText, { color: statusColor.text }]}>Status: {activity.status || 'Unknown'}</Text>
                          </View>
                          {activity.isPremium && (
                            <View style={styles.premiumBadge}>
                              <Text style={styles.premiumText}>Premium</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.actionButtons}>
                          <Button 
                            onPress={() => handleEditContent(activity.id, false)} 
                            style={styles.editButton}
                          >
                            pencil
                            {/* <PencilIcon width={20} height={20} fill="#2563eb" /> */}
                          </Button>
                          <Button 
                            onPress={() => handleDeleteContent(activity.id, false)} 
                            style={styles.deleteButton}
                          >
                            trash
                            {/* <TrashIcon width={20} height={20} fill="#dc2626" /> */}
                          </Button>
                        </View>
                      </View>
                      <Text style={styles.ageGroups}>Target Ages: {activity.ageGroups.join(', ')}</Text>
                      {activity.activityContent?.description && (
                        <Text style={styles.description} numberOfLines={1}>
                          {activity.activityContent.description}
                        </Text>
                      )}
                    </Card>
                  );
                })}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#155e75',
  },
  createButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '500',
    marginVertical: 16,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  contentList: {
    gap: 16,
  },
  contentCard: {
    padding: 0,
    overflow: 'hidden',
    elevation: 2,
  },
  contentHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentInfo: {
    flex: 1,
  },
  contentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  contentMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ede9fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 8,
  },
  ageGroups: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rejectionNote: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  rejectionText: {
    fontSize: 12,
    color: '#991b1b',
  },
  rejectionLabel: {
    fontWeight: '600',
  },
});

export default TeacherContentManagementScreen;