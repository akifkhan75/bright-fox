import React, { useContext, useMemo } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { AppContext } from '../../App';
import { View as ViewType, UserRole, TeacherProfile } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminTeacherVerificationApprovalScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Admin) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Access Denied. Admins only.</Text>
      </View>
    );
  }

  const { allTeacherProfiles, updateTeacherVerificationStatus } = context;

  const pendingTeachers = useMemo(() => {
    return allTeacherProfiles.filter(t => t.verificationStatus === 'Pending');
  }, [allTeacherProfiles]);

  const handleApprove = async (teacherId: string) => {
    Alert.alert(
      "Confirm Approval",
      "Are you sure you want to approve this teacher?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Approve", 
          onPress: async () => {
            await updateTeacherVerificationStatus(teacherId, 'Verified');
          }
        }
      ]
    );
  };

  const handleReject = async (teacherId: string) => {
    Alert.alert(
      "Confirm Rejection",
      "Are you sure you want to reject this teacher's verification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reject", 
          onPress: async () => {
            await updateTeacherVerificationStatus(teacherId, 'Rejected');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="shield-check" size={24} color="#b45309" />
        <Text style={styles.headerText}>Teacher Verification Approvals</Text>
      </View>

      {pendingTeachers.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Icon name="shield-check" size={48} color="#d1d5db" />
          <Text style={styles.emptyText}>No pending teacher verifications at the moment.</Text>
        </Card>
      ) : (
        <View style={styles.listContainer}>
          {pendingTeachers.map(teacher => (
            <Card key={teacher.id} style={styles.teacherCard}>
              <View style={styles.teacherInfo}>
                <View style={styles.teacherHeader}>
                  <Image 
                    source={{ uri: teacher.avatarUrl || 'https://picsum.photos/seed/default/50/50' }} 
                    style={styles.avatar}
                  />
                  <View style={styles.teacherDetails}>
                    <Text style={styles.teacherName}>{teacher.name}</Text>
                    <Text style={styles.teacherEmail}>{teacher.email}</Text>
                  </View>
                </View>
                
                <Text style={styles.teacherBio} numberOfLines={2}>
                  <Text style={styles.boldText}>Bio:</Text> {teacher.bio || 'N/A'}
                </Text>
                
                <Text style={styles.teacherSubjects}>
                  <Text style={styles.boldText}>Subjects:</Text> {teacher.subjects?.join(', ') || 'N/A'}
                </Text>
                
                <Text style={styles.documentsLink}>
                  View Submitted Documents (Mock)
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                <Button
                  onPress={() => handleApprove(teacher.id)}
                  style={styles.approveButton}
                  textStyle={styles.buttonText}
                >
                  <MaterialIcons name="check-circle" size={16} color="white" />
                  <Text style={styles.buttonText}> Approve</Text>
                </Button>
                
                <Button
                  onPress={() => handleReject(teacher.id)}
                  style={styles.rejectButton}
                  textStyle={styles.buttonText}
                >
                  <MaterialIcons name="cancel" size={16} color="white" />
                  <Text style={styles.buttonText}> Reject</Text>
                </Button>
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#4b5563',
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: {
    gap: 12,
  },
  teacherCard: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  teacherInfo: {
    marginBottom: 12,
  },
  teacherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  teacherEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  teacherBio: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 4,
  },
  teacherSubjects: {
    fontSize: 12,
    color: '#4b5563',
  },
  boldText: {
    fontWeight: 'bold',
  },
  documentsLink: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
});

export default AdminTeacherVerificationApprovalScreen;