import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, ActivityStatus, Course, Activity } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { EyeIcon, CheckCircleIcon, XCircleIcon, AcademicCapIcon, PuzzlePieceIcon } from './icons'; // You'll need to create or import these icons

type ModerationTab = 'courses' | 'activities';

const AdminContentModerationScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<ModerationTab>('courses');

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied. Admins only.</Text>
      </View>
    );
  }

  const { allCourses, allActivities, updateCourseStatus, updateActivityStatus, setViewWithPath, allTeacherProfiles } = context;

  const pendingCourses = useMemo(() => allCourses.filter(c => c.status === ActivityStatus.Pending), [allCourses]);
  const pendingActivities = useMemo(() => allActivities.filter(a => a.creatorType === 'Teacher' && a.status === ActivityStatus.Pending), [allActivities]);

  const handleApproveCourse = async (courseId: string) => {
    Alert.alert(
      "Approve Course",
      "Are you sure you want to approve this course?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", onPress: () => updateCourseStatus(courseId, ActivityStatus.Active) }
      ]
    );
  };

  const handleRejectCourse = async (courseId: string) => {
    Alert.alert(
      "Reject Course",
      "Are you sure you want to reject this course?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reject", onPress: () => updateCourseStatus(courseId, ActivityStatus.Rejected) }
      ]
    );
  };

  const handleApproveActivity = async (activityId: string) => {
    Alert.alert(
      "Approve Activity",
      "Are you sure you want to approve this activity?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", onPress: () => updateActivityStatus(activityId, ActivityStatus.Approved) }
      ]
    );
  };

  const handleRejectActivity = async (activityId: string) => {
    Alert.alert(
      "Reject Activity",
      "Are you sure you want to reject this activity?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reject", onPress: () => updateActivityStatus(activityId, ActivityStatus.Rejected) }
      ]
    );
  };
  
  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Unknown Teacher';
    return allTeacherProfiles.find(t => t.id === teacherId)?.name || teacherId;
  };

  const CourseItem: React.FC<{ course: Course }> = ({ course }) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{course.title}</Text>
          <Text style={styles.itemSubtitle}>By: {getTeacherName(course.teacherId)} | Subject: {course.subject}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>{course.description}</Text>
          <Button 
            size="sm"
            style={styles.viewDetailsButton}
            textStyle={styles.viewDetailsButtonText}
            onPress={() => setViewWithPath(ViewType.CourseDetailView, `/coursedetailview/${course.id}`)}
          >
            View Details
          </Button>
        </View>
        <View style={styles.itemActions}>
          <Button 
            onPress={() => handleApproveCourse(course.id)} 
            style={styles.approveButton}
            textStyle={styles.buttonText}
            size="sm"
          >
            {/* <CheckCircleIcon style={styles.buttonIcon} />  */}
            Approve
          </Button>
          <Button 
            onPress={() => handleRejectCourse(course.id)} 
            style={styles.rejectButton}
            textStyle={styles.buttonText}
            size="sm"
          >
            {/* <XCircleIcon style={styles.buttonIcon} />  */}
            Reject
          </Button>
        </View>
      </View>
    </Card>
  );

  const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemContent}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{activity.name}</Text>
          <Text style={styles.itemSubtitle}>By: {getTeacherName(activity.creatorId)} | Type: {activity.contentType}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {activity.activityContent?.description || 'No description.'}
          </Text>
          <Button 
            size="sm"
            style={styles.viewDetailsButton}
            textStyle={styles.viewDetailsButtonText}
            onPress={() => setViewWithPath(activity.view || ViewType.ActivityPlaceholder, `/${ViewType[activity.view || ViewType.ActivityPlaceholder].toString().toLowerCase()}`)}
          >
            Preview Activity (Mock)
          </Button>
        </View>
        <View style={styles.itemActions}>
          <Button 
            onPress={() => handleApproveActivity(activity.id)} 
            style={styles.approveButton}
            textStyle={styles.buttonText}
            size="sm"
          >
            {/* <CheckCircleIcon style={styles.buttonIcon} />  */}
            Approve
          </Button>
          <Button 
            onPress={() => handleRejectActivity(activity.id)} 
            style={styles.rejectButton}
            textStyle={styles.buttonText}
            size="sm"
          >
            {/* <XCircleIcon style={styles.buttonIcon} />  */}
            Reject
          </Button>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* <EyeIcon style={styles.headerIcon} /> */}
        <Text style={styles.headerTitle}>Content Moderation Queue</Text>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity 
            onPress={() => setActiveTab('courses')} 
            style={[styles.tab, activeTab === 'courses' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'courses' && styles.activeTabText]}>
              Pending Courses ({pendingCourses.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('activities')} 
            style={[styles.tab, activeTab === 'activities' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'activities' && styles.activeTabText]}>
              Pending Activities ({pendingActivities.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'courses' && (
        pendingCourses.length === 0 
        ? <EmptyState icon={''} text="No courses pending review." />
        : <View style={styles.listContainer}>{pendingCourses.map(course => <CourseItem key={course.id} course={course} />)}</View>
      )}

      {activeTab === 'activities' && (
        pendingActivities.length === 0
        ? <EmptyState icon={''} text="No activities pending review." />
        : <View style={styles.listContainer}>{pendingActivities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}</View>
      )}
    </ScrollView>
  );
};

const EmptyState: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <Card style={styles.emptyCard}>
    {icon}
    <Text style={styles.emptyText}>{text}</Text>
  </Card>
);

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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 32,
    height: 32,
    color: '#ea580c', // orange-600
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b', // slate-800
  },
  tabContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1', // slate-300
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0ea5e9', // sky-500
  },
  tabText: {
    fontSize: 14,
    color: '#64748b', // slate-500
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0ea5e9', // sky-600
  },
  listContainer: {
    gap: 12,
  },
  itemCard: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'column',
  },
  itemTextContainer: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155', // slate-700
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#64748b', // slate-500
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 12,
    color: '#475569', // slate-600
    marginBottom: 8,
    lineHeight: 18,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  viewDetailsButton: {
    backgroundColor: 'transparent',
    padding: 0,
    alignSelf: 'flex-start',
  },
  viewDetailsButtonText: {
    color: '#2563eb', // blue-600
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  approveButton: {
    backgroundColor: '#22c55e', // green-500
  },
  rejectButton: {
    backgroundColor: '#ef4444', // red-500
  },
  buttonText: {
    color: 'white',
  },
  buttonIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    color: 'white',
  },
  emptyCard: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    color: '#cbd5e1', // slate-300
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b', // slate-500
  },
});

export default AdminContentModerationScreen;