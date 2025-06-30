import React, { useState, useContext, useEffect } from 'react';
import { View as RNView, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../App';
import { View, UserRole, Activity, LessonContentType, DifficultyLevel, ActivityStatus, ActivityContent, Course, Lesson, AgeGroup } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import { SparklesIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/outline';
import { AGE_GROUPS_V3, SUBJECTS_LIST } from '../../constants';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';

type ContentCategory = 'ShortActivity' | 'LongCourse';

const ActivityBuilderScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId } = route.params;

  // Common fields
  const [contentCategory, setContentCategory] = useState<ContentCategory>('ShortActivity');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<string>(SUBJECTS_LIST[0]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>([AGE_GROUPS_V3[0]]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy);
  const [isPremium, setIsPremium] = useState(false);

  // Course specific fields
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(1);
  const [isLiveFocused, setIsLiveFocused] = useState(true);
  const [priceOneTime, setPriceOneTime] = useState<string>('20');
  const [priceMonthly, setPriceMonthly] = useState<string>('');
  const [lessons, setLessons] = useState<Partial<Lesson>[]>([]);

  // Short Activity specific fields
  const [shortActivityContentType, setShortActivityContentType] = useState<LessonContentType>(LessonContentType.Story);
  const [activityContentDetails, setActivityContentDetails] = useState<Partial<ActivityContent>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (courseId && context?.allCourses && context.teacherProfile) {
      const existingCourse = context.allCourses.find(c => c.id === courseId && c.teacherId === context.teacherProfile?.id);
      if (existingCourse) {
        setIsEditing(true);
        setContentCategory('LongCourse');
        setTitle(existingCourse.title);
        setDescription(existingCourse.description);
        setSubject(existingCourse.subject);
        setSelectedAgeGroups(existingCourse.ageGroups);
        setDifficulty(existingCourse.lessons[0]?.contentType === LessonContentType.Game ? DifficultyLevel.Easy : DifficultyLevel.AllLevels);
        setIsPremium(!!existingCourse.priceOneTime || !!existingCourse.priceMonthly);
        setDurationWeeks(existingCourse.durationWeeks);
        setSessionsPerWeek(existingCourse.sessionsPerWeek);
        setIsLiveFocused(existingCourse.isLiveFocused);
        setPriceOneTime(existingCourse.priceOneTime?.toString() || '');
        setPriceMonthly(existingCourse.priceMonthly?.toString() || '');
        setLessons(existingCourse.lessons.map(l => ({...l, title: l.title, description: l.description, contentType: l.contentType, content: l.content})));
      } else {
        const existingActivity = context.allActivities.find(act => act.id === courseId && act.creatorId === context.teacherProfile?.id);
        if (existingActivity) {
          setIsEditing(true);
          setContentCategory('ShortActivity');
          setTitle(existingActivity.name);
          setDescription(existingActivity.activityContent?.description || '');
          setSelectedAgeGroups(existingActivity.ageGroups);
          setDifficulty(existingActivity.difficulty || DifficultyLevel.Easy);
          setIsPremium(existingActivity.isPremium || false);
          setShortActivityContentType(existingActivity.contentType);
          setActivityContentDetails(existingActivity.activityContent || {});
        } else {
          alert("Content not found or you don't have permission to edit it.");
          navigation.goBack();
        }
      }
    }
  }, [courseId, context, navigation]);

  if (!context || context.appState.currentUserRole !== UserRole.Teacher || !context.teacherProfile) {
    return (
      <RNView style={styles.accessDeniedContainer}>
        <Text>Access Denied. Please log in as a teacher.</Text>
      </RNView>
    );
  }

  const { teacherProfile, setViewWithPath } = context;

  const handleAddLesson = () => {
    setLessons([...lessons, { 
      title: `New Lesson ${lessons.length + 1}`, 
      lessonOrder: lessons.length + 1, 
      contentType: LessonContentType.Video, 
      content: { description: "" } 
    }]);
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleLessonChange = (index: number, field: keyof Lesson, value: any) => {
    const updatedLessons = lessons.map((lesson, i) => 
      i === index ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
  };

  const handleLessonContentChange = (index: number, field: keyof ActivityContent, value: any) => {
    const updatedLessons = lessons.map((lesson, i) => 
      i === index ? { ...lesson, content: { ...(lesson.content || {}), [field]: value } } : lesson
    );
    setLessons(updatedLessons);
  };

  const handleSubmit = async () => {
    if (selectedAgeGroups.length === 0) {
      alert("Please select at least one target age group.");
      return;
    }
    setIsLoading(true);

    if (contentCategory === 'LongCourse') {
      const courseData: Partial<Course> = {
        title, 
        description, 
        teacherId: teacherProfile.id, 
        subject, 
        ageGroups: selectedAgeGroups,
        durationWeeks, 
        sessionsPerWeek, 
        isLiveFocused, 
        priceOneTime: priceOneTime ? parseFloat(priceOneTime) : undefined,
        priceMonthly: priceMonthly ? parseFloat(priceMonthly) : undefined,
        lessons: lessons.map((l, idx) => ({
          id: l.id || `lesson_${Date.now()}_${idx}`,
          title: l.title || 'Untitled Lesson',
          lessonOrder: idx,
          contentType: l.contentType || LessonContentType.Video,
          content: l.content || { description: "Lesson content pending" },
          description: l.description || "",
        })),
        status: ActivityStatus.Pending,
        imageUrl: 'https://picsum.photos/seed/courseplaceholder/300/200',
      };
      console.log("Submitting Course:", courseData);
    } else {
      const activityData: Partial<Activity> = {
        name: title,
        contentType: shortActivityContentType,
        activityContent: {...activityContentDetails, title, description},
        ageGroups: selectedAgeGroups,
        difficulty,
        isPremium,
        creatorId: teacherProfile.id,
        creatorType: 'Teacher',
        status: ActivityStatus.Pending,
      };
      console.log("Submitting Short Activity:", activityData);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      alert(`${contentCategory === 'LongCourse' ? 'Course' : 'Activity'} "${title}" ${isEditing ? 'updated' : 'submitted'} for review!`);
      setViewWithPath(View.TeacherContentManagement, '/teachercontent');
    }, 1000);
  };

  const toggleAgeGroup = (ageGroup: AgeGroup) => {
    setSelectedAgeGroups(prev => 
      prev.includes(ageGroup) 
        ? prev.filter(g => g !== ageGroup)
        : [...prev, ageGroup]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.mainCard}>
        <Text style={styles.title}>
          {isEditing ? `Edit ${contentCategory === 'LongCourse' ? 'Course' : 'Activity'}` : "Create New Content"}
        </Text>
        
        {!isEditing && (
          <RNView style={styles.contentTypeSelector}>
            <Text style={styles.label}>What are you creating?</Text>
            <RNPickerSelect
              onValueChange={(value) => setContentCategory(value)}
              items={[
                { label: 'Short Activity (e.g., puzzle, single lesson)', value: 'ShortActivity' },
                { label: 'Long Course (e.g., 4-week Math program)', value: 'LongCourse' },
              ]}
              value={contentCategory}
              style={pickerSelectStyles}
            />
          </RNView>
        )}

        <RNView style={styles.form}>
          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>
              {contentCategory === 'LongCourse' ? 'Course Title' : 'Activity Name'}
            </Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter name"
            />
          </RNView>

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholder="Enter description"
            />
          </RNView>
          
          {contentCategory === 'LongCourse' && (
            <RNView style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <RNPickerSelect
                onValueChange={setSubject}
                items={SUBJECTS_LIST.map(s => ({ label: s, value: s }))}
                value={subject}
                style={pickerSelectStyles}
              />
            </RNView>
          )}

          <RNView style={styles.inputGroup}>
            <Text style={styles.label}>Target Age Groups</Text>
            <RNView style={styles.ageGroupsContainer}>
              {AGE_GROUPS_V3.map(ag => (
                <TouchableOpacity
                  key={ag}
                  style={[
                    styles.ageGroupButton,
                    selectedAgeGroups.includes(ag) && styles.selectedAgeGroupButton
                  ]}
                  onPress={() => toggleAgeGroup(ag)}
                >
                  <Text style={[
                    styles.ageGroupText,
                    selectedAgeGroups.includes(ag) && styles.selectedAgeGroupText
                  ]}>
                    {ag} years
                  </Text>
                </TouchableOpacity>
              ))}
            </RNView>
          </RNView>

          {contentCategory === 'LongCourse' && (
            <>
              <RNView style={styles.gridRow}>
                <RNView style={styles.gridItem}>
                  <Text style={styles.label}>Duration (Weeks)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={durationWeeks.toString()}
                    onChangeText={text => setDurationWeeks(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                </RNView>
                <RNView style={styles.gridItem}>
                  <Text style={styles.label}>Sessions per Week</Text>
                  <TextInput
                    style={styles.textInput}
                    value={sessionsPerWeek.toString()}
                    onChangeText={text => setSessionsPerWeek(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                </RNView>
              </RNView>

              <RNView style={styles.checkboxContainer}>
                <CheckBox
                  value={isLiveFocused}
                  onValueChange={setIsLiveFocused}
                />
                <Text style={styles.checkboxLabel}>Primarily Live Sessions</Text>
              </RNView>

              <RNView style={styles.gridRow}>
                <RNView style={styles.gridItem}>
                  <Text style={styles.label}>One-Time Price ($)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={priceOneTime}
                    onChangeText={setPriceOneTime}
                    placeholder="e.g., 20"
                    keyboardType="numeric"
                  />
                </RNView>
                <RNView style={styles.gridItem}>
                  <Text style={styles.label}>Monthly Price ($)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={priceMonthly}
                    onChangeText={setPriceMonthly}
                    placeholder="e.g., 10"
                    keyboardType="numeric"
                  />
                </RNView>
              </RNView>

              <RNView style={styles.lessonsContainer}>
                <Text style={styles.sectionTitle}>Course Lessons</Text>
                {lessons.map((lesson, index) => (
                  <Card key={index} style={styles.lessonCard}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Lesson Title"
                      value={lesson.title || ''}
                      onChangeText={text => handleLessonChange(index, 'title', text)}
                    />
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      placeholder="Lesson Description"
                      value={lesson.description || ''}
                      onChangeText={text => handleLessonChange(index, 'description', text)}
                      multiline
                      numberOfLines={2}
                    />
                    <RNPickerSelect
                      onValueChange={value => handleLessonChange(index, 'contentType', value)}
                      items={Object.values(LessonContentType).map(type => ({
                        label: type,
                        value: type,
                      }))}
                      value={lesson.contentType || LessonContentType.Video}
                      style={pickerSelectStyles}
                    />
                    {lesson.contentType === LessonContentType.Video && (
                      <TextInput
                        style={styles.textInput}
                        placeholder="Video URL"
                        value={lesson.content?.videoUrl || ''}
                        onChangeText={text => handleLessonContentChange(index, 'videoUrl', text)}
                      />
                    )}
                    {lesson.contentType === LessonContentType.LiveSessionLink && (
                      <TextInput
                        style={styles.textInput}
                        placeholder="Live Session Link (e.g. Zoom)"
                        value={lesson.content?.liveSessionDetails?.link || ''}
                        onChangeText={text => handleLessonContentChange(index, 'liveSessionDetails', {...lesson.content?.liveSessionDetails, link: text})}
                      />
                    )}
                    <Button
                      onPress={() => handleRemoveLesson(index)}
                      style={styles.deleteLessonButton}
                      textStyle={styles.deleteLessonButtonText}
                    >
                      <TrashIcon size={16} color="#ef4444" />
                    </Button>
                  </Card>
                ))}
                <Button
                  onPress={handleAddLesson}
                  style={styles.addLessonButton}
                  textStyle={styles.addLessonButtonText}
                >
                  <PlusIcon size={16} color="#3b82f6" style={styles.buttonIcon} />
                  Add Lesson
                </Button>
              </RNView>
            </>
          )}

          {contentCategory === 'ShortActivity' && (
            <>
              <RNView style={styles.inputGroup}>
                <Text style={styles.label}>Activity Type</Text>
                <RNPickerSelect
                  onValueChange={value => setShortActivityContentType(value)}
                  items={Object.values(LessonContentType)
                    .filter(t => ![LessonContentType.LiveSessionLink].includes(t))
                    .map(type => ({
                      label: type.replace(/([A-Z])/g, ' $1').trim(),
                      value: type,
                    }))}
                  value={shortActivityContentType}
                  style={pickerSelectStyles}
                />
              </RNView>

              <RNView style={styles.inputGroup}>
                <Text style={styles.label}>Difficulty</Text>
                <RNPickerSelect
                  onValueChange={value => setDifficulty(value)}
                  items={Object.values(DifficultyLevel)
                    .filter(l => l !== DifficultyLevel.AllLevels)
                    .map(level => ({
                      label: level,
                      value: level,
                    }))}
                  value={difficulty}
                  style={pickerSelectStyles}
                />
              </RNView>

              <RNView style={styles.checkboxContainer}>
                <CheckBox
                  value={isPremium}
                  onValueChange={setIsPremium}
                />
                <Text style={styles.checkboxLabel}>This is a Premium Activity (one-time purchase)</Text>
              </RNView>
            </>
          )}

          <Text style={styles.uploadText}>Upload Cover Image (Optional - Coming Soon)</Text>

          <Button
            onPress={handleSubmit}
            disabled={isLoading || selectedAgeGroups.length === 0}
            style={styles.submitButton}
            textStyle={styles.submitButtonText}
          >
            {isLoading ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              isEditing ? 'Update & Submit for Review' : 'Submit for Review'
            )}
          </Button>
        </RNView>
      </Card>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#1f2937',
    paddingRight: 30,
    marginTop: 4,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#1f2937',
    paddingRight: 30,
    marginTop: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mainCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f766e',
    textAlign: 'center',
    marginBottom: 16,
  },
  contentTypeSelector: {
    marginBottom: 16,
  },
  form: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  ageGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  ageGroupButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAgeGroupButton: {
    backgroundColor: '#ccfbf1',
    borderColor: '#0d9488',
  },
  ageGroupText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedAgeGroupText: {
    color: '#134e4a',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  lessonsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  lessonCard: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  deleteLessonButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    padding: 4,
  },
  deleteLessonButtonText: {
    color: '#ef4444',
  },
  addLessonButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addLessonButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#0d9488',
    padding: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ActivityBuilderScreen;