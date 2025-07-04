
// backend/controllers.js
let { MOCK_TEACHERS_DB, MOCK_COURSES_DB, MOCK_ACTIVITIES_DB } = require('./data');

// --- Teacher Functions ---
const getTeachers = (req, res) => {
  res.json(MOCK_TEACHERS_DB);
};

const updateTeacherVerification = (req, res) => {
  const { teacherId } = req.params;
  const { newStatus } = req.body; // Expected: 'Verified' or 'Rejected'

  if (!['Verified', 'Rejected', 'Pending'].includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  const teacherIndex = MOCK_TEACHERS_DB.findIndex(t => t.id === teacherId);
  if (teacherIndex !== -1) {
    MOCK_TEACHERS_DB[teacherIndex] = {
      ...MOCK_TEACHERS_DB[teacherIndex],
      verificationStatus: newStatus,
      isVerified: newStatus === 'Verified',
    };
    res.json(MOCK_TEACHERS_DB[teacherIndex]);
  } else {
    res.status(404).json({ message: "Teacher not found" });
  }
};

// --- Course Functions ---
const getCourses = (req, res) => {
  res.json(MOCK_COURSES_DB);
};

const updateCourseStatus = (req, res) => {
  const { courseId } = req.params;
  const { newStatus } = req.body; // Expected: 'Active' or 'Rejected'

  if (!['Active', 'Rejected', 'Pending'].includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value for course." });
  }

  const courseIndex = MOCK_COURSES_DB.findIndex(c => c.id === courseId);
  if (courseIndex !== -1) {
    MOCK_COURSES_DB[courseIndex] = {
      ...MOCK_COURSES_DB[courseIndex],
      status: newStatus,
    };
    res.json(MOCK_COURSES_DB[courseIndex]);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
};

// --- Activity Functions ---
const getActivities = (req, res) => {
  res.json(MOCK_ACTIVITIES_DB);
};

const updateActivityStatus = (req, res) => {
  const { activityId } = req.params;
  const { newStatus } = req.body; // Expected: 'Approved' or 'Rejected'
  
  if (!['Approved', 'Rejected', 'Pending'].includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value for activity." });
  }

  const activityIndex = MOCK_ACTIVITIES_DB.findIndex(a => a.id === activityId);
  if (activityIndex !== -1) {
    MOCK_ACTIVITIES_DB[activityIndex] = {
      ...MOCK_ACTIVITIES_DB[activityIndex],
      status: newStatus,
    };
    res.json(MOCK_ACTIVITIES_DB[activityIndex]);
  } else {
    res.status(404).json({ message: "Activity not found" });
  }
};

// --- Submit Teacher Verification ---
const submitTeacherVerificationApplication = (req, res) => {
  const { teacherId } = req.params;
  // const documentsData = req.body; // In a real app, you'd handle file uploads here
  
  const teacherIndex = MOCK_TEACHERS_DB.findIndex(t => t.id === teacherId);
  if (teacherIndex !== -1) {
    MOCK_TEACHERS_DB[teacherIndex].verificationStatus = 'Pending';
    // In a real app, save documentsData somewhere
    console.log(`Verification documents submitted for teacher ${teacherId}`);
    res.json(MOCK_TEACHERS_DB[teacherIndex]);
  } else {
    res.status(404).json({ message: "Teacher not found" });
  }
};


module.exports = {
  getTeachers,
  updateTeacherVerification,
  getCourses,
  updateCourseStatus,
  getActivities,
  updateActivityStatus,
  submitTeacherVerificationApplication,
};
