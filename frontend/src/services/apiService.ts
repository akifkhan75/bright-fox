
// frontend/src/services/apiService.ts
import { TeacherProfile, Course, Activity, ActivityStatus } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Assuming backend runs on port 3001

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
    body: JSON.stringify(documentsData), // In real app, this might be FormData for file uploads
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
