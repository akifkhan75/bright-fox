
import React from 'react';

export enum UserRole {
  Kid = 'Kid',
  Parent = 'Parent',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

// V3 Age Groups
export type AgeGroup = '2-4' | '5-7' | '8-10';
export type LearningLevel = 'Basic' | 'Intermediate' | 'Advanced';

export interface ActivityCategory {
  id: string;
  name: string;
  icon: React.ElementType; // Heroicon component
  color: string; // Tailwind bg color class
  // Activities will be filtered dynamically based on kid's profile
}

export enum View {
  Splash,
  RoleSelection, 
  Login, 
  // KidLogin, // REMOVED V5

  AgeSelection, // Still used if parent adds a kid and needs to set age
  ParentSetup, // Parent setting up their account and first kid (no PIN for kid)
  KidAvatarSelection, // Parent can trigger this for a kid from ParentManageKidDetailScreen
  KidHome, // Redesigned to V1 category style
  CategoryActivitiesScreen, // New V5: Shows activities for a selected category from KidHome
  
  // Specific Activity Views (might be lessons within courses now)
  DrawAndTell, 
  WhyZone, 
  EmotionalLearning, 
  
  // Default Activity Screens (many will be placeholders)
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

  // Kid Features
  KidAchievements, 
  KidLearningPathView, 
  LiveClassPlaceholderView,

  // Parent Features
  ParentDashboard,
  ParentPostLoginSelection, // New V5: Screen after parent login to choose dashboard or kid view
  Settings, 
  CompareProgress, 
  ParentCourseDiscoveryView, 
  CourseDetailView, 
  TeacherProfileView, 
  ParentAddKid, // V4/V5 (no PIN)
  ParentManageKidDetail, // V4/V5 (no PIN management, add avatar selection here)
  ParentSubscriptionScreen, // New: For managing subscriptions

  // Teacher Features
  TeacherDashboard, 
  ActivityBuilder, 
  TeacherEarnings, 
  TeacherStudentProgress, // Not fully implemented
  TeacherContentManagement, 
  TeacherVerificationView, 

  // Chat Features (V6)
  ChatListScreen,
  ChatRoomScreen,

  // Admin Features (Conceptual MVP)
  AdminDashboard,
  AdminTeacherVerificationApproval,
  AdminContentModeration,
  AdminUserManagement,

  AppInfo,
  ActivityPlaceholder, // Generic placeholder view
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
  // pin: string; // REMOVED V5
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

export enum LessonContentType { // Also used for Activity.contentType
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
  ScienceExperiment = 'ScienceExperiment', // New for science
  CodingActivity = 'CodingActivity', // New for tech
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
  category: 'Numbers' | 'Reading' | 'Puzzles' | 'Drawing' | 'General' | 'Alphabet' | 'Science' | 'Space' | 'Tech' | 'MathPuzzles'; // Expanded categories
  icon: React.ElementType; // Heroicon for the activity card on category screen
  color: string;  // Color for activity card
  view?: View; // The view to navigate to for this activity
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

export interface Message { // This was used by WhyZone. If ChatMessage is different, rename this or WhyZone's.
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

// V6 Chat Interfaces
export interface ChatParticipant {
  id: string; // userId (kidId, parentId, teacherId)
  name: string;
  avatarUrl?: string; // or KidProfile.avatar for kids
  role: UserRole;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string; // userId of the sender
  text: string;
  timestamp: number;
  isRead?: boolean; // Potentially track read status
}

export interface ChatConversation {
  id: string;
  participantIds: string[]; // [userId1, userId2]
  participants: ChatParticipant[]; // Denormalized for display
  lastMessageText?: string;
  lastMessageTimestamp?: number;
  unreadCount?: { [userId: string]: number }; // e.g., { 'parentId123': 2 }
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
  currentAdminProfileId: string | null; // New for Admin
  adminProfile: AdminProfile | null; // New for Admin
  kidProfiles: KidProfile[]; 
  parentalControlsMap: Record<string, ParentalControls>; 
  // V6 Chat State
  chatConversations: ChatConversation[];
  chatMessages: ChatMessage[];
}
