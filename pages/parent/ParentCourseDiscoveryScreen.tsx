import React, { useContext, useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../../App';
import { UserRole, Course, TeacherProfile, View as ViewType, AgeGroup, ActivityStatus } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { AGE_GROUPS_V3, SUBJECTS_LIST } from '../../constants';
import RNPickerSelect from 'react-native-picker-select';

const ParentCourseDiscoveryScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Parent) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Access Denied.</Text>
      </View>
    );
  }

  const { allCourses, allTeacherProfiles, setViewWithPath } = context;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const teacher = allTeacherProfiles.find(t => t.id === course.teacherId);
      const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (teacher && teacher.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const ageMatch = selectedAgeGroup === 'All' || course.ageGroups.includes(selectedAgeGroup);
      const subjectMatch = selectedSubject === 'All' || course.subject === selectedSubject;
      
      return searchMatch && ageMatch && subjectMatch && course.status === ActivityStatus.Active;
    });
  }, [allCourses, allTeacherProfiles, searchTerm, selectedAgeGroup, selectedSubject]);
  
  const topRatedTeachers = useMemo(() => {
    return [...allTeacherProfiles]
        .filter(t => t.isVerified && t.ratingAverage && t.ratingAverage >=4)
        .sort((a,b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
        .slice(0,3);
  }, [allTeacherProfiles]);

  const CourseCard: React.FC<{ course: Course; teacher?: TeacherProfile }> = ({ course, teacher }) => (
    <Card style={styles.courseCard}>
      <Image 
        source={{ uri: course.imageUrl || `https://picsum.photos/seed/${course.id}/300/180` }} 
        style={styles.courseImage}
      />
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseTeacher}>By {teacher?.name || 'Teacher'}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#f59e0b" />
          <Text style={styles.ratingText}>
            {course.ratingAverage?.toFixed(1) || 'New'} ({course.ratingCount || 0} reviews)
          </Text>
        </View>
        <Text style={styles.courseDescription} numberOfLines={2}>
          {course.description}
        </Text>
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, styles.subjectTag]}>
            <Text style={styles.tagText}>{course.subject}</Text>
          </View>
          <View style={[styles.tag, styles.ageTag]}>
            <Text style={styles.tagText}>{course.ageGroups.join(', ')} yrs</Text>
          </View>
        </View>
      </View>
      <View style={styles.courseButtonContainer}>
        <Button
          onPress={() => setViewWithPath(ViewType.CourseDetailView, `/coursedetailview/${course.id}`)}
          style={styles.viewCourseButton}
          textStyle={styles.viewCourseButtonText}
        >
          View Course
        </Button>
      </View>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover Courses</Text>
        <Button
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          textStyle={styles.filterButtonText}
        >
          <Icon name="filter" size={16} color="#4f46e5" />
          <Text style={styles.filterButtonText}> {showFilters ? 'Hide' : 'Show'} Filters</Text>
        </Button>
      </View>

      {/* Search and Filters */}
      {showFilters && (
        <Card style={styles.filterCard}>
          <TextInput
            placeholder="Search courses, subjects, teachers..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Age Group</Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedAgeGroup(value)}
                items={[
                  { label: 'All Ages', value: 'All' },
                  ...AGE_GROUPS_V3.map(ag => ({ label: `${ag} years`, value: ag }))
                ]}
                value={selectedAgeGroup}
                style={pickerSelectStyles}
              />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Subject</Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedSubject(value)}
                items={[
                  { label: 'All Subjects', value: 'All' },
                  ...SUBJECTS_LIST.map(sub => ({ label: sub, value: sub }))
                ]}
                value={selectedSubject}
                style={pickerSelectStyles}
              />
            </View>
          </View>
        </Card>
      )}

      {/* Top Rated Teachers */}
      {topRatedTeachers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Rated Teachers</Text>
          <View style={styles.teachersContainer}>
            {topRatedTeachers.map(teacher => (
              <TouchableOpacity 
                key={teacher.id}
                onPress={() => setViewWithPath(ViewType.TeacherProfileView, `/teacherprofileview/${teacher.id}`)}
              >
                <Card style={styles.teacherCard}>
                  <View style={styles.teacherContent}>
                    <Image 
                      source={{ uri: teacher.avatarUrl }} 
                      style={styles.teacherAvatar}
                    />
                    <View style={styles.teacherInfo}>
                      <Text style={styles.teacherName}>{teacher.name}</Text>
                      <Text style={styles.teacherSubjects} numberOfLines={1}>
                        {teacher.subjects?.slice(0,2).join(', ')}
                      </Text>
                      <View style={styles.teacherRating}>
                        <Icon name="star" size={12} color="#f59e0b" />
                        <Text style={styles.teacherRatingText}>
                          {teacher.ratingAverage?.toFixed(1)} ({teacher.ratingCount} reviews)
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Course Listing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {searchTerm || selectedAgeGroup !== 'All' || selectedSubject !== 'All' ? 'Filtered Courses' : 'All Available Courses'}
        </Text>
        {filteredCourses.length > 0 ? (
          <View style={styles.coursesContainer}>
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                teacher={allTeacherProfiles.find(t => t.id === course.teacherId)} 
              />
            ))}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Icon name="magnify" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              No courses match your current filters. Try adjusting your search!
            </Text>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    color: '#111827',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    color: '#111827',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'transparent',
  },
  filterButtonText: {
    color: '#4f46e5',
    fontSize: 14,
  },
  filterCard: {
    padding: 16,
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  teachersContainer: {
    gap: 12,
  },
  teacherCard: {
    padding: 12,
  },
  teacherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  teacherSubjects: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  teacherRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  teacherRatingText: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 4,
  },
  coursesContainer: {
    gap: 16,
  },
  courseCard: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  courseContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 4,
  },
  courseTeacher: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 4,
  },
  courseDescription: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectTag: {
    backgroundColor: '#e0e7ff',
  },
  ageTag: {
    backgroundColor: '#fce7f3',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  courseButtonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  viewCourseButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 6,
  },
  viewCourseButtonText: {
    color: 'white',
    fontSize: 14,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
});

export default ParentCourseDiscoveryScreen;