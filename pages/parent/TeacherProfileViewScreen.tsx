import React, { useContext, useState, useEffect } from 'react';
import { View as RNView, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../App';
import { UserRole, TeacherProfile, Course, View, Review, ActivityStatus } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  AcademicCapIcon, 
  StarIcon, 
  ShieldCheckIcon, 
  PencilIcon, 
  BookOpenIcon, 
  PlusCircleIcon, 
  ChatBubbleOvalLeftEllipsisIcon 
} from 'react-native-heroicons/solid';

const TeacherProfileViewScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { teacherId } = route.params;
  const isEditingOwnProfile = route.params?.isEditing && 
    context?.appState.currentUserRole === UserRole.Teacher && 
    context?.teacherProfile?.id === teacherId;

  const [editBio, setEditBio] = useState('');
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!context) {
    return (
      <RNView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </RNView>
    );
  }

  const { allTeacherProfiles, allCourses, setViewWithPath, appState, addReview, startOrGoToChat } = context;
  const teacher = allTeacherProfiles.find(t => t.id === teacherId);
  const coursesByThisTeacher = teacher ? allCourses.filter(c => c.teacherId === teacher.id && c.status === ActivityStatus.Active) : [];
  const reviewsForThisTeacher = teacher ? context.allReviews.filter(r => r.teacherId === teacher.id && !r.courseId) : [];

  useEffect(() => {
    if (isEditingOwnProfile && teacher) {
      setEditBio(teacher.bio || '');
    }
  }, [isEditingOwnProfile, teacher]);

  if (!teacher) {
    return (
      <RNView style={styles.notFoundContainer}>
        <LoadingSpinner text="Loading teacher details..." />
        <Text style={styles.notFoundText}>Teacher not found.</Text>
        <Button onPress={() => navigation.goBack()} style={styles.goBackButton}>
          Go Back
        </Button>
      </RNView>
    );
  }

  const handleSaveProfileChanges = () => {
    if (!isEditingOwnProfile || !context.teacherProfile) return;
    const updatedTeacher = {...context.teacherProfile, bio: editBio};
    alert("Profile changes saved (mock)!");
  };

  const handleWriteTeacherReview = () => {
    if (!newReviewText.trim() || !appState.currentParentProfileId) {
      alert("Please write your review and ensure you're logged in as a parent.");
      return;
    }
    setIsSubmittingReview(true);
    const reviewData: Review = {
      id: `review_teacher_${Date.now()}`,
      parentId: appState.currentParentProfileId, 
      parentName: "A Parent (Mock)", 
      teacherId: teacher.id,
      rating: newReviewRating,
      comment: newReviewText,
      timestamp: Date.now(),
    };
    addReview(reviewData); 
    setTimeout(() => { 
      setIsSubmittingReview(false);
      setNewReviewText("");
      setNewReviewRating(5);
      alert("Review for teacher submitted! Thank you.");
    }, 500);
  };

  const handleMessageTeacher = () => {
    if (appState.currentUserRole === UserRole.Parent && appState.currentParentProfileId) {
      const conversationId = startOrGoToChat(teacher.id, UserRole.Teacher, teacher.name, teacher.avatarUrl);
      if (conversationId) {
        setViewWithPath(View.ChatRoomScreen, `/chatroomscreen/${conversationId}`);
      } else {
        alert("Could not start chat. Please try again.");
      }
    } else {
      alert("Please log in as a parent to message teachers.");
    }
  };

  const verificationStatusText = {
    NotSubmitted: "Not Verified",
    Pending: "Verification Pending",
    Verified: "Verified Teacher",
    Rejected: "Verification Issues",
  };

  const verificationStatusColor = {
    NotSubmitted: styles.notVerified,
    Pending: styles.pendingVerification,
    Verified: styles.verified,
    Rejected: styles.rejected,
  };

  const teacherFirstName = teacher.name.split(' ')[0];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mainCard}>
        <RNView style={styles.headerBackground}>
          <RNView style={styles.headerContent}>
            <Image 
              source={{ uri: teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/120/120` }} 
              style={styles.teacherAvatar}
            />
            <RNView style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherSubjects}>{teacher.subjects?.join(' • ')} Specialist</Text>
              <RNView style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    size={20} 
                    color={i < (teacher.ratingAverage || 0) ? '#fbbf24' : 'rgba(255,255,255,0.4)'}
                  />
                ))}
                <Text style={styles.ratingText}>
                  ({teacher.ratingAverage?.toFixed(1) || 'N/A'} from {teacher.ratingCount || 0} reviews)
                </Text>
              </RNView>
              <RNView style={[styles.verificationBadge, verificationStatusColor[teacher.verificationStatus || 'NotSubmitted']]}>
                <ShieldCheckIcon size={16} color="currentColor" style={styles.badgeIcon}/>
                <Text style={styles.badgeText}>
                  {verificationStatusText[teacher.verificationStatus || 'NotSubmitted']}
                </Text>
              </RNView>
            </RNView>
            {isEditingOwnProfile && (
              <Button 
                onPress={() => alert("Edit Profile Picture - Mock")}
                style={styles.editPhotoButton}
                textStyle={styles.editPhotoButtonText}
              >
                <PencilIcon size={16} color="white" style={styles.buttonIcon}/>
                Edit Photo
              </Button>
            )}
          </RNView>
        </RNView>

        <RNView style={styles.contentContainer}>
          <RNView style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            {isEditingOwnProfile ? (
              <>
                <TextInput
                  value={editBio}
                  onChangeText={setEditBio}
                  style={styles.bioInput}
                  multiline
                  numberOfLines={4}
                />
                <Button onPress={handleSaveProfileChanges} style={styles.saveBioButton}>
                  Save Bio Changes
                </Button>
              </>
            ) : (
              <Text style={styles.bioText}>{teacher.bio || "No biography provided."}</Text>
            )}
          </RNView>

          <RNView style={styles.section}>
            <Text style={styles.sectionTitle}>Courses by {teacherFirstName}</Text>
            {coursesByThisTeacher.length > 0 ? (
              <RNView style={styles.coursesGrid}>
                {coursesByThisTeacher.map(course => (
                  <TouchableOpacity 
                    key={course.id} 
                    onPress={() => setViewWithPath(View.CourseDetailView, `/coursedetailview/${course.id}`)}
                  >
                    <Card style={styles.courseCard}>
                      <Text style={styles.courseTitle} numberOfLines={1}>{course.title}</Text>
                      <Text style={styles.courseMeta}>
                        {course.subject} • {course.ageGroups.join(', ')} yrs
                      </Text>
                      <RNView style={styles.courseRating}>
                        <StarIcon size={14} color="#f59e0b" style={styles.starIcon}/>
                        <Text style={styles.ratingValue}>{course.ratingAverage?.toFixed(1) || 'New'}</Text>
                      </RNView>
                    </Card>
                  </TouchableOpacity>
                ))}
              </RNView>
            ) : (
              <Text style={styles.noCoursesText}>
                {isEditingOwnProfile ? "You haven't published any courses yet." : "This teacher currently has no active courses."}
              </Text>
            )}
            {isEditingOwnProfile && (
              <Button 
                onPress={() => setViewWithPath(View.ActivityBuilder, '/activitybuilder')}
                style={styles.createCourseButton}
                textStyle={styles.createCourseButtonText}
              >
                <PlusCircleIcon size={20} color="white" style={styles.buttonIcon}/>
                Create New Course
              </Button>
            )}
          </RNView>

          <RNView style={styles.section}>
            <Text style={styles.sectionTitle}>
              General Reviews for {teacherFirstName} ({reviewsForThisTeacher.length})
            </Text>
            {reviewsForThisTeacher.length > 0 ? (
              <RNView style={styles.reviewsContainer}>
                {reviewsForThisTeacher.map(review => (
                  <Card key={review.id} style={styles.reviewCard}>
                    <RNView style={styles.reviewHeader}>
                      <RNView style={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            size={16} 
                            color={i < review.rating ? '#f59e0b' : '#d1d5db'}
                          />
                        ))}
                      </RNView>
                      <Text style={styles.reviewerName}>{review.parentName || "A Parent"}</Text>
                    </RNView>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.timestamp).toLocaleDateString()}
                    </Text>
                  </Card>
                ))}
              </RNView>
            ) : (
              <Text style={styles.noReviewsText}>No general reviews for this teacher yet.</Text>
            )}
          </RNView>

          {appState.currentUserRole === UserRole.Parent && !isEditingOwnProfile && (
            <>
              <Card style={styles.reviewFormCard}>
                <Text style={styles.reviewFormTitle}>Review {teacherFirstName}:</Text>
                <RNView style={styles.ratingInput}>
                  {[1,2,3,4,5].map(star => (
                    <TouchableOpacity 
                      key={star} 
                      onPress={() => setNewReviewRating(star as 1|2|3|4|5)}
                    >
                      <StarIcon 
                        size={24} 
                        color={star <= newReviewRating ? '#f59e0b' : '#d1d5db'}
                      />
                    </TouchableOpacity>
                  ))}
                </RNView>
                <TextInput
                  value={newReviewText}
                  onChangeText={setNewReviewText}
                  placeholder={`Share your overall experience with ${teacherFirstName}...`}
                  style={styles.reviewInput}
                  multiline
                  numberOfLines={4}
                />
                <Button 
                  onPress={handleWriteTeacherReview} 
                  disabled={isSubmittingReview || !newReviewText.trim()} 
                  style={styles.submitReviewButton}
                  textStyle={styles.submitReviewButtonText}
                >
                  {isSubmittingReview ? (
                    <LoadingSpinner size="small" color="white" />
                  ) : (
                    "Submit Teacher Review"
                  )}
                </Button>
              </Card>
              
              <Button 
                onPress={handleMessageTeacher}
                style={styles.messageButton}
                textStyle={styles.messageButtonText}
              >
                <ChatBubbleOvalLeftEllipsisIcon size={20} color="white" style={styles.buttonIcon}/>
                Message {teacherFirstName}
              </Button>
              
              <Button 
                onPress={() => alert("Book a trial class - Feature coming soon!")}
                style={styles.trialClassButton}
                textStyle={styles.trialClassButtonText}
              >
                Book a Trial Class (Coming Soon)
              </Button>
            </>
          )}
        </RNView>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    marginTop: 16,
    color: '#6b7280',
  },
  goBackButton: {
    marginTop: 16,
  },
  mainCard: {
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerBackground: {
    backgroundColor: '#7c3aed',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    marginRight: 16,
  },
  teacherInfo: {
    flex: 1,
    minWidth: 200,
  },
  teacherName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  teacherSubjects: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  notVerified: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  pendingVerification: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  verified: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  rejected: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editPhotoButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editPhotoButtonText: {
    color: 'white',
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
    backgroundColor: 'white',
  },
  saveBioButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  courseCard: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3730a3',
    marginBottom: 4,
  },
  courseMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 12,
    color: '#f59e0b',
  },
  noCoursesText: {
    fontSize: 14,
    color: '#6b7280',
  },
  createCourseButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  createCourseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsContainer: {
    maxHeight: 240,
  },
  reviewCard: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  reviewText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  reviewFormCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  ratingInput: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitReviewButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
  },
  submitReviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#14b8a6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  trialClassButton: {
    backgroundColor: '#f97316',
    padding: 16,
    borderRadius: 8,
  },
  trialClassButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default TeacherProfileViewScreen;