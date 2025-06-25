
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { View, KidProfile, ParentalControls, TeacherProfile, UserRole, AppState, Activity, KidProgress, Course, Review, KidCourseProgress, AgeGroup, LearningLevel, ChatConversation, ChatMessage, ChatParticipant, AdminProfile, ActivityStatus } from './types';
import { DEFAULT_KID_PROFILE, DEFAULT_PARENTAL_CONTROLS, DEFAULT_TEACHER_PROFILE, AVATARS, APP_NAME, MOCK_CHAT_CONVERSATIONS, MOCK_CHAT_MESSAGES, DEFAULT_ADMIN_PROFILE } from './constants';
// import * as mockApi from './services/mockApi'; // OLD MOCK API
import * as apiService from './services/apiService'; // NEW API SERVICE

// Import Pages (Screens)
import SplashScreen from './pages/SplashScreen';
import RoleSelectionScreen from './pages/RoleSelectionScreen'; 
import LoginScreen from './pages/LoginScreen'; 
import KidLoginScreen from './pages/KidLoginScreen'; 

import AgeSelectionScreen from './pages/AgeSelectionScreen';
import ParentSetupScreen from './pages/ParentSetupScreen'; 
import KidAvatarSelectionScreen from './pages/KidAvatarSelectionScreen';
import KidHomeScreen from './pages/KidHomeScreen'; 
import CategoryActivitiesScreen from './pages/kid/CategoryActivitiesScreen'; 
import MyAchievementsScreen from './pages/kid/MyAchievementsScreen'; 
import KidLearningPathScreen from './pages/kid/KidLearningPathScreen'; 
import LiveClassPlaceholderScreen from './pages/LiveClassPlaceholderScreen'; 

import ParentDashboardScreen from './pages/ParentDashboardScreen'; 
import ParentPostLoginSelectionScreen from './pages/parent/ParentPostLoginSelectionScreen'; 
import SettingsScreen from './pages/SettingsScreen'; 
import CompareProgressScreen from './pages/parent/CompareProgressScreen'; 
import ParentCourseDiscoveryScreen from './pages/parent/ParentCourseDiscoveryScreen'; 
import CourseDetailScreen from './pages/parent/CourseDetailScreen'; 
import TeacherProfileViewScreen from './pages/parent/TeacherProfileViewScreen'; 
import ParentAddKidScreen from './pages/parent/ParentAddKidScreen'; 
import ParentManageKidDetailScreen from './pages/parent/ParentManageKidDetailScreen'; 
import ParentSubscriptionScreen from './pages/parent/ParentSubscriptionScreen'; 


import TeacherDashboardScreen from './pages/teacher/TeacherDashboardScreen'; 
import ActivityBuilderScreen from './pages/teacher/ActivityBuilderScreen'; 
import TeacherContentManagementScreen from './pages/teacher/TeacherContentManagementScreen';
import TeacherEarningsScreen from './pages/teacher/TeacherEarningsScreen'; 
import TeacherVerificationScreen from './pages/teacher/TeacherVerificationScreen'; 

// V6 Chat Screens
import ChatListScreen from './pages/chat/ChatListScreen';
import ChatRoomScreen from './pages/chat/ChatRoomScreen';

// Admin Screens (Conceptual MVP)
import AdminDashboardScreen from './pages/admin/AdminDashboardScreen';
import AdminTeacherVerificationApprovalScreen from './pages/admin/AdminTeacherVerificationApprovalScreen';
import AdminContentModerationScreen from './pages/admin/AdminContentModerationScreen';
import AdminUserManagementScreen from './pages/admin/AdminUserManagementScreen';


import DrawAndTellScreen from './pages/DrawAndTellScreen';
import WhyZoneScreen from './pages/WhyZoneScreen';
import EmotionalLearningScreen from './pages/EmotionalLearningScreen';
import AppInfoScreen from './pages/AppInfoScreen';
import ActivityPlaceholderScreen from './pages/ActivityPlaceholderScreen'; 

// Default Activity Screens
import ShapePuzzleScreen from './pages/activities/ShapePuzzleScreen';
import JigsawPuzzleScreen from './pages/activities/JigsawPuzzleScreen';
import TraceAnimalScreen from './pages/activities/TraceAnimalScreen';
import ColorByNumberScreen from './pages/activities/ColorByNumberScreen';
import FairytaleReaderScreen from './pages/activities/FairytaleReaderScreen';
import CountingGameScreen from './pages/activities/CountingGameScreen';
import SimpleExperimentsScreen from './pages/activities/SimpleExperimentsScreen';

const LetterSoundsScreenPlaceholder: React.FC = () => <ActivityPlaceholderScreen activityName="Letter Sounds Fun" />;
const SpotTheDifferenceScreenPlaceholder: React.FC = () => <ActivityPlaceholderScreen activityName="Spot The Difference" />;
const MemoryMatchScreenPlaceholder: React.FC = () => <ActivityPlaceholderScreen activityName="Memory Match" />;
const FreeDrawScreenPlaceholder: React.FC = () => <ActivityPlaceholderScreen activityName="Free Draw Canvas" />;


// Import Components
import NavigationBottom from './components/NavigationBottom';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner'; // Import LoadingSpinner

const initialAppState: AppState = {
  currentUserRole: null,
  currentKidProfileId: null,
  currentParentProfileId: null,
  currentTeacherProfileId: null,
  currentAdminProfileId: null,
  adminProfile: null,
  kidProfiles: [],
  parentalControlsMap: {},
  chatConversations: MOCK_CHAT_CONVERSATIONS, 
  chatMessages: MOCK_CHAT_MESSAGES, 
};

export const AppContext = React.createContext<{
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  
  kidProfile: KidProfile | null; 
  setKidProfile: React.Dispatch<React.SetStateAction<KidProfile | null>>; 
  parentalControls: ParentalControls | null; 
  setParentalControls: React.Dispatch<React.SetStateAction<ParentalControls | null>>;
  
  teacherProfile: TeacherProfile | null; 
  setTeacherProfile: React.Dispatch<React.SetStateAction<TeacherProfile | null>>;
  adminProfile: AdminProfile | null; 
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile | null>>; 
  allTeacherProfiles: TeacherProfile[]; 
  setAllTeacherProfiles: React.Dispatch<React.SetStateAction<TeacherProfile[]>>; 
  
  kidProgress: KidProgress | null; 
  setKidProgress: React.Dispatch<React.SetStateAction<KidProgress | null>>;
  
  kidCourseProgressMap: Record<string, KidCourseProgress>; 
  setKidCourseProgressMap: React.Dispatch<React.SetStateAction<Record<string, KidCourseProgress>>>;
  
  allActivities: Activity[]; 
  setAllActivities: React.Dispatch<React.SetStateAction<Activity[]>>; 
  allCourses: Course[]; 
  setAllCourses: React.Dispatch<React.SetStateAction<Course[]>>; 
  allReviews: Review[]; 
  addReview: (review: Review) => void; 
  
  setViewWithPath: (view: View, path?: string, options?: { replace?: boolean; state?: any }) => void;
  goBack: () => void;
  
  hasOnboardedKid: boolean; 
  setHasOnboardedKid: React.Dispatch<React.SetStateAction<boolean>>;
  
  logout: () => void;
  switchToParentView: () => void; 
  currentView: View; 
  
  enrollInCourse: (kidId: string, courseId: string) => Promise<boolean>;
  updateLessonProgress: (kidId: string, courseId: string, lessonId: string) => void;

  addKidProfileToParent: (newKidData: Omit<KidProfile, 'id' | 'parentId' | 'avatar'>, controlsData: Omit<ParentalControls, 'kidId'>) => KidProfile | null;
  updateKidProfileAndControls: (updatedKid: KidProfile, updatedControls: ParentalControls) => void;
  switchViewToKidAsParent: (kidId: string) => void;
  submitTeacherVerification: (teacherId: string, documentsData: any) => Promise<boolean>;
  loginKidWithPin: (pin: string) => KidProfile | null; 

  startOrGoToChat: (otherParticipantId: string, otherParticipantRole: UserRole, otherParticipantName: string, otherParticipantAvatar?: string) => string; 
  sendChatMessage: (conversationId: string, text: string) => void;
  markConversationAsRead: (conversationId: string) => void;

  updateTeacherVerificationStatus: (teacherId: string, newStatus: 'Verified' | 'Rejected') => Promise<void>;
  updateCourseStatus: (courseId: string, newStatus: ActivityStatus.Active | ActivityStatus.Rejected) => Promise<void>;
  updateActivityStatus: (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected) => Promise<void>;

}>({
  appState: initialAppState,
  setAppState: () => {},
  kidProfile: null,
  setKidProfile: () => {},
  parentalControls: null,
  setParentalControls: () => {},
  teacherProfile: null,
  setTeacherProfile: () => {},
  adminProfile: null, 
  setAdminProfile: () => {}, 
  allTeacherProfiles: [], // Initialize empty, will be fetched
  setAllTeacherProfiles: () => {},
  kidProgress: null,
  setKidProgress: () => {},
  kidCourseProgressMap: {},
  setKidCourseProgressMap: () => {},
  allActivities: [], // Initialize empty, will be fetched
  setAllActivities: () => {}, 
  allCourses: [], // Initialize empty, will be fetched
  setAllCourses: () => {}, 
  allReviews: [], // Initialize empty, can be built from fetched data
  addReview: () => {},
  setViewWithPath: () => {},
  goBack: () => {},
  hasOnboardedKid: false,
  setHasOnboardedKid: () => {},
  logout: () => {},
  switchToParentView: () => {},
  currentView: View.Splash,
  enrollInCourse: async () => false,
  updateLessonProgress: () => {},
  addKidProfileToParent: () => null,
  updateKidProfileAndControls: () => {},
  switchViewToKidAsParent: () => {},
  submitTeacherVerification: async () => false,
  loginKidWithPin: () => null, 
  startOrGoToChat: () => '',
  sendChatMessage: () => {},
  markConversationAsRead: () => {},
  updateTeacherVerificationStatus: async () => {},
  updateCourseStatus: async () => {},
  updateActivityStatus: async () => {},
});


const AppContent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('appState_v8_fullstack'); // Updated key
    return savedState ? JSON.parse(savedState) : initialAppState;
  });

  const [kidProfile, setKidProfile] = useState<KidProfile | null>(null);
  const [parentalControls, setParentalControls] = useState<ParentalControls | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null); 
  const [kidProgress, setKidProgress] = useState<KidProgress | null>(null);
  const [kidCourseProgressMap, setKidCourseProgressMap] = useState<Record<string, KidCourseProgress>>({});
  const [hasOnboardedKid, setHasOnboardedKid] = useState(false); 
  
  const [allActivities, setAllActivities] = useState<Activity[]>([]); 
  const [allCourses, setAllCourses] = useState<Course[]>([]); 
  const [allTeacherProfiles, setAllTeacherProfiles] = useState<TeacherProfile[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);


  const navigate = useNavigate();
  const location = useLocation();

  const currentView = useMemo(() => {
    const path = location.pathname.toLowerCase().substring(1);
    const viewKeyFromPath = path.split('/')[0];

    // Object.keys(View) returns string keys. For numeric enums, this includes both
    // the string names (e.g., "Splash") and string representations of numbers (e.g., "0").
    // We are interested in the string names.
    const viewNameFound = Object.keys(View).find(key => {
        // `key` is a string here. It could be "Splash" or "0".
        // If `key` is an enum name (like "Splash"), then `View[key]` will be its numeric value.
        // If `key` is a string representation of a number (like "0"), then `View[key]` will be the enum name.
        // We want to match `viewKeyFromPath` (e.g., "splash") with the enum's string name.
        const enumValue = (View as any)[key];
        if (typeof enumValue === 'number') { // This implies `key` is a string name of the enum member
            return key.toLowerCase() === viewKeyFromPath;
        }
        return false;
    });
    return viewNameFound ? (View as any)[viewNameFound] : View.Splash;
  }, [location.pathname]);

  // Load initial data from backend
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingInitialData(true);
      try {
        const [teachers, courses, activities] = await Promise.all([
          apiService.fetchTeachers(),
          apiService.fetchCourses(),
          apiService.fetchActivities(),
        ]);
        setAllTeacherProfiles(teachers);
        setAllCourses(courses);
        setAllActivities(activities);
        
        const initialReviews = teachers.flatMap(t => t.reviews || [])
          .concat(courses.flatMap(c => teachers.find(t=>t.id === c.teacherId)?.reviews?.filter(r => r.courseId === c.id) || []))
          .filter((review, index, self) => index === self.findIndex(r => r.id === review.id));
        setAllReviews(initialReviews);
      } catch (error) {
        console.error("Failed to load initial data from backend:", error);
      } finally {
        setIsLoadingInitialData(false);
      }
    };
    loadData();
  }, []);


  useEffect(() => {
    localStorage.setItem('appState_v8_fullstack', JSON.stringify(appState));
  }, [appState]);

  useEffect(() => { 
    if (appState.currentKidProfileId) {
        const activeKid = appState.kidProfiles.find(kp => kp.id === appState.currentKidProfileId);
        if (activeKid) {
            setKidProfile(activeKid);
            setParentalControls(appState.parentalControlsMap[activeKid.id] || {...DEFAULT_PARENTAL_CONTROLS, kidId: activeKid.id});
            setHasOnboardedKid(!!activeKid.avatar); 
            
            setKidProgress({
                kidId: activeKid.id, level: activeKid.level || 1, xp: (activeKid.level || 1) * 20, badgesEarned: activeKid.badges || [],
                skillsMastered: {}, activitiesCompleted: {} 
            });
            const courseProgress: Record<string, KidCourseProgress> = {};
            (activeKid.enrolledCourseIds || []).forEach(courseId => {
                courseProgress[`${activeKid.id}_${courseId}`] = {
                    kidId: activeKid.id, courseId, completedLessonIds: [], currentLessonIndex: 0,
                };
            });
            setKidCourseProgressMap(courseProgress);
        } else { 
            setKidProfile(null);
            setParentalControls(null);
            setHasOnboardedKid(false);
            if(appState.currentUserRole === UserRole.Kid) { 
                if(appState.currentParentProfileId){
                    setAppState(prev => ({...prev, currentUserRole: UserRole.Parent, currentKidProfileId: null}));
                } else {
                     setAppState(prev => ({...prev, currentUserRole: null, currentKidProfileId: null}));
                }
            }
        }
    } else {
        setKidProfile(null);
        setParentalControls(null);
        setHasOnboardedKid(false);
    }
  }, [appState.currentKidProfileId, appState.kidProfiles, appState.parentalControlsMap, appState.currentUserRole, appState.currentParentProfileId]);

  useEffect(() => { 
    if (appState.currentTeacherProfileId) {
        const activeTeacher = allTeacherProfiles.find(tp => tp.id === appState.currentTeacherProfileId);
        setTeacherProfile(activeTeacher || null);
    } else {
        setTeacherProfile(null);
    }
  }, [appState.currentTeacherProfileId, allTeacherProfiles]);

  useEffect(() => { 
    if (appState.currentAdminProfileId) {
        setAdminProfile(appState.adminProfile); 
    } else {
        setAdminProfile(null);
    }
  }, [appState.currentAdminProfileId, appState.adminProfile]);


  const setViewWithPath = useCallback((view: View, path?: string, options?: { replace?: boolean; state?: any }) => {
    const targetPath = path || `/${View[view].toString().toLowerCase()}`;
    if (location.pathname.toLowerCase() !== targetPath.toLowerCase() || JSON.stringify(location.state) !== JSON.stringify(options?.state)) {
      navigate(targetPath, { replace: options?.replace, state: options?.state });
    }
  }, [navigate, location.pathname, location.state]);

  const validKidViews: View[] = useMemo(() => [ 
        View.KidHome, View.CategoryActivitiesScreen, View.DrawAndTell, View.WhyZone, View.EmotionalLearning, 
        View.KidAchievements, View.KidLearningPathView, View.LiveClassPlaceholderView, 
        View.ShapePuzzleScreen, View.JigsawPuzzleScreen, View.TraceAnimalScreen, 
        View.ColorByNumberScreen, View.FairytaleReaderScreen, View.CountingGameScreen, 
        View.SimpleExperimentsScreen, View.LetterSoundsScreen, View.SpotTheDifferenceScreen, 
        View.MemoryMatchScreen, View.FreeDrawScreen, View.ActivityPlaceholder, View.AppInfo,
        View.Settings, View.ChatListScreen, View.ChatRoomScreen
    ], []);
  
  const validAdminViews: View[] = useMemo(() => [
    View.AdminDashboard, View.AdminTeacherVerificationApproval, View.AdminContentModeration, View.AdminUserManagement, View.Settings
  ], []);


  useEffect(() => { 
    if (isLoadingInitialData) return; 

    const currentPath = location.pathname.toLowerCase();
    if (currentPath === '/' || currentPath === '/splash') {
      setViewWithPath(View.Splash, '/splash', {replace: true});
      return;
    }

    if (!appState.currentUserRole && ![View.RoleSelection, View.Login, View.Splash].includes(currentView)) {
      setViewWithPath(View.RoleSelection, '/roleselection', { replace: true });
      return;
    }
    if (appState.currentUserRole === UserRole.Kid) {
      if (!appState.currentKidProfileId) { 
        if (appState.currentParentProfileId) { 
            setAppState(prev => ({...prev, currentUserRole: UserRole.Parent, currentKidProfileId: null}));
        } else { 
            setAppState(prev => ({...prev, currentUserRole: null})); 
        }
        return;
      }
      if (!kidProfile && appState.currentKidProfileId) return; 
      if (!validKidViews.includes(currentView)) { 
        setViewWithPath(View.KidHome, '/kidhome', { replace: true });
      }
    } else if (appState.currentUserRole === UserRole.Parent) {
      if (!appState.currentParentProfileId && ![View.Login, View.ParentSetup, View.RoleSelection, View.Splash].includes(currentView)) {
        setViewWithPath(View.Login, '/login?role=Parent', { replace: true });
        return;
      }
      if (appState.currentParentProfileId && currentView === View.Login) {
          setViewWithPath(View.ParentPostLoginSelection, '/parentpostloginselection', {replace: true});
          return;
      }
      const parentHasKids = appState.kidProfiles.some(kp => kp.parentId === appState.currentParentProfileId);
      if (appState.currentParentProfileId && !parentHasKids && 
          ![View.ParentSetup, View.ParentAddKid, View.RoleSelection, View.Login, View.Splash, View.Settings, View.ParentSubscriptionScreen, View.ChatListScreen, View.ChatRoomScreen].includes(currentView)) { 
          setViewWithPath(View.ParentSetup, '/parentsetup', {replace: true}); 
          return;
      }
      if (appState.currentParentProfileId && validKidViews.includes(currentView) && ![View.Settings, View.ChatListScreen, View.ChatRoomScreen].includes(currentView)) { 
         setViewWithPath(View.ParentPostLoginSelection, '/parentpostloginselection', {replace: true});
      }
    } else if (appState.currentUserRole === UserRole.Teacher) {
      if (!teacherProfile && appState.currentTeacherProfileId && allTeacherProfiles.length > 0) {
        const foundTeacher = allTeacherProfiles.find(tp => tp.id === appState.currentTeacherProfileId);
        if (foundTeacher) setTeacherProfile(foundTeacher);
        else { 
           setAppState(prev => ({...prev, currentTeacherProfileId: null, currentUserRole: null}));
        }
        return; 
      }
      if (!appState.currentTeacherProfileId && ![View.Login, View.RoleSelection, View.Splash].includes(currentView)) {
        setViewWithPath(View.Login, '/login?role=Teacher', { replace: true });
        return;
      }
      if (teacherProfile && currentView === View.Login) { 
          setViewWithPath(View.TeacherDashboard, '/teacherdashboard', {replace: true});
          return;
      }
    } else if (appState.currentUserRole === UserRole.Admin) { 
      if (!adminProfile && appState.currentAdminProfileId) return;
      if (!appState.currentAdminProfileId && ![View.Login, View.RoleSelection, View.Splash].includes(currentView)) {
        setViewWithPath(View.Login, '/login?role=Admin', { replace: true });
        return;
      }
      if (adminProfile && currentView === View.Login) {
        setViewWithPath(View.AdminDashboard, '/admindashboard', { replace: true });
        return;
      }
      if (adminProfile && !validAdminViews.includes(currentView)) {
        setViewWithPath(View.AdminDashboard, '/admindashboard', { replace: true });
      }
    }
  }, [isLoadingInitialData, appState.currentUserRole, appState.currentKidProfileId, appState.currentParentProfileId, appState.currentTeacherProfileId, appState.currentAdminProfileId, kidProfile, teacherProfile, adminProfile, currentView, setViewWithPath, location.pathname, validKidViews, validAdminViews, appState.kidProfiles, allTeacherProfiles]);


  const switchToParentView = () => {
    if (appState.currentParentProfileId) { 
        setAppState(prev => ({
            ...prev,
            currentUserRole: UserRole.Parent,
            currentKidProfileId: null, 
        }));
    } else {
        logout(); 
    }
  };

  const logout = () => {
    if (appState.currentUserRole === UserRole.Kid && appState.currentParentProfileId) {
        switchToParentView();
    } else { 
        localStorage.removeItem('appState_v8_fullstack'); 
        setAppState(initialAppState); 
        setAllTeacherProfiles([]);
        setAllCourses([]);
        setAllActivities([]);
        setAllReviews([]);
        setIsLoadingInitialData(true); // Force re-fetch on next "login"
        setViewWithPath(View.Splash, '/splash', { replace: true });
    }
  };

  const enrollInCourse = async (kidId: string, courseId: string): Promise<boolean> => {
    setAppState(prev => ({
        ...prev,
        kidProfiles: prev.kidProfiles.map(kp => kp.id === kidId ? {...kp, enrolledCourseIds: [...(kp.enrolledCourseIds || []), courseId].filter((id,idx,self) => self.indexOf(id) === idx)} : kp)
    }));
    // TODO: API call to enroll kid in course
    return true; 
  };

  const updateLessonProgress = (kidId: string, courseId: string, lessonId: string) => {
    setKidCourseProgressMap(prev => {
        const progressKey = `${kidId}_${courseId}`;
        const currentProgress = prev[progressKey];
        if (currentProgress && !currentProgress.completedLessonIds.includes(lessonId)) {
            const course = allCourses.find(c => c.id === courseId);
            const lessonIndex = course?.lessons.findIndex(l => l.id === lessonId);
            
            return {
                ...prev,
                [progressKey]: {
                    ...currentProgress,
                    completedLessonIds: [...currentProgress.completedLessonIds, lessonId],
                    currentLessonIndex: (lessonIndex !== undefined && lessonIndex + 1 < (course?.lessons.length || 0)) ? lessonIndex + 1 : currentProgress.currentLessonIndex,
                }
            };
        }
        return prev;
    });
    setKidProgress(prev => prev ? ({...prev, xp: (prev.xp || 0) + 10 }) : null); 
    // TODO: API call to update lesson progress
  };

  const addReview = (review: Review) => {
    setAllReviews(prev => [...prev, review].filter((r, index, self) => index === self.findIndex(rev => rev.id === r.id)));
    // TODO: API call to add review
    // Note: Updating teacher/course average rating should ideally be backend logic post-review submission.
  };

  const addKidProfileToParent = (newKidData: Omit<KidProfile, 'id' | 'parentId' | 'avatar'>, controlsData: Omit<ParentalControls, 'kidId'>): KidProfile | null => {
    if (!appState.currentParentProfileId) {
        console.error("No parent logged in to add kid to.");
        return null;
    }
    const kidId = `kid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newKid: KidProfile = {
        ...DEFAULT_KID_PROFILE, 
        ...newKidData,          
        id: kidId,
        parentId: appState.currentParentProfileId,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], 
        level: 1,
        badges: [],
        enrolledCourseIds: [],
    };
    const newControls: ParentalControls = {
        ...DEFAULT_PARENTAL_CONTROLS, 
        ...controlsData, 
        kidId: kidId,
    };

    setAppState(prev => ({
        ...prev,
        kidProfiles: [...prev.kidProfiles, newKid],
        parentalControlsMap: {
            ...prev.parentalControlsMap,
            [kidId]: newControls,
        }
    }));
    // TODO: API call to save new kid profile
    return newKid;
  };

  const updateKidProfileAndControls = (updatedKid: KidProfile, updatedControls: ParentalControls) => {
     setAppState(prev => ({
        ...prev,
        kidProfiles: prev.kidProfiles.map(kp => kp.id === updatedKid.id ? updatedKid : kp),
        parentalControlsMap: {
            ...prev.parentalControlsMap,
            [updatedKid.id]: updatedControls,
        }
    }));
    // TODO: API call to update kid profile and controls
  };
  
  const switchViewToKidAsParent = (kidId: string) => {
    const kidToView = appState.kidProfiles.find(kp => kp.id === kidId && kp.parentId === appState.currentParentProfileId);
    if (kidToView) {
        setAppState(prev => ({
            ...prev,
            currentUserRole: UserRole.Kid,
            currentKidProfileId: kidId,
        }));
    } else {
        alert("Could not switch to kid's view.");
    }
  };

  const submitTeacherVerification = async (teacherId: string, documentsData: any): Promise<boolean> => {
    try {
      const updatedTeacher = await apiService.submitTeacherVerificationApplication(teacherId, documentsData);
      if (updatedTeacher) {
          setAllTeacherProfiles(prev => prev.map(tp => 
              tp.id === teacherId ? updatedTeacher : tp
          ));
          setTeacherProfile(updatedTeacher); // Also update current teacher profile if it's the one being verified
          return true;
      }
      return false; 
    } catch (error) {
      console.error("Error submitting teacher verification:", error);
      alert(`Error: ${(error as Error).message}`);
      return false;
    }
  };

  const loginKidWithPin = (pin: string): KidProfile | null => {
    return null; 
  };

  const startOrGoToChat = (otherParticipantId: string, otherParticipantRole: UserRole, otherParticipantName: string, otherParticipantAvatar?: string): string => {
    const currentUserId = appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId;
    if (!currentUserId) return '';

    const sortedParticipantIds = [currentUserId, otherParticipantId].sort();
    let conversation = appState.chatConversations.find(
        c => c.participantIds.length === 2 && 
             c.participantIds.includes(currentUserId) && 
             c.participantIds.includes(otherParticipantId)
    );

    if (!conversation) {
        const currentUserParticipant: ChatParticipant = {
            id: currentUserId,
            name: appState.currentUserRole === UserRole.Parent ? "You (Parent)" : (teacherProfile?.name || "You (Teacher)"),
            avatarUrl: appState.currentUserRole === UserRole.Parent ? 'https://picsum.photos/seed/currentparent/50/50' : teacherProfile?.avatarUrl,
            role: appState.currentUserRole!
        };
        const otherParticipantData: ChatParticipant = {
            id: otherParticipantId,
            name: otherParticipantName,
            avatarUrl: otherParticipantAvatar,
            role: otherParticipantRole
        };

        conversation = {
            id: `convo_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
            participantIds: sortedParticipantIds,
            participants: [currentUserParticipant, otherParticipantData].sort((a,b) => a.id.localeCompare(b.id)), 
            unreadCount: { [currentUserId]: 0, [otherParticipantId]: 0 }
        };
        setAppState(prev => ({ ...prev, chatConversations: [...prev.chatConversations, conversation!] }));
    }
    // TODO: API call to create/get conversation
    return conversation.id;
  };

  const sendChatMessage = (conversationId: string, text: string) => {
    const senderId = appState.currentUserRole === UserRole.Parent 
        ? appState.currentParentProfileId 
        : (appState.currentUserRole === UserRole.Teacher ? appState.currentTeacherProfileId : null);
    if (!senderId) return;

    const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId,
        text,
        timestamp: Date.now(),
        isRead: false,
    };
    setAppState(prev => {
        const updatedConversations = prev.chatConversations.map(convo => {
            if (convo.id === conversationId) {
                const otherParticipantId = convo.participantIds.find(id => id !== senderId);
                return {
                    ...convo,
                    lastMessageText: text,
                    lastMessageTimestamp: newMessage.timestamp,
                    unreadCount: {
                        ...(convo.unreadCount || {}),
                        ...(otherParticipantId && { [otherParticipantId]: (convo.unreadCount?.[otherParticipantId] || 0) + 1 })
                    }
                };
            }
            return convo;
        });
        return {
            ...prev,
            chatMessages: [...prev.chatMessages, newMessage],
            chatConversations: updatedConversations,
        };
    });
    // TODO: API call to send chat message
  };

  const markConversationAsRead = (conversationId: string) => {
    const currentUserId = appState.currentUserRole === UserRole.Parent 
        ? appState.currentParentProfileId 
        : (appState.currentUserRole === UserRole.Teacher ? appState.currentTeacherProfileId : null);
    if (!currentUserId) return;
    
    setAppState(prev => ({
        ...prev,
        chatConversations: prev.chatConversations.map(convo => {
            if (convo.id === conversationId && convo.unreadCount) {
                return { ...convo, unreadCount: { ...convo.unreadCount, [currentUserId]: 0 } };
            }
            return convo;
        })
    }));
    // TODO: API call to mark conversation as read
  };

  const updateTeacherVerificationStatus = async (teacherId: string, newStatus: 'Verified' | 'Rejected') => {
    try {
      const updatedTeacher = await apiService.updateTeacherVerification(teacherId, newStatus);
      setAllTeacherProfiles(prev => prev.map(t => t.id === teacherId ? updatedTeacher : t));
    } catch (error) {
      console.error("Failed to update teacher verification:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const updateCourseStatus = async (courseId: string, newStatus: ActivityStatus.Active | ActivityStatus.Rejected) => {
     try {
      const updatedCourse = await apiService.updateCourseStatus(courseId, newStatus);
      setAllCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
    } catch (error) {
      console.error("Failed to update course status:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const updateActivityStatus = async (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected) => {
    try {
      const updatedActivity = await apiService.updateActivityStatus(activityId, newStatus);
      setAllActivities(prev => prev.map(a => a.id === activityId ? updatedActivity : a));
    } catch (error) {
      console.error("Failed to update activity status:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };


  const contextValue = {
    appState, setAppState,
    kidProfile, setKidProfile,
    parentalControls, setParentalControls,
    teacherProfile, setTeacherProfile,
    adminProfile, setAdminProfile, 
    allTeacherProfiles, setAllTeacherProfiles, 
    kidProgress, setKidProgress,
    kidCourseProgressMap, setKidCourseProgressMap,
    allActivities, setAllActivities, 
    allCourses, setAllCourses, 
    allReviews, addReview,
    setViewWithPath, goBack: () => navigate(-1),
    hasOnboardedKid, setHasOnboardedKid,
    logout, switchToParentView,
    currentView,
    enrollInCourse, updateLessonProgress,
    addKidProfileToParent, updateKidProfileAndControls, switchViewToKidAsParent,
    submitTeacherVerification,
    loginKidWithPin, 
    startOrGoToChat, sendChatMessage, markConversationAsRead,
    updateTeacherVerificationStatus, updateCourseStatus, updateActivityStatus,
  };

  if (isLoadingInitialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
        <LoadingSpinner text="Loading BrightFox..." size="lg" />
      </div>
    );
  }

  const showHeader = ![View.Splash].includes(currentView);
  const showNav = appState.currentUserRole && 
                  ![View.Splash, View.Login, View.RoleSelection, View.AgeSelection, 
                    View.ParentSetup, View.KidAvatarSelection, View.ParentPostLoginSelection
                  ].includes(currentView);

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`flex flex-col h-full ${showHeader ? 'pt-16' : ''} ${showNav ? 'pb-14 sm:pb-16' : ''}`}>
        {showHeader && <Header />}
        <main className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/roleselection" element={<RoleSelectionScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/kidlogin" element={<KidLoginScreen />} /> 


            <Route path="/ageselection" element={<AgeSelectionScreen />} />
            <Route path="/parentsetup" element={<ParentSetupScreen />} />
            <Route path="/kidavatarselection" element={<KidAvatarSelectionScreen />} />
            <Route path="/kidhome" element={<KidHomeScreen />} />
            <Route path="/categoryactivities/:categoryId" element={<CategoryActivitiesScreen />} /> 
            
            <Route path="/drawandtell" element={<DrawAndTellScreen />} />
            <Route path="/whyzone" element={<WhyZoneScreen />} />
            <Route path="/emotionallearning" element={<EmotionalLearningScreen />} />

            <Route path="/shapepuzzlescreen" element={<ShapePuzzleScreen />} />
            <Route path="/jigsawpuzzlescreen" element={<JigsawPuzzleScreen />} />
            <Route path="/traceanimalscreen" element={<TraceAnimalScreen />} />
            <Route path="/colorbynumberscreen" element={<ColorByNumberScreen />} />
            <Route path="/fairytalereaderscreen" element={<FairytaleReaderScreen />} />
            <Route path="/countinggamescreen" element={<CountingGameScreen />} />
            <Route path="/simpleexperimentsscreen" element={<SimpleExperimentsScreen />} />
            <Route path="/lettersoundsscreen" element={<LetterSoundsScreenPlaceholder />} />
            <Route path="/spotthedifferencescreen" element={<SpotTheDifferenceScreenPlaceholder />} />
            <Route path="/memorymatchscreen" element={<MemoryMatchScreenPlaceholder />} />
            <Route path="/freedrawscreen" element={<FreeDrawScreenPlaceholder />} />
            
            <Route path="/activityplaceholder" element={<ActivityPlaceholderScreen activityName="Activity"/>} />


            <Route path="/kidachievements" element={<MyAchievementsScreen />} />
            <Route path="/kidlearningpathview" element={<KidLearningPathScreen />} />
            <Route path="/liveclassplaceholderview" element={<LiveClassPlaceholderScreen />} />

            <Route path="/parentdashboard" element={<ParentDashboardScreen />} />
            <Route path="/parentpostloginselection" element={<ParentPostLoginSelectionScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/compareprogress" element={<CompareProgressScreen />} />
            <Route path="/parentcoursediscoveryview" element={<ParentCourseDiscoveryScreen />} />
            <Route path="/coursedetailview/:courseId" element={<CourseDetailScreen />} />
            <Route path="/teacherprofileview/:teacherId" element={<TeacherProfileViewScreen />} />
            <Route path="/parentaddkid" element={<ParentAddKidScreen />} />
            <Route path="/parentmanagekiddetail/:kidId" element={<ParentManageKidDetailScreen />} />
            <Route path="/parentsubscription" element={<ParentSubscriptionScreen />} />

            <Route path="/chatlistscreen" element={<ChatListScreen />} />
            <Route path="/chatroomscreen/:conversationId" element={<ChatRoomScreen />} />


            <Route path="/teacherdashboard" element={<TeacherDashboardScreen />} />
            <Route path="/activitybuilder" element={<ActivityBuilderScreen />} />
            <Route path="/activitybuilder/:courseId" element={<ActivityBuilderScreen />} /> 
            <Route path="/teachercontentmanagement" element={<TeacherContentManagementScreen />} /> 
            <Route path="/teacherearnings" element={<TeacherEarningsScreen />} />
            <Route path="/teacherverificationview" element={<TeacherVerificationScreen />} />

            <Route path="/admindashboard" element={<AdminDashboardScreen />} />
            <Route path="/adminteacherverificationapproval" element={<AdminTeacherVerificationApprovalScreen />} />
            <Route path="/admincontentmoderation" element={<AdminContentModerationScreen />} />
            <Route path="/adminusermanagement" element={<AdminUserManagementScreen />} />
            

            <Route path="/appinfo" element={<AppInfoScreen />} />
            <Route path="*" element={<Navigate to="/splash" replace />} />
          </Routes>
        </main>
        {showNav && <NavigationBottom />}
      </div>
    </AppContext.Provider>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
