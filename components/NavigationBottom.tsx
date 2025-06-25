
import React, { useContext } from 'react';
import { HomeIcon, Squares2X2Icon, InformationCircleIcon, UserCircleIcon, Cog6ToothIcon, AcademicCapIcon, CurrencyDollarIcon, DocumentTextIcon, StarIcon, LightBulbIcon, PaintBrushIcon, MagnifyingGlassIcon, BookOpenIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon, UserGroupIcon, ScaleIcon, EyeIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../App';
import { View, UserRole } from '../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg transition-all duration-150 w-1/4 transform active:scale-90 ${className} ${
        isActive ? 'text-sky-500 scale-105' : 'text-gray-500 hover:text-sky-600' 
      }`}
      aria-label={label}
    >
      <div className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${isActive ? 'text-sky-500' : 'text-gray-400'}`}>{icon}</div>
      <span className={`text-[9px] sm:text-[10px] font-medium ${isActive ? 'text-sky-500' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
};

const NavigationBottom: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appState, currentView, setViewWithPath } = context;

  let navItems: Array<{ id: View; icon: React.ReactNode; label: string; }> = [];


  if (appState.currentUserRole === UserRole.Kid) {
    navItems = [
      { id: View.KidHome, icon: <HomeIcon />, label: 'Home' },
      { id: View.KidAchievements, icon: <StarIcon />, label: 'Awards' },
      { id: View.KidLearningPathView, icon: <BookOpenIcon />, label: 'Courses' }, 
      { id: View.AppInfo, icon: <InformationCircleIcon />, label: 'Info' }, 
    ];
  } else if (appState.currentUserRole === UserRole.Parent) {
    navItems = [
      { id: View.ParentDashboard, icon: <UserCircleIcon />, label: 'Dashboard' },
      { id: View.ParentCourseDiscoveryView, icon: <MagnifyingGlassIcon />, label: 'Discover' }, 
      { id: View.ParentDashboard, icon: <UserGroupIcon />, label: 'Manage Kids' }, 
      { id: View.ChatListScreen, icon: <ChatBubbleLeftRightIcon />, label: 'Chats' },
    ];
  } else if (appState.currentUserRole === UserRole.Teacher) {
    navItems = [
      { id: View.TeacherDashboard, icon: <AcademicCapIcon />, label: 'Dashboard' },
      { id: View.TeacherContentManagement, icon: <DocumentTextIcon />, label: 'Content' },
      { id: View.ChatListScreen, icon: <ChatBubbleLeftRightIcon />, label: 'Chats' },
      { id: View.TeacherEarnings, icon: <CurrencyDollarIcon />, label: 'Earnings' },
    ];
  } else if (appState.currentUserRole === UserRole.Admin) {
    navItems = [
      { id: View.AdminDashboard, icon: <HomeIcon />, label: 'Dashboard' },
      { id: View.AdminTeacherVerificationApproval, icon: <ShieldCheckIcon />, label: 'Verify' },
      { id: View.AdminContentModeration, icon: <EyeIcon />, label: 'Moderate' },
      { id: View.AdminUserManagement, icon: <UserGroupIcon />, label: 'Users' },
    ];
  }

  if (navItems.length === 0) return null;

  const handleNavClick = (viewId: View, itemLabel: string) => {
    let path = `/${(View[viewId] as string).toLowerCase()}`;
    
    if (itemLabel === 'Manage Kids' && viewId === View.ParentDashboard && appState.currentUserRole === UserRole.Parent) {
        setViewWithPath(View.ParentDashboard, path); 
        return;
    }
    setViewWithPath(viewId, path);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center bg-white/95 backdrop-blur-md shadow-top h-14 sm:h-16 border-t border-gray-200 max-w-[420px] mx-auto rounded-t-lg sm:rounded-t-xl">
      {navItems.map((item) => (
        <NavItem
          key={item.id + item.label} 
          icon={item.icon}
          label={item.label}
          isActive={currentView === item.id || (item.label === 'Manage Kids' && currentView === View.ParentDashboard)}
          onClick={() => handleNavClick(item.id, item.label)}
        />
      ))}
    </nav>
  );
};

export default NavigationBottom;
