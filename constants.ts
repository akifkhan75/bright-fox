
import React from 'react';
import { View, KidProfile, ParentalControls, TeacherProfile, Badge, Activity, LessonContentType, DifficultyLevel, ActivityStatus, Course, Lesson, Review, AgeGroup, LearningLevel, ActivityCategory, ChatConversation, ChatMessage, ChatParticipant, UserRole, AdminProfile } from './types';
import { 
    SparklesIcon, CalculatorIcon, BookOpenIcon, PuzzlePieceIcon, PaintBrushIcon, QuestionMarkCircleIcon, HeartIcon, BeakerIcon, 
    AcademicCapIcon, VideoCameraIcon, DocumentDuplicateIcon, LightBulbIcon, Squares2X2Icon, HomeIcon, InformationCircleIcon,
    Bars3BottomLeftIcon, MusicalNoteIcon, CodeBracketIcon, ChatBubbleLeftRightIcon, HandRaisedIcon, LinkIcon, MapIcon,
    EyeIcon, SunIcon, MoonIcon, CloudIcon, UserGroupIcon, GlobeAltIcon, MagnifyingGlassIcon, PencilIcon, AdjustmentsHorizontalIcon,
    ReceiptPercentIcon, BuildingLibraryIcon, CubeIcon // Added more icons
} from 'react-native-heroicons/solid'; // Using solid for more impact on KidHome

export const APP_NAME = "BrightFox";
export const API_KEY_ERROR_MESSAGE = "API Key not found. Please ensure it's set in your environment variables.";

export const DEFAULT_KID_PROFILE: KidProfile = {
  id: 'defaultKid',
  parentId: null, 
  name: "Little Explorer",
  ageGroup: null, 
  avatar: "🦊", // Default avatar
  interests: [],
  level: 1,
  badges: [],
  enrolledCourseIds: [],
  // pin: '1234', // REMOVED V5
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

export const DEFAULT_ADMIN_PROFILE: Omit<AdminProfile, 'id' | 'email' | 'name'> = {
  // Basic admin profile structure, specific ID/email/name will be set on login
};


export const AVATARS = [
  '🦊', '🐰', '🐻', '🐼', '🐨', '🦁', '🐯', '🦄', '🤖', '👾', '🧑‍🚀', '🧜‍♀️', '🐲', '🦉', '🦋', '🌟',
  '🍎', '🎈', '🚗', '⭐', '🌈', '🧩', '⚽', '🎸' 
];

export const INTERESTS_SUGGESTIONS = [
  'Animals', 'Space', 'Dinosaurs', 'Art', 'Music', 'Nature', 'Stories', 'Building', 'Puzzles', 'Science', 'Coding', 'Math'
];

export const SUBJECTS_LIST = ['Art', 'Math', 'Science', 'Reading', 'Music', 'Coding', 'Storytelling', 'Life Skills', 'Geography', 'History'];
export const LEARNING_LEVELS: LearningLevel[] = ['Basic', 'Intermediate', 'Advanced']; 
export const AGE_GROUPS_V3: AgeGroup[] = ['2-4', '5-7', '8-10'];

// For V1 KidHomeScreen style V5
export const ACTIVITY_CATEGORIES_CONFIG: ActivityCategory[] = [
    { id: 'numbers', name: 'Numbers', icon: CalculatorIcon, color: 'bg-orange-400 hover:bg-orange-500' },
    { id: 'reading', name: 'Reading', icon: BookOpenIcon, color: 'bg-sky-500 hover:bg-sky-600' },
    { id: 'puzzles', name: 'Puzzles', icon: PuzzlePieceIcon, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'drawing', name: 'Drawing', icon: PaintBrushIcon, color: 'bg-purple-500 hover:bg-purple-600' },
];

export const BADGE_DEFINITIONS: Badge[] = [
  { id: 'puzzle_beginner', name: 'Puzzle Starter', description: 'Completed your first puzzle!', icon: '🧩', criteria: 'Complete 1 puzzle activity' },
  { id: 'story_lover', name: 'Story Lover', description: 'Finished 5 stories or story lessons!', icon: '📚', criteria: 'Complete 5 story items' },
  { id: 'creative_spark', name: 'Creative Spark', description: 'Shared your first drawing masterpiece!', icon: '🎨', criteria: 'Complete 1 drawing activity' },
  { id: 'curious_mind', name: 'Curious Mind', description: 'Asked 3 questions in Why Zone!', icon: '🤔', criteria: 'Ask 3 questions' },
  { id: 'math_course_lvl1', name: 'Math Explorer', description: 'Completed "Fun with Numbers" course!', icon: '➕', criteria: 'Complete course: math_fun_numbers', courseId: 'course_math_101' },
  { id: 'art_course_beginner', name: 'Art Adventurer', description: 'Completed "Creative Colors" course!', icon: '🖼️', criteria: 'Complete course: art_creative_colors', courseId: 'course_art_101' },
  { id: 'science_whiz_1', name: 'Junior Scientist', description: 'Finished "My First Science Lab"!', icon: '🔬', criteria: 'Complete course: science_lab_101', courseId: 'course_science_101' },
];

const createActivities = (category: 'Numbers' | 'Reading' | 'Puzzles' | 'Drawing', baseName: string, icon: React.ElementType, color: string, count: number, startView: View = View.ActivityPlaceholder, contentType: LessonContentType = LessonContentType.Game): Activity[] => {
  const activities: Activity[] = [];
  for (let i = 1; i <= count; i++) {
    activities.push({
      id: `${category.toLowerCase()}_${baseName.toLowerCase().replace(/\s+/g, '_')}_${i}`,
      name: `${baseName} ${i}`,
      category,
      icon,
      color,
      view: startView,
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

export const ACTIVITIES_CONFIG: Activity[] = [
  // --- NUMBERS CATEGORY (Target: 10+ activities) ---
  { 
    id: 'counting_game_1', name: 'Count the Stars', category: 'Numbers', icon: CalculatorIcon, color: 'bg-orange-400', 
    view: View.CountingGameScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.Game,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Count the Stars", description: "How many twinkling stars can you count?" }
  },
  { 
    id: 'simple_addition_1', name: 'Easy Addition', category: 'Numbers', icon: CalculatorIcon, color: 'bg-orange-400', 
    view: View.ActivityPlaceholder, ageGroups: ['5-7'], contentType: LessonContentType.SimpleAddition,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "1 + 1 = ?", description: "Solve simple addition problems like 1+1 and 2+2." }
  },
  ...createActivities('Numbers', 'Number Recognition', MagnifyingGlassIcon, 'bg-orange-400', 3, View.ActivityPlaceholder, LessonContentType.NumberRecognition), // Existing: 3
  ...createActivities('Numbers', 'Shape Counting', CubeIcon, 'bg-orange-400', 3), // Existing: 3
  ...createActivities('Numbers', 'What Comes Next', LightBulbIcon, 'bg-orange-400', 3, View.ActivityPlaceholder, LessonContentType.PatternCompletion), // Existing: 3
  // New Number Activities
  ...createActivities('Numbers', 'Number Tracing', PencilIcon, 'bg-orange-400', 3), 
  ...createActivities('Numbers', 'More or Less', AdjustmentsHorizontalIcon, 'bg-orange-400', 2),
  // Total Numbers = 2 (manual) + 3+3+3+3+2 = 16

  // --- READING CATEGORY (Target: 10+ activities) ---
  { 
    id: 'fairytale_reader_1', name: 'Fox Learns to Read', category: 'Reading', icon: BookOpenIcon, color: 'bg-sky-500', 
    view: View.FairytaleReaderScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.Story,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Fox Learns to Read", storyText: "Finley the fox wanted to read all the books in the forest library..." }
  },
  { 
    id: 'letter_sounds_1', name: 'Letter Sounds Fun', category: 'Reading', icon: MusicalNoteIcon, color: 'bg-sky-500', 
    view: View.LetterSoundsScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.LetterSound,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "A says /a/", description: "Learn the sounds letters make." }
  },
  ...createActivities('Reading', 'Case Match', Bars3BottomLeftIcon, 'bg-sky-500', 3), // Existing: 3
  ...createActivities('Reading', 'Missing Letter', MagnifyingGlassIcon, 'bg-sky-500', 3, View.ActivityPlaceholder, LessonContentType.Puzzle), // Existing: 3
  ...createActivities('Reading', 'Sight Words', EyeIcon, 'bg-sky-500', 3), // Existing: 3
  // New Reading Activities
  ...createActivities('Reading', 'Story Sequencing', BuildingLibraryIcon, 'bg-sky-500', 2, View.ActivityPlaceholder, LessonContentType.Story),
  ...createActivities('Reading', 'Rhyming Words', ChatBubbleLeftRightIcon, 'bg-sky-500', 2),
  // Total Reading = 2 (manual) + 3+3+3+2+2 = 15

  // --- PUZZLES CATEGORY (Target: 10+ activities) ---
  { 
    id: 'shape_puzzle_1', name: 'Shape Sorter', category: 'Puzzles', icon: PuzzlePieceIcon, color: 'bg-green-500', 
    view: View.ShapePuzzleScreen, ageGroups: ['2-4'], contentType: LessonContentType.Puzzle,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Match the Shapes", description: "Drag the shapes to their correct outlines." }
  },
  { 
    id: 'jigsaw_puzzle_1', name: 'Animal Jigsaw', category: 'Puzzles', icon: PuzzlePieceIcon, color: 'bg-green-500', 
    view: View.JigsawPuzzleScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.Puzzle,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Friendly Lion Jigsaw", description: "Put the pieces together to see the lion." }
  },
   { 
    id: 'spot_difference_1', name: 'Spot Differences', category: 'Puzzles', icon: EyeIcon, color: 'bg-green-500', 
    view: View.SpotTheDifferenceScreen, ageGroups: ['5-7', '8-10'], contentType: LessonContentType.SpotDifference,
    creatorType: 'System', difficulty: DifficultyLevel.Medium, status: ActivityStatus.Approved,
    activityContent: { title: "Find 5 Differences", description: "Look closely at the two pictures and find what's different." }
  },
  { 
    id: 'memory_match_1', name: 'Memory Cards', category: 'Puzzles', icon: Squares2X2Icon, color: 'bg-green-500', 
    view: View.MemoryMatchScreen, ageGroups: ['2-4', '5-7', '8-10'], contentType: LessonContentType.MemoryGame,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Animal Memory Match", description: "Flip the cards and find the matching pairs." }
  },
  ...createActivities('Puzzles', 'Pattern Completion', LightBulbIcon, 'bg-green-500', 2, View.ActivityPlaceholder, LessonContentType.PatternCompletion), // Existing: 2 + 4 manual = 6
  ...createActivities('Puzzles', 'Odd One Out', QuestionMarkCircleIcon, 'bg-green-500', 2, View.ActivityPlaceholder, LessonContentType.Puzzle), // Existing: 2
  // New Puzzle Activities
  ...createActivities('Puzzles', 'Logic Grid', ReceiptPercentIcon, 'bg-green-500', 2),
  ...createActivities('Puzzles', 'Connect the Dots', LinkIcon, 'bg-green-500', 2),
  ...createActivities('Puzzles', 'Mazes', MapIcon, 'bg-green-500', 2),
  // Total Puzzles = 4 (manual) + 2+2+2+2+2 = 14

  // --- DRAWING CATEGORY (Target: 10+ activities) ---
  { 
    id: 'draw_tell_ai_1', name: 'AI Story Doodle', category: 'Drawing', icon: SparklesIcon, color: 'bg-purple-500', 
    view: View.DrawAndTell, ageGroups: ['5-7', '8-10'], contentType: LessonContentType.DrawingChallenge, 
    creatorType: 'System', difficulty: DifficultyLevel.Medium, status: ActivityStatus.Approved,
    activityContent: { description: "Draw something amazing and let AI weave a tale about it!" }
  },
  { 
    id: 'trace_animal_1', name: 'Trace a Cat', category: 'Drawing', icon: PencilIcon, color: 'bg-purple-500', 
    view: View.TraceAnimalScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.DrawingChallenge,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Trace the Cute Cat", description: "Follow the lines to draw a friendly cat." }
  },
  { 
    id: 'color_by_number_1', name: 'Rainbow Color Fun', category: 'Drawing', icon: PaintBrushIcon, color: 'bg-purple-500', 
    view: View.ColorByNumberScreen, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.DrawingChallenge,
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
    activityContent: { title: "Color a Rainbow by Number", description: "Match the numbers to colors and bring the rainbow to life!" }
  },
   { 
    id: 'free_draw_1', name: 'My Masterpiece', category: 'Drawing', icon: PaintBrushIcon, color: 'bg-purple-500', 
    view: View.FreeDrawScreen, ageGroups: ['2-4', '5-7', '8-10'], contentType: LessonContentType.FreeDraw,
    creatorType: 'System', difficulty: DifficultyLevel.AllLevels, status: ActivityStatus.Approved,
    activityContent: { title: "Free Drawing Canvas", description: "Draw whatever your imagination desires!" }
  },
  ...createActivities('Drawing', 'Finish the Picture', LightBulbIcon, 'bg-purple-500', 2, View.ActivityPlaceholder, LessonContentType.DrawingChallenge), // Existing: 2 + 4 manual = 6
  ...createActivities('Drawing', 'Doodle Prompts', SparklesIcon, 'bg-purple-500', 2, View.ActivityPlaceholder, LessonContentType.DrawingChallenge), // Existing: 2
  // New Drawing Activities
  ...createActivities('Drawing', 'Pixel Art', CubeIcon, 'bg-purple-500', 2),
  ...createActivities('Drawing', 'Symmetry Draw', SunIcon, 'bg-purple-500', 2),
  ...createActivities('Drawing', 'Mandala Color', MoonIcon, 'bg-purple-500', 2),
  // Total Drawing = 4 (manual) + 2+2+2+2+2 = 14
  
  // --- GENERAL / OTHER ACTIVITIES --- (ensure they have a category)
  { 
    id: 'whyzone_1', name: 'Ask a Question!', category: 'General', icon: QuestionMarkCircleIcon, color: 'bg-yellow-400', 
    view: View.WhyZone, ageGroups: ['2-4', '5-7', '8-10'], contentType: LessonContentType.InteractiveQuiz, 
    creatorType: 'System', difficulty: DifficultyLevel.AllLevels, status: ActivityStatus.Approved,
  },
  { 
    id: 'emotional_learning_1', name: 'My Feelings', category: 'General', icon: HeartIcon, color: 'bg-pink-400', 
    view: View.EmotionalLearning, ageGroups: ['2-4', '5-7'], contentType: LessonContentType.Game, 
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
  },
  { 
    id: 'simple_experiments_1', name: 'Kitchen Science', category: 'General', icon: BeakerIcon, color: 'bg-teal-400', 
    view: View.SimpleExperimentsScreen, ageGroups: ['5-7', '8-10'], contentType: LessonContentType.Game, 
    creatorType: 'System', difficulty: DifficultyLevel.Easy, status: ActivityStatus.Approved,
  },
];


export const MOCK_TEACHERS: TeacherProfile[] = [
  {
    id: 'teacher_jane_doe', name: 'Jane Doe', email: 'jane@example.com',
    bio: "Hi! I'm Jane, a certified early childhood educator with 5 years of experience. I love making math and science fun for little ones! My classes are interactive and full of exciting experiments and games.",
    avatarUrl: 'https://picsum.photos/seed/janedoe/100/100',
    ratingAverage: 4.8, ratingCount: 25, isVerified: true, verificationStatus: 'Verified',
    certificates: ["Early Childhood Education Degree", "Advanced Child Psychology Certificate"],
    subjects: ["Math", "Science", "Early Learning"], coursesOfferedIds: ['course_math_101', 'course_science_101'],
    reviews: [
        { id:'review1', parentId:'parent_1', parentName:'Sarah M.', teacherId:'teacher_jane_doe', courseId:'course_math_101', rating:5, comment:"Jane is fantastic! My son (4) loves her math class and is always excited for it.", timestamp: Date.now() - 100000000 },
        { id:'review2', parentId:'parent_2', parentName:'Tom B.', teacherId:'teacher_jane_doe', courseId:'course_science_101', rating:4, comment:"Great science experiments, very engaging.", timestamp: Date.now() - 200000000 },
    ]
  },
  {
    id: 'teacher_john_smith', name: 'John Smith', email: 'john@example.com',
    bio: "Hello! I'm John, an artist and storyteller. I believe every child has a unique creative voice. In my classes, we explore different art forms and weave magical tales together.",
    avatarUrl: 'https://picsum.photos/seed/johnsmith/100/100',
    ratingAverage: 4.5, ratingCount: 15, isVerified: true, verificationStatus: 'Verified',
    certificates: ["Fine Arts Degree", "Storytelling Masterclass"],
    subjects: ["Art", "Storytelling", "Creative Writing"], coursesOfferedIds: ['course_art_101'],
    reviews: [
        { id:'review3', parentId:'parent_3', parentName:'Linda K.', teacherId:'teacher_john_smith', courseId:'course_art_101', rating:5, comment:"John's art class is amazing. My daughter has learned so much and her creativity has blossomed!", timestamp: Date.now() - 50000000 },
    ]
  },
  {
    id: 'teacher_pending_approval', name: 'Alex Pending', email: 'alex@example.com',
    bio: "Aspiring coding instructor for young kids. Excited to share the world of programming!",
    avatarUrl: 'https://picsum.photos/seed/alexpending/100/100',
    ratingAverage: 0, ratingCount: 0, isVerified: false, verificationStatus: 'Pending',
    subjects: ["Coding"], coursesOfferedIds: ['course_coding_101'],
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course_math_101', title: 'Fun with Numbers (Level 1)',
    description: "An exciting introduction to numbers, counting, and basic shapes for young learners. We'll play games, sing songs, and explore math in everyday objects!",
    teacherId: 'teacher_jane_doe', subject: 'Math', ageGroups: ['2-4', '5-7'],
    durationWeeks: 4, sessionsPerWeek: 2, isLiveFocused: true,
    priceOneTime: 20, status: ActivityStatus.Active,
    imageUrl: 'https://picsum.photos/seed/mathcourse/300/200',
    ratingAverage: 4.8, ratingCount: 10, enrollmentCount: 15,
    lessons: [
      { id: 'm101_l1', title: 'Counting 1 to 5', lessonOrder: 1, contentType: LessonContentType.LiveSessionLink, content: { title:"Live: Counting Fun!", liveSessionDetails: { platform: 'Zoom', link: '#', dateTime: Date.now() + 86400000, durationMinutes: 30 } } },
      { id: 'm101_l2', title: 'Spot the Shapes', lessonOrder: 2, contentType: LessonContentType.InteractiveQuiz, content: { title:"Quiz: Shapes Around Us", quizQuestions: [{question: "What shape is a ball?", options:["Circle", "Square"], correctAnswerIndex:0}] } },
      { id: 'm101_l3', title: 'More Counting Games (1-10)', lessonOrder: 3, contentType: LessonContentType.LiveSessionLink, content: { title:"Live: Number Adventures!", liveSessionDetails: { platform: 'Zoom', link: '#', dateTime: Date.now() + (86400000*3), durationMinutes: 30 } } },
      { id: 'm101_l4', title: 'Recap & Fun Math Story', lessonOrder: 4, contentType: LessonContentType.Video, content: { title:"Video: The Number Story", videoUrl: "#" } },
    ]
  },
  {
    id: 'course_art_101', title: 'Creative Colors & Crafts',
    description: "Let's explore the wonderful world of colors! We'll paint, draw, and make fun crafts. Unleash your inner artist!",
    teacherId: 'teacher_john_smith', subject: 'Art', ageGroups: ['5-7'],
    durationWeeks: 6, sessionsPerWeek: 1, isLiveFocused: false, 
    priceMonthly: 15, status: ActivityStatus.Active,
    imageUrl: 'https://picsum.photos/seed/artcourse/300/200',
    ratingAverage: 4.5, ratingCount: 8, enrollmentCount: 12,
    lessons: [
      { id: 'a101_l1', title: 'Introduction to Colors', lessonOrder: 1, contentType: LessonContentType.Video, content: { title:"Video: Rainbow Colors!", videoUrl:"#" } },
      { id: 'a101_l2', title: 'My First Painting', lessonOrder: 2, contentType: LessonContentType.DrawingChallenge, content: { title:"Challenge: Paint a Sunset", description:"Use red, orange, and yellow to paint a beautiful sunset."} },
      { id: 'a101_l3', title: 'Fun with Playdough', lessonOrder: 3, contentType: LessonContentType.Video, content: { title:"Video: DIY Playdough Animals", videoUrl:"#"} },
      { id: 'a101_l4', title: 'Storytelling Through Art', lessonOrder: 4, contentType: LessonContentType.LiveSessionLink, content: { title:"Optional Live Q&A and Show & Tell", liveSessionDetails: { platform: 'Zoom', link: '#', dateTime: Date.now() + (86400000*7), durationMinutes: 45 } } },
    ]
  },
  {
    id: 'course_science_101', title: 'My First Science Lab',
    description: "Become a junior scientist! We'll do simple and safe experiments at home to learn about the world around us.",
    teacherId: 'teacher_jane_doe', subject: 'Science', ageGroups: ['5-7', '8-10'],
    durationWeeks: 4, sessionsPerWeek: 1, isLiveFocused: true,
    priceOneTime: 25, status: ActivityStatus.Active,
    imageUrl: 'https://picsum.photos/seed/sciencecourse/300/200',
    enrollmentCount: 20,
    lessons: [
       { id: 's101_l1', title: 'Float or Sink?', lessonOrder: 1, contentType: LessonContentType.LiveSessionLink, content: { title:"Live Experiment: Float or Sink?", liveSessionDetails: { platform: 'Zoom', link: '#', dateTime: Date.now() + (86400000*2), durationMinutes: 40 } } },
       { id: 's101_l2', title: 'DIY Volcano', lessonOrder: 2, contentType: LessonContentType.Video, content: { title:"Video: Exploding Volcano Fun!", videoUrl:"#" } },
    ]
  },
  {
    id: 'course_coding_101', title: 'Coding for Kiddos: Block Basics',
    description: "Learn the basics of coding using fun block-based visual programming. Create your own simple games and animations!",
    teacherId: 'teacher_pending_approval', subject: 'Coding', ageGroups: ['8-10'],
    durationWeeks: 8, sessionsPerWeek: 1, isLiveFocused: true,
    priceOneTime: 50, status: ActivityStatus.Pending, 
    imageUrl: 'https://picsum.photos/seed/codingcourse/300/200',
    lessons: [
       { id: 'c101_l1', title: 'What is Coding?', lessonOrder: 1, contentType: LessonContentType.LiveSessionLink, content: { title:"Live Intro: Your First Code Blocks", liveSessionDetails: { platform: 'Zoom', link: '#', dateTime: Date.now() + (86400000*5), durationMinutes: 45 } } },
    ]
  }
];

export const ALL_ACTIVITIES_MOCK = [...ACTIVITIES_CONFIG];


// V6 Chat Mock Data
export const MOCK_CHAT_PARTICIPANTS: ChatParticipant[] = [
    { id: 'parent123', name: 'You (Parent)', role: UserRole.Parent, avatarUrl: 'https://picsum.photos/seed/parent123/50/50' },
    { id: 'teacher_jane_doe', name: 'Jane Doe', role: UserRole.Teacher, avatarUrl: MOCK_TEACHERS.find(t=>t.id === 'teacher_jane_doe')?.avatarUrl },
    { id: 'teacher_john_smith', name: 'John Smith', role: UserRole.Teacher, avatarUrl: MOCK_TEACHERS.find(t=>t.id === 'teacher_john_smith')?.avatarUrl },
    // A Test Teacher profile is created on login, so we might not need it here unless we want a pre-existing chat.
];


export const MOCK_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'convo1_parent123_teacher_jane_doe',
    participantIds: ['parent123', 'teacher_jane_doe'],
    participants: [
        MOCK_CHAT_PARTICIPANTS.find(p=>p.id === 'parent123')!, 
        MOCK_CHAT_PARTICIPANTS.find(p=>p.id === 'teacher_jane_doe')!
    ],
    lastMessageText: "Thanks for the update on Math 101!",
    lastMessageTimestamp: Date.now() - 3600000, // 1 hour ago
    unreadCount: { 'parent123': 0, 'teacher_jane_doe': 1 }
  },
  {
    id: 'convo2_parent123_teacher_john_smith',
    participantIds: ['parent123', 'teacher_john_smith'],
    participants: [
        MOCK_CHAT_PARTICIPANTS.find(p=>p.id === 'parent123')!, 
        MOCK_CHAT_PARTICIPANTS.find(p=>p.id === 'teacher_john_smith')!
    ],
    lastMessageText: "Okay, see you in the Art class showcase!",
    lastMessageTimestamp: Date.now() - (3600000 * 24 * 2), // 2 days ago
    unreadCount: { 'parent123': 0, 'teacher_john_smith': 0 }
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  // Conversation 1
  { id: 'msg1', conversationId: 'convo1_parent123_teacher_jane_doe', senderId: 'teacher_jane_doe', text: "Hi! Just wanted to let you know Finley did great in today's math session!", timestamp: Date.now() - 3700000 },
  { id: 'msg2', conversationId: 'convo1_parent123_teacher_jane_doe', senderId: 'parent123', text: "That's wonderful to hear! Thanks for the update on Math 101!", timestamp: Date.now() - 3600000 },
  
  // Conversation 2
  { id: 'msg3', conversationId: 'convo2_parent123_teacher_john_smith', senderId: 'parent123', text: "Quick question about the art supplies for next week.", timestamp: Date.now() - (3600000 * 24 * 2) - 120000 },
  { id: 'msg4', conversationId: 'convo2_parent123_teacher_john_smith', senderId: 'teacher_john_smith', text: "Sure! We'll just need the usual crayons and paper. No special items this time.", timestamp: Date.now() - (3600000 * 24 * 2) - 60000 },
  { id: 'msg5', conversationId: 'convo2_parent123_teacher_john_smith', senderId: 'parent123', text: "Perfect, thanks! Okay, see you in the Art class showcase!", timestamp: Date.now() - (3600000 * 24 * 2) },
];
