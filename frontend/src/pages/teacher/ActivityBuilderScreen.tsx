
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { View, UserRole, Activity, LessonContentType, DifficultyLevel, ActivityStatus, ActivityContent, Course, Lesson, AgeGroup } from '../../types';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner'; 
import { SparklesIcon, PlusIcon, TrashIcon, CalendarDaysIcon, CalculatorIcon, BookOpenIcon, PuzzlePieceIcon, PaintBrushIcon, QuestionMarkCircleIcon, HeartIcon, BeakerIcon, LightBulbIcon } from '@heroicons/react/24/outline'; // Added more icons for mapping
import { AGE_GROUPS_V3, SUBJECTS_LIST } from '../../constants';


type ContentCategory = 'ShortActivity' | 'LongCourse';

// Helper function to map subject to Activity.category
const mapSubjectToActivityCategory = (subject: string): Activity['category'] => {
  const lowerSubject = subject.toLowerCase();
  if (lowerSubject.includes('math') || lowerSubject.includes('number')) return 'Numbers';
  if (lowerSubject.includes('reading') || lowerSubject.includes('literacy') || lowerSubject.includes('letter')) return 'Reading';
  if (lowerSubject.includes('puzzle') || lowerSubject.includes('logic')) return 'Puzzles';
  if (lowerSubject.includes('art') || lowerSubject.includes('draw') || lowerSubject.includes('color')) return 'Drawing';
  // Add more specific mappings if needed based on SUBJECTS_LIST
  // For subjects like Science, Music, Coding, Storytelling, Life Skills, Geography, History that don't have direct enum matches:
  if (['science', 'music', 'coding', 'storytelling', 'life skills', 'geography', 'history'].includes(lowerSubject)) {
    return 'General'; // Or a more specific mapping if one of the enums fits better in some cases
  }
  return 'General'; // Default fallback
};


const ActivityBuilderScreen: React.FC = () => {
  const context = useContext(AppContext);
  const { courseId } = useParams<{ courseId?: string; activityId?: string }>(); 
  const navigate = useNavigate();

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
  const [priceOneTime, setPriceOneTime] = useState<number | undefined>(20);
  const [priceMonthly, setPriceMonthly] = useState<number | undefined>();
  const [lessons, setLessons] = useState<Partial<Lesson>[]>([]);

  // Short Activity specific fields
  const [shortActivityContentType, setShortActivityContentType] = useState<LessonContentType>(LessonContentType.Story);
  const [activityContentDetails, setActivityContentDetails] = useState<Partial<ActivityContent>>({});


  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  useEffect(() => {
    if (courseId && context?.allCourses && context.teacherProfile) {
      const existingCourse = context.allCourses.find(c => c.id === courseId && c.teacherId === context.teacherProfile?.id);
      if (existingCourse) {
        setIsEditing(true);
        setEditingContentId(existingCourse.id);
        setContentCategory('LongCourse');
        setTitle(existingCourse.title);
        setDescription(existingCourse.description);
        setSubject(existingCourse.subject);
        setSelectedAgeGroups(existingCourse.ageGroups);
        // Difficulty for course is not directly set, derived from lessons or general
        setIsPremium(!!existingCourse.priceOneTime || !!existingCourse.priceMonthly);
        setDurationWeeks(existingCourse.durationWeeks);
        setSessionsPerWeek(existingCourse.sessionsPerWeek);
        setIsLiveFocused(existingCourse.isLiveFocused);
        setPriceOneTime(existingCourse.priceOneTime);
        setPriceMonthly(existingCourse.priceMonthly);
        setLessons(existingCourse.lessons.map(l => ({...l, title: l.title, description: l.description, contentType: l.contentType, content: l.content}))); 
      } else {
        const existingActivity = context.allActivities.find(act => act.id === courseId && act.creatorId === context.teacherProfile?.id);
        if (existingActivity) {
            setIsEditing(true);
            setEditingContentId(existingActivity.id);
            setContentCategory('ShortActivity');
            setTitle(existingActivity.name);
            setDescription(existingActivity.activityContent?.description || '');
            // For editing an activity, set the subject dropdown to the activity's category if possible, or a default.
            // This requires mapping Activity.category back to a SUBJECTS_LIST item or handling it.
            // For simplicity, we can try a direct match or default.
            const activityCategoryMappedToSubject = SUBJECTS_LIST.find(s => s.toLowerCase() === existingActivity.category.toLowerCase()) || existingActivity.category || SUBJECTS_LIST[0];
            setSubject(activityCategoryMappedToSubject);
            setSelectedAgeGroups(existingActivity.ageGroups);
            setDifficulty(existingActivity.difficulty || DifficultyLevel.Easy);
            setIsPremium(existingActivity.isPremium || false);
            setShortActivityContentType(existingActivity.contentType);
            setActivityContentDetails(existingActivity.activityContent || {});
        } else {
            alert("Content not found or you don't have permission to edit it.");
            navigate('/teachercontent');
        }
      }
    }
  }, [courseId, context?.allCourses, context?.allActivities, context?.teacherProfile, navigate]);


  if (!context || context.appState.currentUserRole !== UserRole.Teacher || !context.teacherProfile) {
    return <div className="p-4 text-center">Access Denied. Please log in as a teacher.</div>;
  }
  const { teacherProfile, setViewWithPath, setAllCourses, setAllActivities } = context; 

  const handleAddLesson = () => {
    setLessons([...lessons, { title: `New Lesson ${lessons.length + 1}`, lessonOrder: lessons.length + 1, contentType: LessonContentType.Video, content: {description: ""} }]);
  };
  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };
  const handleLessonChange = (index: number, field: keyof Lesson, value: any) => {
    const updatedLessons = lessons.map((lesson, i) => i === index ? { ...lesson, [field]: value } : lesson);
    setLessons(updatedLessons);
  };
   const handleLessonContentChange = (index: number, field: keyof ActivityContent, value: any) => {
    const updatedLessons = lessons.map((lesson, i) => 
        i === index ? { ...lesson, content: { ...(lesson.content || {}), [field]: value } } : lesson
    );
    setLessons(updatedLessons);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgeGroups.length === 0) {
        alert("Please select at least one target age group.");
        return;
    }
    setIsLoading(true);

    if (contentCategory === 'LongCourse') {
        const newCourseData: Course = {
            id: isEditing && editingContentId ? editingContentId : `course_teach_${Date.now()}`,
            title, description, teacherId: teacherProfile.id, subject, ageGroups: selectedAgeGroups,
            durationWeeks, sessionsPerWeek, isLiveFocused, priceOneTime, priceMonthly,
            lessons: lessons.map((l, idx) => ({ 
                id: l.id || `lesson_${Date.now()}_${idx}`,
                title: l.title || 'Untitled Lesson',
                lessonOrder: idx,
                contentType: l.contentType || LessonContentType.Video,
                content: l.content || {description: "Lesson content pending"},
                description: l.description || "",
            })),
            status: ActivityStatus.Pending, // Always pending on submit/edit by teacher
            imageUrl: 'https://picsum.photos/seed/courseplaceholder/300/200', 
            ratingAverage: isEditing && context.allCourses.find(c=>c.id === editingContentId) ? context.allCourses.find(c=>c.id === editingContentId)!.ratingAverage : 0,
            ratingCount: isEditing && context.allCourses.find(c=>c.id === editingContentId) ? context.allCourses.find(c=>c.id === editingContentId)!.ratingCount : 0,
            enrollmentCount: isEditing && context.allCourses.find(c=>c.id === editingContentId) ? context.allCourses.find(c=>c.id === editingContentId)!.enrollmentCount : 0,
        };
        
        // Optimistic Update
        if (isEditing) {
            setAllCourses(prev => prev.map(c => c.id === newCourseData.id ? newCourseData : c));
        } else {
            setAllCourses(prev => [...prev, newCourseData]);
        }
        // In a real app: await apiService.saveCourse(newCourseData);
        console.log("Submitting Course:", newCourseData);

    } else { // ShortActivity
        const newActivityData: Activity = {
            id: isEditing && editingContentId ? editingContentId : `activity_teach_${Date.now()}`,
            name: title,
            category: mapSubjectToActivityCategory(subject), // Use the mapping function here
            icon: SparklesIcon, // Placeholder, will be handled by CategoryActivitiesScreen logic
            color: 'bg-gray-400', // Placeholder
            view: View.ActivityPlaceholder, // Default, can be refined based on contentType
            contentType: shortActivityContentType,
            activityContent: {...activityContentDetails, title, description}, 
            ageGroups: selectedAgeGroups,
            difficulty,
            isPremium,
            creatorId: teacherProfile.id,
            creatorType: 'Teacher',
            status: ActivityStatus.Pending, // Always pending on submit/edit by teacher
        };
        
        // Optimistic Update
        if (isEditing) {
            setAllActivities(prev => prev.map(a => a.id === newActivityData.id ? newActivityData : a));
        } else {
            setAllActivities(prev => [...prev, newActivityData]);
        }
        // In a real app: await apiService.saveActivity(newActivityData);
        console.log("Submitting Short Activity:", newActivityData);
    }
    
    setTimeout(() => { 
      setIsLoading(false);
      alert(`${contentCategory === 'LongCourse' ? 'Course' : 'Activity'} "${title}" ${isEditing ? 'updated and re-submitted' : 'submitted'} for review!`);
      setViewWithPath(View.TeacherContentManagement, '/teachercontent');
    }, 500); // Shorter delay for optimistic update
  };
  
  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full">
      <Card className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-teal-700 mb-6 text-center font-display">
          {isEditing ? `Edit ${contentCategory === 'LongCourse' ? 'Course' : 'Activity'}` : "Create New Content"}
        </h2>
        
        {!isEditing && (
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">What are you creating?</label>
            <select value={contentCategory} onChange={e => setContentCategory(e.target.value as ContentCategory)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                <option value="ShortActivity">Short Activity (e.g., puzzle, single lesson)</option>
                <option value="LongCourse">Long Course (e.g., 4-week Math program)</option>
            </select>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">{contentCategory === 'LongCourse' ? 'Course Title' : 'Activity Name'}</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          
          {/* Shared field: Subject, used as Category for Short Activity */}
          <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                {contentCategory === 'LongCourse' ? 'Subject' : 'Primary Subject/Category (e.g., Math, Reading, Art)'}
              </label>
              <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                  {SUBJECTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {contentCategory === 'ShortActivity' && <p className="text-xs text-gray-500 mt-1">This will help categorize the activity (e.g., "Math" maps to "Numbers" category).</p>}
          </div>
          

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Age Groups</label>
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AGE_GROUPS_V3.map(ag => (
                <label key={ag} className="inline-flex items-center p-2 border rounded-md hover:bg-gray-50 has-[:checked]:bg-teal-50 has-[:checked]:border-teal-500">
                  <input type="checkbox" value={ag} checked={selectedAgeGroups.includes(ag)} 
                         onChange={e => {
                           const checked = e.target.checked;
                           setSelectedAgeGroups(prev => checked ? [...prev, ag] : prev.filter(g => g !== ag));
                         }}
                         className="form-checkbox h-4 w-4 text-teal-600 border-gray-300 rounded"/>
                  <span className="ml-2 text-sm text-gray-700">{ag} years</span>
                </label>
              ))}
            </div>
          </div>

          {contentCategory === 'LongCourse' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="durationWeeks" className="block text-sm font-medium text-gray-700">Duration (Weeks)</label>
                  <input type="number" id="durationWeeks" value={durationWeeks} onChange={e => setDurationWeeks(parseInt(e.target.value))} min="1" max="12" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                  <label htmlFor="sessionsPerWeek" className="block text-sm font-medium text-gray-700">Sessions per Week</label>
                  <input type="number" id="sessionsPerWeek" value={sessionsPerWeek} onChange={e => setSessionsPerWeek(parseInt(e.target.value))} min="1" max="5" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="isLiveFocused" checked={isLiveFocused} onChange={(e) => setIsLiveFocused(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded" />
                <label htmlFor="isLiveFocused" className="ml-2 block text-sm font-medium text-gray-700">Primarily Live Sessions</label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="priceOneTime" className="block text-sm font-medium text-gray-700">One-Time Price ($)</label>
                    <input type="number" id="priceOneTime" placeholder="e.g., 20" value={priceOneTime === undefined ? '' : priceOneTime} onChange={e => setPriceOneTime(e.target.value ? parseFloat(e.target.value) : undefined)} min="0" step="0.01" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="priceMonthly" className="block text-sm font-medium text-gray-700">Monthly Price ($) (Optional)</label>
                    <input type="number" id="priceMonthly" placeholder="e.g., 10" value={priceMonthly === undefined ? '' : priceMonthly} onChange={e => setPriceMonthly(e.target.value ? parseFloat(e.target.value) : undefined)} min="0" step="0.01" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"/>
                </div>
              </div>

              <div className="space-y-3 p-3 border border-gray-200 rounded-md">
                <h4 className="font-medium text-gray-700">Course Lessons</h4>
                {lessons.map((lesson, index) => (
                  <Card key={index} className="!p-3 !shadow-sm">
                    <input type="text" placeholder="Lesson Title" value={lesson.title || ''} onChange={e => handleLessonChange(index, 'title', e.target.value)} className="w-full px-2 py-1 border rounded mb-1"/>
                    <textarea placeholder="Lesson Description" value={lesson.description || ''} onChange={e => handleLessonChange(index, 'description', e.target.value)} rows={2} className="w-full px-2 py-1 border rounded mb-1 text-sm"/>
                    <select value={lesson.contentType || LessonContentType.Video} onChange={e => handleLessonChange(index, 'contentType', e.target.value as LessonContentType)} className="w-full px-2 py-1 border rounded mb-1 text-sm">
                        {(Object.values(LessonContentType) as string[]).map((type: string) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {lesson.contentType === LessonContentType.Video && <input type="text" placeholder="Video URL" value={lesson.content?.videoUrl || ''} onChange={e => handleLessonContentChange(index, 'videoUrl', e.target.value)} className="w-full px-2 py-1 border rounded text-sm"/>}
                    {lesson.contentType === LessonContentType.LiveSessionLink && <input type="text" placeholder="Live Session Link (e.g. Zoom)" value={lesson.content?.liveSessionDetails?.link || ''} onChange={e => handleLessonContentChange(index, 'liveSessionDetails', {...lesson.content?.liveSessionDetails, link: e.target.value})} className="w-full px-2 py-1 border rounded text-sm"/>}

                    <Button type="button" onClick={() => handleRemoveLesson(index)} variant="danger" size="sm" className="!p-1 mt-1"><TrashIcon className="h-4 w-4"/></Button>
                  </Card>
                ))}
                <Button type="button" onClick={handleAddLesson} variant="ghost" size="sm" className="flex items-center"><PlusIcon className="h-4 w-4 mr-1"/>Add Lesson</Button>
              </div>
            </>
          )}

          {contentCategory === 'ShortActivity' && (
            <>
              <div>
                <label htmlFor="shortActivityContentType" className="block text-sm font-medium text-gray-700">Activity Type</label>
                <select id="shortActivityContentType" value={shortActivityContentType} onChange={(e) => setShortActivityContentType(e.target.value as LessonContentType)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                  {(Object.values(LessonContentType) as string[])
                    .filter(t => t !== LessonContentType.LiveSessionLink)
                    .map((type: string) => <option key={type} value={type}>{type.replace(/([A-Z])/g, ' $1').trim()}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                  {(Object.values(DifficultyLevel) as string[])
                    .filter(l => l !== DifficultyLevel.AllLevels)
                    .map((level: string) => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
               <div className="flex items-center">
                <input type="checkbox" id="isPremiumActivity" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                <label htmlFor="isPremiumActivity" className="ml-2 block text-sm font-medium text-gray-700">This is a Premium Activity (one-time purchase)</label>
              </div>
            </>
          )}


          <div className="pt-2"> 
            <p className="text-sm font-medium text-gray-700">Upload Cover Image (Optional - Coming Soon)</p>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={isLoading || selectedAgeGroups.length === 0} className="!font-kidFriendly !text-xl bg-teal-600 hover:bg-teal-700">
            {isLoading ? <LoadingSpinner size="sm" /> : (isEditing ? 'Update & Submit for Review' : 'Submit for Review')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ActivityBuilderScreen;
