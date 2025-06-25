
import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { View, UserRole, TeacherProfile, AdminProfile } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import { APP_NAME, DEFAULT_KID_PROFILE, DEFAULT_TEACHER_PROFILE, DEFAULT_PARENTAL_CONTROLS, DEFAULT_ADMIN_PROFILE } from '../constants';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const LoginScreen: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleFromQuery = queryParams.get('role') as UserRole;
    if (roleFromQuery && Object.values(UserRole).includes(roleFromQuery)) {
      setRole(roleFromQuery);
    } else {
      context?.setViewWithPath(View.RoleSelection, '/roleselection', {replace: true});
    }
  }, [location.search, context]);


  if (!context) return null;
  const { appState, setAppState, setViewWithPath, setTeacherProfile, setAllTeacherProfiles, allTeacherProfiles, setAdminProfile } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock Login Logic
    if (email === "test@example.com" && password === "password") {
      if (role === UserRole.Parent) {
        const parentId = 'parent123'; // Mock parent ID
        setAppState(prev => ({ 
          ...prev, 
          currentUserRole: UserRole.Parent, 
          currentParentProfileId: parentId,
        }));
        setViewWithPath(View.ParentPostLoginSelection, '/parentpostloginselection', {replace: true}); 
      } else if (role === UserRole.Teacher) {
        const teacherId = `teacher_test_${Date.now()}`; 
        const newTeacherProfile: TeacherProfile = { 
          ...DEFAULT_TEACHER_PROFILE, 
          id: teacherId, 
          email: email, 
          name: "Test Teacher" 
        };
        setTeacherProfile(newTeacherProfile); 
        
        setAllTeacherProfiles(prevTeachers => {
            if (!prevTeachers.find(tp => tp.id === newTeacherProfile.id)) {
                return [...prevTeachers, newTeacherProfile];
            }
            return prevTeachers;
        });

        setAppState(prev => ({ 
            ...prev, 
            currentUserRole: UserRole.Teacher, 
            currentTeacherProfileId: teacherId 
        }));
        setViewWithPath(View.TeacherDashboard, '/teacherdashboard', {replace: true});
      } else {
         setError("Invalid role for login.");
      }
    } else if (email === "admin@example.com" && password === "password" && role === UserRole.Admin) {
        const adminId = 'admin001';
        const newAdminProfile: AdminProfile = {
            ...DEFAULT_ADMIN_PROFILE,
            id: adminId,
            email: email,
            name: "App Admin"
        };
        setAdminProfile(newAdminProfile);
        setAppState(prev => ({
            ...prev,
            currentUserRole: UserRole.Admin,
            currentAdminProfileId: adminId,
            adminProfile: newAdminProfile // Also store in appState for persistence
        }));
        setViewWithPath(View.AdminDashboard, '/admindashboard', {replace: true});
    } else {
      setError("Invalid email or password. (Hint: test@example.com / password or admin@example.com / password for Admin)");
    }
  };
  
  if (!role) {
    return <div className="p-4 text-center">Loading login screen...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 md:p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
         <button 
            onClick={() => setViewWithPath(View.RoleSelection, '/roleselection')} 
            className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
            aria-label="Go back to role selection"
        >
            <ArrowLeftIcon className="h-6 w-6"/>
        </button>
        <div className="text-center mb-6">
            <img src={`https://picsum.photos/seed/${role}LoginIcon/80/80`} alt={`${role} Login Icon`} className="w-20 h-20 rounded-full mx-auto mb-3 shadow-lg border-2 border-indigo-300" />
            <h2 className="text-2xl font-bold text-indigo-700 font-display">{role} Login</h2>
            <p className="text-sm text-gray-500">Welcome back to {APP_NAME}!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" fullWidth size="lg" className="!font-kidFriendly !text-xl bg-indigo-600 hover:bg-indigo-700">
            Log In
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Don't have an account? <a href="#" className="text-indigo-600 hover:underline" onClick={(e) => { e.preventDefault(); alert('Sign up is not implemented in this demo.'); }}>Sign up (demo)</a>
        </p>
      </Card>
    </div>
  );
};

export default LoginScreen;
