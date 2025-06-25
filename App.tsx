
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar, LogBox } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset'; // For image preloading

// Import shared types and constants
import { AppViewEnum, KidProfile, ParentalControls, TeacherProfile, UserRole, AppState, Activity, KidProgress, Course, Review, KidCourseProgress, ChatConversation, ChatMessage, ChatParticipant, AdminProfile, ActivityStatus } from './src/types';
import { DEFAULT_KID_PROFILE, DEFAULT_PARENTAL_CONTROLS, DEFAULT_TEACHER_PROFILE, AVATARS, APP_NAME, MOCK_CHAT_CONVERSATIONS, MOCK_CHAT_MESSAGES, DEFAULT_ADMIN_PROFILE } from './src/constants'; // Ensure API_KEY constants are handled correctly for RN
import * as apiService from './src/services/apiService';

// Import Screens (adjust paths as per your RN project structure)
import SplashScreen from './src/pages/SplashScreen';
import RoleSelectionScreen from './pages/RoleSelectionScreen';
import LoginScreen from './pages/LoginScreen';
// KidLoginScreen might be deprecated or re-thought for mobile UX
// import KidLoginScreen from './pages/KidLoginScreen'; 

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

import ChatListScreen from './pages/chat/ChatListScreen';
import ChatRoomScreen from './pages/chat/ChatRoomScreen';

import AdminDashboardScreen from './pages/admin/AdminDashboardScreen';
import AdminTeacherVerificationApprovalScreen from './pages/admin/AdminTeacherVerificationApprovalScreen';
import AdminContentModerationScreen from './pages/admin/AdminContentModerationScreen';
import AdminUserManagementScreen from './pages/admin/AdminUserManagementScreen';

import DrawAndTellScreen from './pages/DrawAndTellScreen';
import WhyZoneScreen from './pages/WhyZoneScreen';
import EmotionalLearningScreen from './pages/EmotionalLearningScreen';
import AppInfoScreen from './pages/AppInfoScreen';
import ActivityPlaceholderScreen from './pages/ActivityPlaceholderScreen';

// Default Activity Screens (placeholders for now)
import ShapePuzzleScreen from './pages/activities/ShapePuzzleScreen';
import JigsawPuzzleScreen from './pages/activities/JigsawPuzzleScreen';
import TraceAnimalScreen from './pages/activities/TraceAnimalScreen';
import ColorByNumberScreen from './pages/activities/ColorByNumberScreen';
import FairytaleReaderScreen from './pages/activities/FairytaleReaderScreen';
import CountingGameScreen from './pages/activities/CountingGameScreen';
import SimpleExperimentsScreen from './pages/activities/SimpleExperimentsScreen';

// RN specific components
import RNHeader from './components/Header'; 
import RNNavigationBottom from './components/NavigationBottom';
import LoadingSpinner from './components/LoadingSpinner';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']); // Example: Ignore specific logs

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const initialAppState: AppState = {
  currentUserRole: null,
  currentKidProfileId: null,
  currentParentProfileId: null,
  currentTeacherProfileId: null,
  currentAdminProfileId: null,
  adminProfile: null,
  kidProfiles: [],
  parentalControlsMap: {},
  chatConversations: MOCK_CHAT_CONVERSATIONS, // Consider fetching or local storing
  chatMessages: MOCK_CHAT_MESSAGES, // Consider fetching or local storing
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
  
  setViewWithPath: (view: AppViewEnum, path?: string, options?: { replace?: boolean; state?: any }) => void;
  goBack: () => void;
  
  hasOnboardedKid: boolean; 
  setHasOnboardedKid: React.Dispatch<React.SetStateAction<boolean>>;
  
  logout: () => void;
  switchToParentView: () => void; 
  currentView: AppViewEnum; 
  
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

} | null>(null);


const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F0F4F8', // Match body style from web
  },
};

// Font loading function
async function loadAssetsAsync() {
  await Font.loadAsync({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Baloo2-Regular': require('./assets/fonts/Baloo2-Regular.ttf'),
    'Baloo2-Medium': require('./assets/fonts/Baloo2-Medium.ttf'),
    'Baloo2-SemiBold': require('./assets/fonts/Baloo2-SemiBold.ttf'),
    'Baloo2-Bold': require('./assets/fonts/Baloo2-Bold.ttf'),
    'FredokaOne-Regular': require('./assets/fonts/FredokaOne-Regular.ttf'),
    'ComicNeue-Bold': require('./assets/fonts/ComicNeue-Bold.ttf'),
  });
}


function KidStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KidHome" component={KidHomeScreen} />
      <Stack.Screen name="CategoryActivitiesScreen" component={CategoryActivitiesScreen} />
      <Stack.Screen name="DrawAndTell" component={DrawAndTellScreen} />
      <Stack.Screen name="WhyZone" component={WhyZoneScreen} />
      <Stack.Screen name="EmotionalLearning" component={EmotionalLearningScreen} />
      <Stack.Screen name="KidAchievements" component={MyAchievementsScreen} />
      <Stack.Screen name="KidLearningPathView" component={KidLearningPathScreen} />
      <Stack.Screen name="LiveClassPlaceholderView" component={LiveClassPlaceholderScreen} />
      
      <Stack.Screen name="ShapePuzzleScreen" component={ShapePuzzleScreen} />
      <Stack.Screen name="JigsawPuzzleScreen" component={JigsawPuzzleScreen} />
      <Stack.Screen name="TraceAnimalScreen" component={TraceAnimalScreen} />
      <Stack.Screen name="ColorByNumberScreen" component={ColorByNumberScreen} />
      <Stack.Screen name="FairytaleReaderScreen" component={FairytaleReaderScreen} />
      <Stack.Screen name="CountingGameScreen" component={CountingGameScreen} />
      <Stack.Screen name="SimpleExperimentsScreen" component={SimpleExperimentsScreen} />
      {/* <Stack.Screen name="LetterSoundsScreen" component={LetterSoundsScreenPlaceholder} /> */}
      {/* <Stack.Screen name="SpotTheDifferenceScreen" component={SpotTheDifferenceScreenPlaceholder} /> */}
      {/* <Stack.Screen name="MemoryMatchScreen" component={MemoryMatchScreenPlaceholder} /> */}
      {/* <Stack.Screen name="FreeDrawScreen" component={FreeDrawScreenPlaceholder} /> */}
      <Stack.Screen name="ActivityPlaceholder" component={ActivityPlaceholderScreen} />
      <Stack.Screen name="AppInfo" component={AppInfoScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
}

function ParentStack() {
   return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
      <Stack.Screen name="ParentCourseDiscoveryView" component={ParentCourseDiscoveryScreen} />
      <Stack.Screen name="CourseDetailView" component={CourseDetailScreen} />
      <Stack.Screen name="TeacherProfileView" component={TeacherProfileViewScreen} />
      <Stack.Screen name="ParentAddKid" component={ParentAddKidScreen} />
      <Stack.Screen name="ParentManageKidDetail" component={ParentManageKidDetailScreen} />
      <Stack.Screen name="ParentSubscriptionScreen" component={ParentSubscriptionScreen} />
      <Stack.Screen name="CompareProgress" component={CompareProgressScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
      <Stack.Screen name="KidAvatarSelection" component={KidAvatarSelectionScreen} />
    </Stack.Navigator>
  );
}

function TeacherStack() {
   return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
      <Stack.Screen name="ActivityBuilder" component={ActivityBuilderScreen} />
      <Stack.Screen name="TeacherContentManagement" component={TeacherContentManagementScreen} />
      <Stack.Screen name="TeacherEarnings" component={TeacherEarningsScreen} />
      <Stack.Screen name="TeacherVerificationView" component={TeacherVerificationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
      <Stack.Screen name="TeacherProfileView" component={TeacherProfileViewScreen} />
    </Stack.Navigator>
  );
}
function AdminStack() {
   return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminTeacherVerificationApproval" component={AdminTeacherVerificationApprovalScreen} />
      <Stack.Screen name="AdminContentModeration" component={AdminContentModerationScreen} />
      <Stack.Screen name="AdminUserManagement" component={AdminUserManagementScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}


function AppContent() {
  const [appState, setAppState] = useState<AppState>(initialAppState);
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
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [isInitialApiDataLoading, setIsInitialApiDataLoading] = useState(true);

  const [currentViewEnum, setCurrentViewEnum] = useState<AppViewEnum>(AppViewEnum.Splash); // For context
  const navigationRef = React.useRef<any>(null); // For setViewWithPath

  // Load initial data from API
  useEffect(() => {
    const loadApiData = async () => {
      setIsInitialApiDataLoading(true);
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
        console.error("Failed to load initial API data:", error);
      } finally {
        setIsInitialApiDataLoading(false);
      }
    };
    loadApiData();
  }, []);

  // Load app state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('appState_v8_rn_fullstack');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setAppState({ ...initialAppState, ...parsedState });
        }
      } catch (e) {
        console.error("Failed to load app state.", e);
      } finally {
        setIsStoreLoading(false);
      }
    };
    loadState();
  }, []);

  // Save app state to AsyncStorage
  useEffect(() => {
    if (!isStoreLoading) { 
      AsyncStorage.setItem('appState_v8_rn_fullstack', JSON.stringify(appState)).catch(e => console.error("Failed to save app state.", e));
    }
  }, [appState, isStoreLoading]);


  useEffect(() => { 
    if (appState.currentKidProfileId) {
        const activeKid = appState.kidProfiles.find(kp => kp.id === appState.currentKidProfileId);
        if (activeKid) {
            setKidProfile(activeKid);
            setParentalControls(appState.parentalControlsMap[activeKid.id] || {...DEFAULT_PARENTAL_CONTROLS, kidId: activeKid.id});
            setHasOnboardedKid(!!activeKid.avatar && !!activeKid.ageGroup); 
            setKidProgress({ kidId: activeKid.id, level: activeKid.level || 1, xp: (activeKid.level || 1) * 20, badgesEarned: activeKid.badges || [], skillsMastered: {}, activitiesCompleted: {} });
            const courseProgress: Record<string, KidCourseProgress> = {};
            (activeKid.enrolledCourseIds || []).forEach(courseId => { courseProgress[`${activeKid.id}_${courseId}`] = { kidId: activeKid.id, courseId, completedLessonIds: [], currentLessonIndex: 0, }; });
            setKidCourseProgressMap(courseProgress);
        } else { 
            setKidProfile(null); setParentalControls(null); setHasOnboardedKid(false);
            if(appState.currentUserRole === UserRole.Kid) { 
                 setAppState(prev => ({...prev, currentUserRole: prev.currentParentProfileId ? UserRole.Parent : null, currentKidProfileId: null}));
            }
        }
    } else {
        setKidProfile(null); setParentalControls(null); setHasOnboardedKid(false);
    }
  }, [appState.currentKidProfileId, appState.kidProfiles, appState.parentalControlsMap, appState.currentUserRole, appState.currentParentProfileId]);

  useEffect(() => { 
    if (appState.currentTeacherProfileId && allTeacherProfiles.length > 0) {
        setTeacherProfile(allTeacherProfiles.find(tp => tp.id === appState.currentTeacherProfileId) || null);
    } else if (appState.currentTeacherProfileId && allTeacherProfiles.length === 0 && !isInitialApiDataLoading) {
        // If API data has loaded and profile is still not found, maybe clear it
        // This might happen if a teacher was deleted or data is inconsistent
        console.warn(`Teacher profile ${appState.currentTeacherProfileId} not found in fetched list. Clearing local teacher state.`);
        setTeacherProfile(null);
        // Optionally, clear currentTeacherProfileId from appState if this is a permanent inconsistency
        // setAppState(prev => ({ ...prev, currentTeacherProfileId: null, currentUserRole: null }));
    } else {
        setTeacherProfile(null);
    }
  }, [appState.currentTeacherProfileId, allTeacherProfiles, isInitialApiDataLoading]);

  useEffect(() => { 
    if (appState.currentAdminProfileId) setAdminProfile(appState.adminProfile);
    else setAdminProfile(null);
  }, [appState.currentAdminProfileId, appState.adminProfile]);

  const setViewWithPath = useCallback((viewEnum: AppViewEnum, path?: string, options?: { replace?: boolean; state?: any }) => {
    const viewName = AppViewEnum[viewEnum]; 
    if (navigationRef.current && viewName) {
      const action = options?.replace ? 'replace' : 'navigate';
      navigationRef.current[action](viewName, options?.state);
      setCurrentViewEnum(viewEnum);
    } else {
      console.warn("setViewWithPath: Navigation ref not ready or invalid view.", viewEnum, viewName);
    }
  }, []);

  const goBack = useCallback(() => {
    if (navigationRef.current?.canGoBack()) {
      navigationRef.current.goBack();
    }
  }, []);

  const logout = () => {
    if (appState.currentUserRole === UserRole.Kid && appState.currentParentProfileId) {
        setAppState(prev => ({ ...prev, currentUserRole: UserRole.Parent, currentKidProfileId: null }));
         setViewWithPath(AppViewEnum.ParentPostLoginSelection, 'ParentPostLoginSelection', { replace: true });
    } else { 
        AsyncStorage.removeItem('appState_v8_rn_fullstack'); 
        setAppState(initialAppState); 
        setAllTeacherProfiles([]); setAllCourses([]); setAllActivities([]); setAllReviews([]);
        setIsInitialApiDataLoading(true); 
        setViewWithPath(AppViewEnum.Splash, 'Splash', { replace: true });
    }
  };

  const submitTeacherVerification = async (teacherId: string, documentsData: any): Promise<boolean> => {
    try {
      const updatedTeacher = await apiService.submitTeacherVerificationApplication(teacherId, documentsData);
      setAllTeacherProfiles(prev => prev.map(tp => tp.id === teacherId ? updatedTeacher : tp));
      if (teacherProfile?.id === teacherId) setTeacherProfile(updatedTeacher);
      return true;
    } catch (error) { console.error(error); return false; }
  };
  
  const updateTeacherVerificationStatus = async (teacherId: string, newStatus: 'Verified' | 'Rejected') => {
    try {
      const updatedTeacher = await apiService.updateTeacherVerification(teacherId, newStatus);
      setAllTeacherProfiles(prev => prev.map(t => t.id === teacherId ? updatedTeacher : t));
      if (teacherProfile?.id === teacherId) setTeacherProfile(updatedTeacher);
    } catch (error) { console.error(error); }
  };

  const updateCourseStatus = async (courseId: string, newStatus: ActivityStatus.Active | ActivityStatus.Rejected) => {
     try {
      const updatedCourse = await apiService.updateCourseStatus(courseId, newStatus);
      setAllCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
    } catch (error) { console.error(error); }
  };

  const updateActivityStatus = async (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected) => {
    try {
      const updatedActivity = await apiService.updateActivityStatus(activityId, newStatus);
      setAllActivities(prev => prev.map(a => a.id === activityId ? updatedActivity : a));
    } catch (error) { console.error(error); }
  };
    const addKidProfileToParent = (newKidData: Omit<KidProfile, 'id' | 'parentId' | 'avatar'>, controlsData: Omit<ParentalControls, 'kidId'>): KidProfile | null => {
    if (!appState.currentParentProfileId) return null;
    const kidId = `kid_${Date.now()}`;
    const newKid: KidProfile = { ...DEFAULT_KID_PROFILE, ...newKidData, id: kidId, parentId: appState.currentParentProfileId, avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] };
    const newControls: ParentalControls = { ...DEFAULT_PARENTAL_CONTROLS, ...controlsData, kidId: kidId };
    setAppState(prev => ({ ...prev, kidProfiles: [...prev.kidProfiles, newKid], parentalControlsMap: { ...prev.parentalControlsMap, [kidId]: newControls } }));
    return newKid;
  };
  const updateKidProfileAndControls = (updatedKid: KidProfile, updatedControls: ParentalControls) => {
     setAppState(prev => ({ ...prev, kidProfiles: prev.kidProfiles.map(kp => kp.id === updatedKid.id ? updatedKid : kp), parentalControlsMap: { ...prev.parentalControlsMap, [updatedKid.id]: updatedControls } }));
  };
  const switchViewToKidAsParent = (kidId: string) => {
    const kidToView = appState.kidProfiles.find(kp => kp.id === kidId && kp.parentId === appState.currentParentProfileId);
    if (kidToView) {
        setAppState(prev => ({ ...prev, currentUserRole: UserRole.Kid, currentKidProfileId: kidId, }));
        setViewWithPath(AppViewEnum.KidHome, 'KidHome', { replace: true }); // Navigate to KidHome after switch
    } else {
        alert("Could not switch to kid's view.");
    }
  };
  const switchToParentView = () => {
    if (appState.currentParentProfileId) {
        setAppState(prev => ({ ...prev, currentUserRole: UserRole.Parent, currentKidProfileId: null, }));
        setViewWithPath(AppViewEnum.ParentPostLoginSelection, 'ParentPostLoginSelection', { replace: true });
    } else {
        logout();
    }
  };
  const enrollInCourse = async (kidId: string, courseId: string): Promise<boolean> => {
    setAppState(prev => ({ ...prev, kidProfiles: prev.kidProfiles.map(kp => kp.id === kidId ? {...kp, enrolledCourseIds: Array.from(new Set([...(kp.enrolledCourseIds || []), courseId]))} : kp) }));
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
  };
  const addReview = (review: Review) => { setAllReviews(prev => [...prev, review]); };
  const loginKidWithPin = (pin: string): KidProfile | null => { return null; }; 

  const startOrGoToChat = (otherParticipantId: string, otherParticipantRole: UserRole, otherParticipantName: string, otherParticipantAvatar?: string): string => {
    const currentUserId = appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId;
    if (!currentUserId) return '';
    const existing = appState.chatConversations.find(c => c.participantIds.includes(currentUserId) && c.participantIds.includes(otherParticipantId));
    if(existing) return existing.id;
    const newConvoId = `convo_${Date.now()}`;
    const newConvo: ChatConversation = { id: newConvoId, participantIds: [currentUserId, otherParticipantId], participants: [{id: currentUserId, name: "You", role: appState.currentUserRole! }, {id: otherParticipantId, name: otherParticipantName, role: otherParticipantRole, avatarUrl: otherParticipantAvatar}], lastMessageTimestamp: Date.now()};
    setAppState(prev => ({...prev, chatConversations: [...prev.chatConversations, newConvo]}));
    return newConvoId;
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
  };


  const appContextValue = {
    appState, setAppState, kidProfile, setKidProfile, parentalControls, setParentalControls, teacherProfile, setTeacherProfile, adminProfile, setAdminProfile, allTeacherProfiles, setAllTeacherProfiles, kidProgress, setKidProgress, kidCourseProgressMap, setKidCourseProgressMap, allActivities, setAllActivities, allCourses, setAllCourses, allReviews, addReview, setViewWithPath, goBack, hasOnboardedKid, setHasOnboardedKid, logout, switchToParentView, currentView: currentViewEnum, enrollInCourse, updateLessonProgress, addKidProfileToParent, updateKidProfileAndControls, switchViewToKidAsParent, submitTeacherVerification, loginKidWithPin, startOrGoToChat, sendChatMessage, markConversationAsRead, updateTeacherVerificationStatus, updateCourseStatus, updateActivityStatus
  };

  if (isStoreLoading || isInitialApiDataLoading) {
    return <SplashScreen />; 
  }

  const commonScreenOptions: NativeStackNavigationOptions = {
    header: (props) => <RNHeader navigationProps={props} />,
    animation: 'slide_from_right',
  };
  const noHeaderOptions: NativeStackNavigationOptions = { headerShown: false };

  let MainStackComponent = null;
  if (appState.currentUserRole === UserRole.Kid && appState.currentKidProfileId) {
    MainStackComponent = KidStack;
  } else if (appState.currentUserRole === UserRole.Parent && appState.currentParentProfileId) {
    MainStackComponent = ParentStack;
  } else if (appState.currentUserRole === UserRole.Teacher && appState.currentTeacherProfileId) {
    MainStackComponent = TeacherStack;
  } else if (appState.currentUserRole === UserRole.Admin && appState.currentAdminProfileId) {
    MainStackComponent = AdminStack;
  }
  
  const showNav = appState.currentUserRole && 
                  ![AppViewEnum.Splash, AppViewEnum.Login, AppViewEnum.RoleSelection, AppViewEnum.AgeSelection, 
                    AppViewEnum.ParentSetup, AppViewEnum.KidAvatarSelection, AppViewEnum.ParentPostLoginSelection
                  ].includes(currentViewEnum) && MainStackComponent !== null;


  return (
    <AppContext.Provider value={appContextValue}>
      <NavigationContainer ref={navigationRef} theme={AppTheme} onStateChange={(state) => {
         const currentRoute = state?.routes[state.index];
         const currentRouteName = currentRoute?.name;
         const newViewEnumKey = Object.keys(AppViewEnum).find(key => AppViewEnum[key as keyof typeof AppViewEnum].toString() === currentRoute?.params?.viewEnum?.toString() || key.toLowerCase() === currentRouteName?.toLowerCase());

         if (newViewEnumKey) {
           setCurrentViewEnum((AppViewEnum as any)[newViewEnumKey]);
         }
      }}>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor="#4A90E2" />
        {MainStackComponent ? (
          <>
            <Stack.Navigator screenOptions={commonScreenOptions}>
              <Stack.Screen name="MainApp" component={MainStackComponent} options={noHeaderOptions} />
            </Stack.Navigator>
            {showNav && <RNNavigationBottom />}
          </>
        ) : (
          <Stack.Navigator screenOptions={noHeaderOptions}>
            <Stack.Screen name={AppViewEnum[AppViewEnum.Splash]} component={SplashScreen} />
            <Stack.Screen name={AppViewEnum[AppViewEnum.RoleSelection]} component={RoleSelectionScreen} />
            <Stack.Screen name={AppViewEnum[AppViewEnum.Login]} component={LoginScreen} />
            <Stack.Screen name={AppViewEnum[AppViewEnum.AgeSelection]} component={AgeSelectionScreen} />
            <Stack.Screen name={AppViewEnum[AppViewEnum.ParentSetup]} component={ParentSetupScreen} />
            <Stack.Screen name={AppViewEnum[AppViewEnum.ParentPostLoginSelection]} component={ParentPostLoginSelectionScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AppContext.Provider>
  );
}

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    loadAssetsAsync().then(() => {
      setAssetsLoaded(true);
    }).catch(error => {
      console.warn(error);
    });
  }, []);

  if (!assetsLoaded) {
    return null; 
  }

  return <AppContent />;
}
