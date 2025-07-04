
import { TeacherProfile, Course, Activity, ActivityStatus } from '../types';
import { MOCK_TEACHERS, MOCK_COURSES, ALL_ACTIVITIES_MOCK } from '../constants';

// Simulate a database or API backend with a delay
const SIMULATED_DELAY = 300; // milliseconds

let mockTeachersDB: TeacherProfile[] = [...MOCK_TEACHERS];
let mockCoursesDB: Course[] = [...MOCK_COURSES];
let mockActivitiesDB: Activity[] = [...ALL_ACTIVITIES_MOCK];

// --- Teacher Functions ---
export const fetchTeachers = async (): Promise<TeacherProfile[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockTeachersDB]), SIMULATED_DELAY));
};

export const updateTeacherVerification = async (teacherId: string, newStatus: 'Pending' | 'Verified' | 'Rejected'): Promise<TeacherProfile | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const teacherIndex = mockTeachersDB.findIndex(t => t.id === teacherId);
      if (teacherIndex !== -1) {
        mockTeachersDB[teacherIndex] = {
          ...mockTeachersDB[teacherIndex],
          verificationStatus: newStatus,
          isVerified: newStatus === 'Verified',
        };
        resolve({ ...mockTeachersDB[teacherIndex] });
      } else {
        reject(new Error("Teacher not found"));
      }
    }, SIMULATED_DELAY);
  });
};

// --- Course Functions ---
export const fetchCourses = async (): Promise<Course[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockCoursesDB]), SIMULATED_DELAY));
};

export const updateCourseStatus = async (courseId: string, newStatus: ActivityStatus.Active | ActivityStatus.Rejected): Promise<Course | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const courseIndex = mockCoursesDB.findIndex(c => c.id === courseId);
      if (courseIndex !== -1) {
        mockCoursesDB[courseIndex] = {
          ...mockCoursesDB[courseIndex],
          status: newStatus,
        };
        resolve({ ...mockCoursesDB[courseIndex] });
      } else {
        reject(new Error("Course not found"));
      }
    }, SIMULATED_DELAY);
  });
};

// --- Activity Functions ---
export const fetchActivities = async (): Promise<Activity[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...mockActivitiesDB]), SIMULATED_DELAY));
};

export const updateActivityStatus = async (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected): Promise<Activity | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const activityIndex = mockActivitiesDB.findIndex(a => a.id === activityId);
      if (activityIndex !== -1) {
        mockActivitiesDB[activityIndex] = {
          ...mockActivitiesDB[activityIndex],
          status: newStatus,
        };
        resolve({ ...mockActivitiesDB[activityIndex] });
      } else {
        reject(new Error("Activity not found"));
      }
    }, SIMULATED_DELAY);
  });
};

// Function to reset mock DBs if needed for testing, not typically part of a real API
export const resetMockData = () => {
  mockTeachersDB = [...MOCK_TEACHERS];
  mockCoursesDB = [...MOCK_COURSES];
  mockActivitiesDB = [...ALL_ACTIVITIES_MOCK];
  console.log("Mock data has been reset.");
};
