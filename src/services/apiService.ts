
// frontend/src/services/apiService.ts
// Ensure this path is correct based on your React Native project structure.
// Usually, it would be something like 'src/types' if App.tsx is at the root.
import { Platform } from 'react-native';
import { TeacherProfile, Course, Activity, ActivityStatus } from '../types';

// For React Native development:
// - If using an Android emulator, 'http://10.0.2.2:3001/api' typically accesses the host machine's localhost.
// - If using a physical Android device or iOS simulator/device, replace 'localhost' with your computer's local IP address.
//   (e.g., 'http://192.168.1.100:3001/api'). Ensure both devices are on the same network.
// - For production, this would be your deployed backend URL.
//const API_BASE_URL = 'http://localhost:3001/api'; // ADJUST FOR YOUR RN DEV ENVIRONMENT

const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3002/api',
  android: 'http://10.0.2.2:3002/api',
  default: 'http://your-production-api.com/api'
});

// --- Generic Fetch Wrapper ---
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// --- Teacher Functions ---
export const fetchTeachers = (): Promise<TeacherProfile[]> => {
  return fetchApi<TeacherProfile[]>('/teachers');
};

export const updateTeacherVerification = (teacherId: string, newStatus: 'Pending' | 'Verified' | 'Rejected'): Promise<TeacherProfile> => {
  return fetchApi<TeacherProfile>(`/teachers/${teacherId}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ newStatus }),
  });
};

export const submitTeacherVerificationApplication = (teacherId: string, documentsData: any): Promise<TeacherProfile> => {
  return fetchApi<TeacherProfile>(`/teachers/${teacherId}/submit-verification`, {
    method: 'POST',
    body: JSON.stringify(documentsData), 
  });
};


// --- Course Functions ---
export const fetchCourses = (): Promise<Course[]> => {
  return fetchApi<Course[]>('/courses');
};

export const updateCourseStatus = (courseId: string, newStatus: ActivityStatus.Active | ActivityStatus.Rejected): Promise<Course> => {
  return fetchApi<Course>(`/courses/${courseId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ newStatus }),
  });
};

// --- Activity Functions ---
export const fetchActivities = (): Promise<Activity[]> => {
  return fetchApi<Activity[]>('/activities');
};

export const updateActivityStatus = (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected): Promise<Activity> => {
  return fetchApi<Activity>(`/activities/${activityId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ newStatus }),
  });
};
