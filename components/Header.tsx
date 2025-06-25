import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // For ParentManageKidDetail title & location state
import { ArrowLeftIcon, Cog6ToothIcon, UserCircleIcon, ArrowRightOnRectangleIcon, AcademicCapIcon, HomeModernIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'; // Changed UserCogIcon to ShieldCheckIcon
import { AppContext } from '../App';
import { View, UserRole } from '../types';
import { APP_NAME, ACTIVITY_CATEGORIES_CONFIG } from '../constants'; // Added ACTIVITY_CATEGORIES_CONFIG
import IconButton from './IconButton';

const Header: React.FC = () => {
  const context = useContext(AppContext);
  const params = useParams(); // Generic params
  const location = useLocation(); // For location.state

  if (!context) return null;
  const { appState, currentView, goBack, setViewWithPath, kidProfile, teacherProfile, adminProfile, logout, switchToParentView } = context;

  const handleBack = () => {
    goBack();
  };
  
  const getTitle = () => {
    if (!appState.currentUserRole) return APP_NAME;

    switch (currentView) {
      // Kid Views
      case View.KidHome:
        return kidProfile ? `Hi, ${kidProfile.name}!` : "Kid's Home";
      case View.KidAchievements:
        return "My Achievements";
      case View.KidLearningPathView: 
        return "My Learning Path";
      case View.LiveClassPlaceholderView: 
        return "Live Class";
      case View.DrawAndTell:
        return "Draw & Tell";
      case View.WhyZone:
        return "Why Zone";
      case View.EmotionalLearning:
        return "My Feelings";
      
      // Parent Views
      case View.ParentDashboard:
        return "Parent Dashboard";
      case View.ParentAddKid: 
        return "Add New Kid";
      case View.ParentManageKidDetail: 
        const { kidId } = params as { kidId?: string }; 
        const managedKid = kidId ? appState.kidProfiles.find(kp => kp.id === kidId) : null;
        return managedKid ? `${managedKid.name}'s Settings` : "Manage Kid";
      case View.ParentCourseDiscoveryView: 
        return "Discover Courses";
      case View.CourseDetailView: 
        return "Course Details";
      case View.TeacherProfileView: 
        return "Teacher Profile"; 
      case View.Settings:
        return "Settings";
      case View.CompareProgress:
        return "Compare Progress";
      case View.ParentPostLoginSelection:
        return "Welcome Parent!";
      case View.ChatListScreen:
        return "My Messages";
      case View.ChatRoomScreen:
        const { conversationId } = params as {conversationId?: string};
        const convo = appState.chatConversations.find(c => c.id === conversationId);
        const otherParticipant = convo?.participants.find(p => p.id !== (appState.currentUserRole === UserRole.Parent ? appState.currentParentProfileId : appState.currentTeacherProfileId));
        return otherParticipant ? `Chat with ${otherParticipant.name}` : "Chat";

      // Teacher Views
      case View.TeacherDashboard:
        return "Teacher Dashboard";
      case View.ActivityBuilder:
        return "Content Builder"; 
      case View.TeacherContentManagement:
        return "My Content";
      case View.TeacherEarnings:
        return "My Earnings";
      case View.TeacherVerificationView: 
        return "Verification Center";
      
      // Admin Views
      case View.AdminDashboard:
        return "Admin Dashboard";
      case View.AdminTeacherVerificationApproval:
        return "Teacher Approvals";
      case View.AdminContentModeration:
        return "Content Moderation";
      case View.AdminUserManagement:
        return "User Management";
      
      case View.CountingGameScreen: return "Counting Fun";
      case View.FairytaleReaderScreen: return "Story Time";
      case View.CategoryActivitiesScreen: 
        const { categoryId: catIdParam } = params as { categoryId?: string};
        const routeState = location.state as { categoryName?: string } | null | undefined;
        const categoryStateName = routeState?.categoryName;
        const catConfig = ACTIVITY_CATEGORIES_CONFIG.find(c => c.id === catIdParam);
        return categoryStateName || catConfig?.name || "Activities";


      case View.AppInfo:
        return "App Info";
      default:
        const viewKey = (Object.keys(View) as Array<keyof typeof View>).find(key => View[key] === currentView);
        if (viewKey) {
            return viewKey
                .replace(/([A-Z])/g, ' $1') 
                .replace(/^./, str => str.toUpperCase()) 
                .trim();
        }
        return APP_NAME;
    }
  };

  const showBackButton = ![
    View.Splash, View.RoleSelection, View.Login, 
    View.KidHome, View.ParentDashboard, View.TeacherDashboard, View.AdminDashboard, View.ParentPostLoginSelection
    ].includes(currentView);

  const isKid = appState.currentUserRole === UserRole.Kid;
  const isParent = appState.currentUserRole === UserRole.Parent;
  const isTeacher = appState.currentUserRole === UserRole.Teacher;
  const isAdmin = appState.currentUserRole === UserRole.Admin;
  const parentIsMasquerading = isKid && appState.currentParentProfileId;


  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg h-16 max-w-[420px] mx-auto">
      <div className="flex items-center flex-1 min-w-0">
        {showBackButton && (
          <IconButton
            icon={<ArrowLeftIcon className="h-6 w-6 text-white" />}
            onClick={handleBack}
            ariaLabel="Go back"
            className="mr-2 !p-1 hover:bg-white/20 active:bg-white/30"
          />
        )}
        <h1 className="text-lg sm:text-xl font-bold font-display truncate">{getTitle()}</h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        {isKid && kidProfile?.avatar && (
            <span className="text-2xl sm:text-3xl p-0.5 bg-white/20 rounded-full">{kidProfile.avatar}</span>
        )}
        
        {isTeacher && teacherProfile && (
             <IconButton 
                icon={<img src={teacherProfile.avatarUrl || 'https://picsum.photos/seed/defaultteacher/40/40'} alt="Teacher" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"/>}
                onClick={() => setViewWithPath(View.TeacherProfileView, `/teacherprofileview/${teacherProfile.id}`, { state: {isEditing: true} })} 
                ariaLabel="My Teacher Profile"
                className="hover:bg-white/20 !p-0.5"
            />
        )}

        {isAdmin && adminProfile && (
             <IconButton 
                icon={<ShieldCheckIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />} // Changed from UserCogIcon
                ariaLabel={`Admin: ${adminProfile.name}`}
                className="hover:bg-white/20 !p-1"
            />
        )}


        {parentIsMasquerading && ( 
             <IconButton 
                icon={<HomeModernIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />} // Icon indicating 'back to parent area'
                onClick={switchToParentView}
                ariaLabel="Back to Parent View"
                className="hover:bg-white/20"
            />
        )}
        
        {((isParent && currentView === View.ParentDashboard) || 
          (isTeacher && currentView === View.TeacherDashboard) ||
          (isAdmin && currentView === View.AdminDashboard) 
          ) && (
             <IconButton 
                icon={<Cog6ToothIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />}
                onClick={() => setViewWithPath(View.Settings, '/settings')} 
                ariaLabel="Settings"
                className="hover:bg-white/20"
            />
        )}

        {appState.currentUserRole && appState.currentUserRole !== UserRole.Kid && ( 
            <IconButton
                icon={<ArrowRightOnRectangleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />}
                onClick={logout} 
                ariaLabel="Logout"
                className="hover:bg-white/20 !p-1.5"
            />
        )}
      </div>
    </header>
  );
};

export default Header;