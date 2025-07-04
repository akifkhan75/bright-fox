import React, { useContext, useState } from 'react';
import { View as RNView, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../App';
import { UserRole, Course, Lesson, View, LessonContentType, Review } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  UsersIcon, 
  StarIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon, 
  VideoCameraIcon, 
  BookOpenIcon, 
  PuzzlePieceIcon, 
  PencilIcon,
  InformationCircleIcon
} from 'react-native-heroicons/solid';

const CourseDetailScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!context || !context.appState.currentUserRole) { 
    return (
      <RNView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </RNView>
    );
  }

  const { allCourses, allTeacherProfiles, setViewWithPath, enrollInCourse, kidProfile, addReview, allReviews, appState } = context;

  const course = allCourses.find(c => c.id === courseId);
  const teacher = course ? allTeacherProfiles.find(t => t.id === course.teacherId) : undefined;
  const courseReviews = allReviews.filter(r => r.courseId === courseId);

  if (!course || !teacher) {
    return (
      <RNView style={styles.notFoundContainer}>
        <LoadingSpinner text="Loading course details..." />
        <Text style={styles.notFoundText}>If this persists, the course might not be available.</Text>
        <Button onPress={() => navigation.goBack()} style={styles.goBackButton}>
          Go Back
        </Button>
      </RNView>
    );
  }

  const isKidActuallyEnrolled = appState.currentUserRole === UserRole.Parent && kidProfile ? 
    kidProfile.enrolledCourseIds?.includes(course.id) : false;
    
  const parentCanReview = appState.currentUserRole === UserRole.Parent && 
    appState.kidProfiles.some(kp => kp.parentId === appState.currentParentProfileId && kp.enrolledCourseIds?.includes(course.id));

  const handleEnroll = async () => {
    if (!kidProfile) {
      alert("Please select or create a kid profile to enroll. You can do this from your Parent Dashboard.");
      setViewWithPath(View.ParentDashboard, '/parentdashboard');
      return;
    }
    setIsLoading(true);
    const success = await enrollInCourse(kidProfile.id, course.id);
    setIsLoading(false);
    if (success) {
      setViewWithPath(View.KidLearningPathView, `/kidlearningpathview`, { courseId: course.id });
    } else {
      alert("Enrollment failed. Please try again.");
    }
  };

  const handleWriteReview = () => {
    if (!newReviewText.trim() || !appState.currentParentProfileId) { 
      alert("Please write your review and ensure you're logged in as a parent.");
      return;
    }
    setIsSubmittingReview(true);
    const reviewData: Review = {
      id: `review_${Date.now()}`,
      parentId: appState.currentParentProfileId, 
      parentName: "A Parent (Mock)",
      teacherId: teacher.id,
      courseId: course.id,
      rating: newReviewRating,
      comment: newReviewText,
      timestamp: Date.now(),
    };
    addReview(reviewData);
    setTimeout(() => { 
      setIsSubmittingReview(false);
      setNewReviewText("");
      setNewReviewRating(5);
      alert("Review submitted! Thank you.");
    }, 500);
  };

  const getLessonIcon = (contentType: LessonContentType) => {
    switch (contentType) {
      case LessonContentType.Video: return <VideoCameraIcon size={20} color="#ef4444" style={styles.icon}/>;
      case LessonContentType.LiveSessionLink: return <VideoCameraIcon size={20} color="#a855f7" style={styles.icon}/>;
      case LessonContentType.InteractiveQuiz: 
      case LessonContentType.Game: 
      case LessonContentType.Puzzle: return <PuzzlePieceIcon size={20} color="#eab308" style={styles.icon}/>;
      case LessonContentType.DrawingChallenge: return <PencilIcon size={20} color="#f97316" style={styles.icon}/>;
      default: return <BookOpenIcon size={20} color="#0ea5e9" style={styles.icon}/>;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mainCard}>
        <Image 
          source={{ uri: course.imageUrl || `https://picsum.photos/seed/${course.id}/600/300` }} 
          style={styles.courseImage}
          resizeMode="cover"
        />
        
        <RNView style={styles.contentContainer}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          
          <TouchableOpacity 
            style={styles.teacherContainer}
            onPress={() => setViewWithPath(View.TeacherProfileView, `/teacherprofileview/${teacher.id}`)}
          >
            <Image 
              source={{ uri: teacher.avatarUrl || `https://picsum.photos/seed/${teacher.id}/50/50` }} 
              style={styles.teacherAvatar}
            />
            <RNView>
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherSubjects}>{teacher.subjects?.join(', ')} Specialist</Text>
            </RNView>
          </TouchableOpacity>

          <RNView style={styles.metaContainer}>
            <RNView style={styles.metaItem}>
              <AcademicCapIcon size={16} color="#6366f1" style={styles.metaIcon}/>
              <Text style={styles.metaText}>Subject: {course.subject}</Text>
            </RNView>
            <RNView style={styles.metaItem}>
              <UsersIcon size={16} color="#6366f1" style={styles.metaIcon}/>
              <Text style={styles.metaText}>Ages: {course.ageGroups.join(', ')}</Text>
            </RNView>
            <RNView style={styles.metaItem}>
              <ClockIcon size={16} color="#6366f1" style={styles.metaIcon}/>
              <Text style={styles.metaText}>Duration: {course.durationWeeks} weeks</Text>
            </RNView>
            <RNView style={styles.metaItem}>
              <StarIcon size={16} color="#f59e0b" style={styles.metaIcon}/>
              <Text style={styles.metaText}>Rating: {course.ratingAverage?.toFixed(1) || 'New'} ({course.ratingCount || 0})</Text>
            </RNView>
          </RNView>

          <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 3}>
            {course.description}
          </Text>
          {course.description.length > 150 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={styles.showMoreText}>
                {showFullDescription ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          )}
          
          <Card style={styles.priceCard}>
            <RNView style={styles.priceContainer}>
              <RNView>
                {course.priceOneTime && (
                  <Text style={styles.priceText}>
                    ${course.priceOneTime} <Text style={styles.priceSubtext}>one-time</Text>
                  </Text>
                )}
                {course.priceMonthly && (
                  <Text style={styles.monthlyPriceText}>
                    ${course.priceMonthly} <Text style={styles.priceSubtext}>/month</Text>
                  </Text>
                )}
                {!course.priceOneTime && !course.priceMonthly && (
                  <Text style={styles.freePriceText}>Free</Text>
                )}
              </RNView>
              {appState.currentUserRole === UserRole.Parent && (
                isKidActuallyEnrolled ? (
                  <Button 
                    onPress={() => setViewWithPath(View.KidLearningPathView, `/kidlearningpathview`, { courseId: course.id })}
                    style={styles.learningPathButton}
                    textStyle={styles.buttonText}
                  >
                    <CheckCircleIcon size={20} color="white" style={styles.buttonIcon}/>
                    Go to Learning Path
                  </Button>
                ) : (
                  <Button 
                    onPress={handleEnroll} 
                    disabled={isLoading}
                    style={styles.enrollButton}
                    textStyle={styles.buttonText}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="small" color="white" />
                    ) : (
                      <>
                        <CurrencyDollarIcon size={20} color="white" style={styles.buttonIcon}/>
                        Enroll {kidProfile?.name || 'Child'}
                      </>
                    )}
                  </Button>
                )
              )}
            </RNView>
            {appState.currentUserRole !== UserRole.Parent && !isKidActuallyEnrolled && (
              <Text style={styles.enrollNote}>Parents can enroll their children in this course.</Text>
            )}
          </Card>

          <RNView style={styles.section}>
            <Text style={styles.sectionTitle}>What you'll learn (Lessons):</Text>
            <RNView style={styles.lessonsList}>
              {course.lessons.map(lesson => (
                <RNView key={lesson.id} style={styles.lessonItem}>
                  {getLessonIcon(lesson.contentType)}
                  <Text style={styles.lessonText}>{lesson.title}</Text>
                </RNView>
              ))}
            </RNView>
          </RNView>

          <RNView style={styles.section}>
            <Text style={styles.sectionTitle}>Parent Reviews ({courseReviews.length})</Text>
            {courseReviews.length > 0 ? (
              <RNView style={styles.reviewsContainer}>
                {courseReviews.map(review => (
                  <Card key={review.id} style={styles.reviewCard}>
                    <RNView style={styles.reviewHeader}>
                      <RNView style={styles.starContainer}>
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
              <Text style={styles.noReviewsText}>No reviews for this course yet. Be the first!</Text>
            )}
          </RNView>
          
          {parentCanReview && (
            <Card style={styles.reviewFormCard}>
              <Text style={styles.reviewFormTitle}>Write a Review for {course.title}:</Text>
              <RNView style={styles.ratingContainer}>
                {[1,2,3,4,5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setNewReviewRating(star as 1|2|3|4|5)}>
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
                placeholder={`Share your experience with ${course.title}...`}
                style={styles.reviewInput}
                multiline
                numberOfLines={4}
              />
              <Button 
                onPress={handleWriteReview} 
                disabled={isSubmittingReview || !newReviewText.trim()} 
                style={styles.submitReviewButton}
                textStyle={styles.buttonText}
              >
                {isSubmittingReview ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  "Submit Review"
                )}
              </Button>
            </Card>
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
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  courseImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3730a3',
    marginBottom: 12,
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  teacherSubjects: {
    fontSize: 12,
    color: '#6b7280',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  showMoreText: {
    fontSize: 12,
    color: '#4f46e5',
    marginBottom: 16,
  },
  priceCard: {
    backgroundColor: '#e0e7ff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3730a3',
  },
  monthlyPriceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4f46e5',
  },
  freePriceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
  },
  priceSubtext: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  learningPathButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enrollButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  enrollNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
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
  lessonsList: {
    marginBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  lessonText: {
    fontSize: 14,
    color: '#4b5563',
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
  starContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  reviewText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 10,
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
  },
  reviewFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  submitReviewButton: {
    backgroundColor: '#4f46e5',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default CourseDetailScreen;