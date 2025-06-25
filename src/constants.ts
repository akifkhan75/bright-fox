
import React from 'react'; // Still needed if any part uses React types, otherwise remove.
import { AppViewEnum, KidProfile, ParentalControls, TeacherProfile, Badge, Activity, LessonContentType, DifficultyLevel, ActivityStatus, Course, Lesson, Review, AgeGroup, LearningLevel, ActivityCategoryConfig, ChatConversation, ChatMessage, ChatParticipant, UserRole, AdminProfile } from './types'; // ActivityCategory renamed to ActivityCategoryConfig

// Placeholder for React Native Icon Components or names
// In a real app, you'd import from 'react-native-vector-icons' or use SVG components.
// For this example, using string names for icons (assuming an icon library like Ionicons is used)
// Or, you can map these names to actual SVG components if you have them.
const IconPlaceholder = (props: { name: string; size: number; color: string }) => null; // Placeholder

export const APP_NAME = "BrightFox";
export const API_KEY_ERROR_MESSAGE = "API Key not found. Please ensure it's set in your environment variables.";

export const DEFAULT_KID_PROFILE: KidProfile = {
  id: 'defaultKid',
  parentId: null, 
  name: "Little Explorer",
  ageGroup: null, 
  avatar: "🦊", 
  interests: [],
  level: 1,
  badges: [],
  enrolledCourseIds: [],
  learningPathFocus: [], 
  currentLearningLevel: 'Basic', 
};

export const DEFAULT_PARENTAL_CONTROLS: Omit<ParentalControls, 'kidId'> = {
  screenTimeLimit: 60,
  contentFilters: [],
  playTimeScheduled: false,
  allowPremiumContent: true,
  blockedTeacherIds: [],
  subscribedCourseIds: [],
  activeMonthlySubscription: false,
};

export const DEFAULT_TEACHER_PROFILE: Omit<TeacherProfile, 'id' | 'email' | 'name'> = {
  bio: "Passionate educator dedicated to making learning fun and engaging for young minds. I believe in fostering creativity and curiosity in every child.",
  avatarUrl: "https://picsum.photos/seed/teacheravatar/100/100", 
  ratingAverage: 0,
  ratingCount: 0,
  isVerified: false,
  verificationStatus: 'NotSubmitted',
  certificates: [],
  subjects: [],
  coursesOfferedIds: [],
  reviews: [],
};

export const DEFAULT_ADMIN_PROFILE: Omit<AdminProfile, 'id' | 'email' | 'name'> = {};

export const AVATARS = [
  '🦊', '🐰', '🐻', '🐼', '🐨', '🦁', '🐯', '🦄', '🤖', '👾', '🧑‍🚀', '🧜‍♀️', '🐲', '🦉', '🦋', '🌟',
  '🍎', '🎈', '🚗', '⭐', '🌈', '🧩', '⚽', '🎸' 
];

export const INTERESTS_SUGGESTIONS = [
  'Animals', 'Space', 'Dinosaurs', 'Art', 'Music', 'Nature', 'Stories', 'Building', 'Puzzles', 'Science', 'Coding', 'Math'
];

export const SUBJECTS_LIST = ['Art', 'Math', 'Science', 'Reading', 'Music', 'Coding', 'Storytelling', 'Life Skills', 'Geography', 'History', 'Space Exploration', 'Technology Basics'];
export const LEARNING_LEVELS: LearningLevel[] = ['Basic', 'Intermediate', 'Advanced']; 
export const AGE_GROUPS_V3: AgeGroup[] = ['2-4', '5-7', '8-10'];

// For React Native, icon will be a string name for an icon font, or a component.
// For simplicity, using string names that could map to e.g. Ionicons or MaterialCommunityIcons.
export const ACTIVITY_CATEGORIES_CONFIG: ActivityCategoryConfig[] = [
    { id: 'alphabet', name: 'ABC Fun', icon: 'school-outline', color: 'bg-rose-400' }, 
    { id: 'numbers', name: 'Numbers', icon: 'calculator-outline', color: 'bg-orange-400' },
    { id: 'mathpuzzles', name: 'Math Puzzles', icon: 'bulb-outline', color: 'bg-sky-500' },
    { id: 'reading', name: 'Reading', icon: 'book-outline', color: 'bg-lime-500' },
    { id: 'puzzles', name: 'Puzzles', icon: 'extension-puzzle-outline', color: 'bg-green-500' },
    { id: 'drawing', name: 'Drawing', icon: 'brush-outline', color: 'bg-purple-500' },
    { id: 'science', name: 'Science Lab', icon: 'flask-outline', color: 'bg-teal-400' },
    { id: 'space', name: 'Space', icon: 'planet-outline', color: 'bg-indigo-500' }, 
    { id: 'tech', name: 'Tech Time', icon: 'hardware-chip-outline', color: 'bg-slate-500' },
];

export const BADGE_DEFINITIONS: Badge[] = [ /* Same as before */ ];

// For React Native, Activity.icon will be a string name or a pre-imported component
const createActivities = (category: Activity['category'], baseName: string, iconName: string, color: string, count: number, startView: AppViewEnum = AppViewEnum.ActivityPlaceholder, contentType: LessonContentType = LessonContentType.Game): Activity[] => {
  const activities: Activity[] = [];
  for (let i = 1; i <= count; i++) {
    activities.push({
      id: `${category.toString().toLowerCase()}_${baseName.toLowerCase().replace(/\s+/g, '_')}_${i}`,
      name: `${baseName} ${i}`,
      category,
      icon: iconName, // Store icon name as string
      color,
      view: startView, // Enum value
      ageGroups: ['2-4', '5-7', '8-10'] as AgeGroup[], 
      contentType,
      creatorType: 'System',
      difficulty: i % 3 === 0 ? DifficultyLevel.Hard : (i % 2 === 0 ? DifficultyLevel.Medium : DifficultyLevel.Easy),
      status: ActivityStatus.Approved,
      activityContent: { title: `${baseName} ${i}`, description: `A fun ${baseName.toLowerCase()} activity for kids.` }
    });
  }
  return activities;
};

// ACTIVITIES_CONFIG would need to be updated to use string icon names too
export const ACTIVITIES_CONFIG: Activity[] = [
  // --- ABC CATEGORY (Alphabet) ---
  ...createActivities('Alphabet', 'Letter Match', 'school-outline', 'bg-rose-400', 3, AppViewEnum.LetterSoundsScreen, LessonContentType.LetterSound),
  // ... other activities, ensuring icon is a string name
  { 
    id: 'counting_game_1', name: 'Count the Stars', category: 'Numbers', icon: 'calculator-outline', color: 'bg-orange-400', 
    view: AppViewEnum.CountingGameScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.Game,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Count the Stars", description: "How many twinkling stars can you count?" }
  },
  // ... many more activities converted similarly ...
];


export const MOCK_TEACHERS: TeacherProfile[] = [ /* Same as before */ ];
export const MOCK_COURSES: Course[] = [ /* Same as before, ensure enums are used correctly if they were strings */ ];
export const ALL_ACTIVITIES_MOCK = [...ACTIVITIES_CONFIG]; // This should use the updated ACTIVITIES_CONFIG


export const MOCK_CHAT_PARTICIPANTS: ChatParticipant[] = [ /* Same as before */ ];
export const MOCK_CHAT_CONVERSATIONS: ChatConversation[] = [ /* Same as before */ ];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [ /* Same as before */ ];

// Make sure paths to icons in ACTIVITY_CATEGORIES_CONFIG are React Native compatible
// For example, if 'AcademicCapIcon' was a Heroicon component, it's now 'school-outline' (Ionicons name example)
// You'll need to update the `ActivityCategory` type in `types.ts` for `icon` to be `string`.
// And in KidHomeScreen.tsx, you'll use an Icon component from react-native-vector-icons:
// import Icon from 'react-native-vector-icons/Ionicons';
// <Icon name={category.icon} size={30} color="#fff" />

// Update example:
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'alphabet')!.icon = 'school-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'numbers')!.icon = 'calculator-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'mathpuzzles')!.icon = 'bulb-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'reading')!.icon = 'book-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'puzzles')!.icon = 'extension-puzzle-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'drawing')!.icon = 'brush-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'science')!.icon = 'flask-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'space')!.icon = 'planet-outline';
ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === 'tech')!.icon = 'hardware-chip-outline';


// Update icons in ACTIVITIES_CONFIG to be string names
ACTIVITIES_CONFIG.forEach(activity => {
    switch (activity.category) {
        case 'Alphabet': activity.icon = 'school-outline'; break;
        case 'Numbers': activity.icon = 'calculator-outline'; break;
        case 'MathPuzzles': activity.icon = 'bulb-outline'; break;
        case 'Reading': activity.icon = 'book-outline'; break;
        case 'Puzzles': activity.icon = 'extension-puzzle-outline'; break;
        case 'Drawing': activity.icon = 'brush-outline'; break;
        case 'Science': activity.icon = 'flask-outline'; break;
        case 'Space': activity.icon = 'planet-outline'; break;
        case 'Tech': activity.icon = 'hardware-chip-outline'; break;
        case 'General': activity.icon = 'information-circle-outline'; break;
        default: activity.icon = 'shapes-outline'; // Default icon
    }
});
// Specific overrides if needed
const whyZoneActivity = ACTIVITIES_CONFIG.find(a => a.id === 'whyzone_1');
if(whyZoneActivity) whyZoneActivity.icon = 'help-circle-outline';

const emotionalLearningActivity = ACTIVITIES_CONFIG.find(a => a.id === 'emotional_learning_1');
if(emotionalLearningActivity) emotionalLearningActivity.icon = 'happy-outline';


