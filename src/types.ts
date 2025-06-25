
// Removed React import as it's not directly used for component types here for RN conversion.
// If specific React Native component types were needed, they would be imported from 'react-native'.

export enum UserRole {
  Kid = 'Kid',
  Parent = 'Parent',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export type AgeGroup = '2-4' | '5-7' | '8-10';
export type LearningLevel = 'Basic' | 'Intermediate' | 'Advanced';

export interface ActivityCategoryConfig { // Renamed from ActivityCategory
  id: string;
  name: string;
  icon: string; // Changed from React.ElementType to string (for icon name)
  color: string; 
}

export enum AppViewEnum { // Renamed from View to avoid conflict with React Native's View
  Splash,
  RoleSelection, 
  Login, 
  AgeSelection,
  ParentSetup,
  KidAvatarSelection,
  KidHome,
  CategoryActivitiesScreen,
  DrawAndTell, 
  WhyZone, 
  EmotionalLearning, 
  ShapePuzzleScreen, 
  JigsawPuzzleScreen, 
  TraceAnimalScreen, 
  ColorByNumberScreen, 
  FairytaleReaderScreen, 
  CountingGameScreen, 
  SimpleExperimentsScreen, 
  LetterSoundsScreen, 
  SpotTheDifferenceScreen, 
  MemoryMatchScreen, 
  FreeDrawScreen, 
  KidAchievements, 
  KidLearningPathView, 
  LiveClassPlaceholderView,
  ParentDashboard,
  ParentPostLoginSelection, 
  Settings, 
  CompareProgress, 
  ParentCourseDiscoveryView, 
  CourseDetailView, 
  TeacherProfileView, 
  ParentAddKid, 
  ParentManageKidDetail, 
  ParentSubscriptionScreen, 
  TeacherDashboard, 
  ActivityBuilder, 
  TeacherEarnings, 
  TeacherStudentProgress, 
  TeacherContentManagement, 
  TeacherVerificationView, 
  ChatListScreen,
  ChatRoomScreen,
  AdminDashboard,
  AdminTeacherVerificationApproval,
  AdminContentModeration,
  AdminUserManagement,
  AppInfo,
  ActivityPlaceholder,
}

export interface KidProfile {
  id: string; 
  parentId: string | null; 
  name:string;
  ageGroup: AgeGroup | null; 
  avatar: string; 
  interests: string[];
  level?: number; 
  badges?: string[]; 
  enrolledCourseIds?: string[]; 
  learningPathFocus?: string[]; 
  currentLearningLevel?: LearningLevel; 
}

export interface Review {
  id: string;
  parentId: string; 
  parentName?: string; 
  teacherId: string;
  courseId?: string; 
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  timestamp: number; 
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  bio?: string; 
  avatarUrl?: string; 
  ratingAverage?: number; 
  ratingCount?: number; 
  isVerified?: boolean; 
  verificationStatus?: 'NotSubmitted' | 'Pending' | 'Verified' | 'Rejected'; 
  certificates?: string[]; 
  subjects?: string[]; 
  coursesOfferedIds?: string[]; 
  reviews?: Review[]; 
}

export interface ParentalControls {
  kidId: string; 
  screenTimeLimit: number; 
  contentFilters: string[]; 
  playTimeScheduled: boolean;
  allowPremiumContent?: boolean; 
  blockedTeacherIds?: string[];
  subscribedCourseIds?: string[]; 
  activeMonthlySubscription?: boolean; 
  preferredTeacherIds?: string[]; 
}

export enum DifficultyLevel {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  AllLevels = 'AllLevels', 
}

export enum ActivityStatus {
  Pending = 'Pending', 
  Approved = 'Approved',
  Rejected = 'Rejected',
  Draft = 'Draft', 
  Active = 'Active', 
  Completed = 'Completed' 
}

export enum LessonContentType {
  Video = 'Video',
  InteractiveQuiz = 'InteractiveQuiz',
  DrawingChallenge = 'DrawingChallenge',
  Story = 'Story',
  LiveSessionLink = 'LiveSessionLink', 
  PDFResource = 'PDFResource',
  Puzzle = 'Puzzle',
  Game = 'Game', 
  TextArticle = 'TextArticle',
  LetterSound = 'LetterSound',
  SpotDifference = 'SpotDifference',
  MemoryGame = 'MemoryGame',
  FreeDraw = 'FreeDraw',
  NumberRecognition = 'NumberRecognition',
  SimpleAddition = 'SimpleAddition',
  PatternCompletion = 'PatternCompletion',
  SortingGame = 'SortingGame',
  ScienceExperiment = 'ScienceExperiment', 
  CodingActivity = 'CodingActivity', 
  Other = 'Other',
}

export interface ActivityContent { 
  title?: string;
  description?: string;
  imageUrls?: string[]; 
  audioUrls?: string[]; 
  storyText?: string; 
  quizQuestions?: { question: string; options: string[]; correctAnswerIndex: number }[];
  learningObjectives?: string[]; 
  videoUrl?: string; 
  resourceUrl?: string; 
  liveSessionDetails?: { platform: string; link: string; dateTime: number; durationMinutes?: number }; 
}

export interface Activity { 
  id: string;
  name: string; 
  category: 'Numbers' | 'Reading' | 'Puzzles' | 'Drawing' | 'General' | 'Alphabet' | 'Science' | 'Space' | 'Tech' | 'MathPuzzles';
  icon: string; // Changed from React.ElementType to string (for icon name)
  color: string;
  view?: AppViewEnum; // Changed from View
  ageGroups: AgeGroup[]; 
  contentType: LessonContentType; 
  activityContent?: ActivityContent; 
  creatorId?: string; 
  creatorType?: 'System' | 'Teacher';
  isPremium?: boolean; 
  difficulty?: DifficultyLevel;
  status?: ActivityStatus; 
  tags?: string[]; 
  learningObjectives?: string[];
  courseId?: string; 
  lessonOrder?: number; 
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  lessonOrder: number;
  contentType: LessonContentType;
  content: ActivityContent; 
  durationEstimateMinutes?: number; 
}

export interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  subject: string; 
  ageGroups: AgeGroup[];
  durationWeeks: number; 
  sessionsPerWeek: number; 
  isLiveFocused: boolean; 
  priceOneTime?: number; 
  priceMonthly?: number; 
  lessons: Lesson[];
  status: ActivityStatus; 
  imageUrl?: string; 
  ratingAverage?: number; 
  ratingCount?: number;
  enrollmentCount?: number; 
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; 
  text: string;
  timestamp: number;
  isRead?: boolean; 
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; 
  participants: ChatParticipant[]; 
  lastMessageText?: string;
  lastMessageTimestamp?: number;
  unreadCount?: { [userId: string]: number };
}

export interface StoryOutput {
  title: string;
  story: string;
  characters?: string[];
  setting?: string;
}
export interface WhyZoneAnswer {
  question: string;
  answer: string;
  simplifiedAnswer?: string; 
  relatedTopics?: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; 
  criteria: string; 
  courseId?: string; 
}

export interface KidProgress { 
  kidId: string;
  level: number;
  xp: number; 
  badgesEarned: string[]; 
  skillsMastered: { [skillId: string]: boolean }; 
  activitiesCompleted: { [activityId: string]: Date }; 
}

export interface KidCourseProgress {
    kidId: string;
    courseId: string;
    completedLessonIds: string[];
    currentLessonIndex: number; 
    startDate?: number; 
    completionDate?: number; 
    nextLiveSessionReminder?: number; 
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  currentUserRole: UserRole | null;
  currentKidProfileId: string | null; 
  currentParentProfileId: string | null; 
  currentTeacherProfileId: string | null;
  currentAdminProfileId: string | null; 
  adminProfile: AdminProfile | null; 
  kidProfiles: KidProfile[]; 
  parentalControlsMap: Record<string, ParentalControls>; 
  chatConversations: ChatConversation[];
  chatMessages: ChatMessage[];
}
