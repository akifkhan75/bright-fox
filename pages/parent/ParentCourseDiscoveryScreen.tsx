
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import { UserRole, Course, TeacherProfile, View, AgeGroup, ActivityStatus } from '../../types'; // Added ActivityStatus
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MagnifyingGlassIcon, StarIcon, AcademicCapIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { AGE_GROUPS_V3, SUBJECTS_LIST } from '../../constants';

const ParentCourseDiscoveryScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Parent) {
    return <div className="p-4 text-center">Access Denied.</div>;
  }
  const { allCourses, allTeacherProfiles, setViewWithPath } = context;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'All'>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const teacher = allTeacherProfiles.find(t => t.id === course.teacherId);
      const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (teacher && teacher.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const ageMatch = selectedAgeGroup === 'All' || course.ageGroups.includes(selectedAgeGroup);
      const subjectMatch = selectedSubject === 'All' || course.subject === selectedSubject;
      
      return searchMatch && ageMatch && subjectMatch && course.status === ActivityStatus.Active; // Only show active courses
    });
  }, [allCourses, allTeacherProfiles, searchTerm, selectedAgeGroup, selectedSubject]);
  
  const topRatedTeachers = useMemo(() => {
    return [...allTeacherProfiles]
        .filter(t => t.isVerified && t.ratingAverage && t.ratingAverage >=4)
        .sort((a,b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
        .slice(0,3);
  }, [allTeacherProfiles]);


  const CourseCard: React.FC<{ course: Course; teacher?: TeacherProfile }> = ({ course, teacher }) => (
    <Card className="flex flex-col justify-between !shadow-lg hover:!shadow-xl transition-shadow duration-200">
      <div>
        <img src={course.imageUrl || `https://picsum.photos/seed/${course.id}/300/180`} alt={course.title} className="w-full h-32 object-cover rounded-t-lg mb-3"/>
        <h3 className="text-lg font-semibold text-indigo-700 mb-1 px-3">{course.title}</h3>
        <p className="text-xs text-gray-500 mb-1 px-3">By {teacher?.name || 'Teacher'}</p>
        <div className="flex items-center text-xs text-amber-600 mb-2 px-3">
            <StarIcon className="h-4 w-4 mr-0.5"/> {course.ratingAverage?.toFixed(1) || 'New'} ({course.ratingCount || 0} reviews)
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 px-3">{course.description}</p>
        <div className="text-xs px-3 mb-2">
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mr-1">{course.subject}</span>
            <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{course.ageGroups.join(', ')} yrs</span>
        </div>
      </div>
      <div className="px-3 pb-3 mt-auto">
        <Button 
            onClick={() => setViewWithPath(View.CourseDetailView, `/coursedetailview/${course.id}`)}
            fullWidth 
            size="sm"
            className="!bg-indigo-500 hover:!bg-indigo-600"
        >
            View Course
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 font-display">Discover Courses</h1>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="!p-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1 inline"/> Filters {showFilters ? 'Hide' : 'Show'}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className={`mb-6 ${showFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input 
            type="text" 
            placeholder="Search courses, subjects, teachers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="sm:col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div>
            <label htmlFor="ageFilter" className="block text-xs font-medium text-gray-700">Age Group</label>
            <select id="ageFilter" value={selectedAgeGroup} onChange={e => setSelectedAgeGroup(e.target.value as AgeGroup | 'All')}  className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="All">All Ages</option>
              {AGE_GROUPS_V3.map(ag => <option key={ag} value={ag}>{ag} years</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subjectFilter" className="block text-xs font-medium text-gray-700">Subject</label>
            <select id="subjectFilter" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="mt-1 block w-full pl-3 pr-8 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="All">All Subjects</option>
              {SUBJECTS_LIST.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>
          {/* Add price filter later */}
        </div>
      </Card>
      
      {/* Top Rated Teachers - Placeholder */}
      {topRatedTeachers.length > 0 && (
        <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Top Rated Teachers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {topRatedTeachers.map(teacher => (
                    <Card key={teacher.id} className="!p-3 hover:!shadow-lg transition-shadow cursor-pointer" onClick={() => setViewWithPath(View.TeacherProfileView, `/teacherprofileview/${teacher.id}`)}>
                        <div className="flex items-center">
                            <img src={teacher.avatarUrl} alt={teacher.name} className="w-12 h-12 rounded-full mr-3 object-cover"/>
                            <div>
                                <h4 className="font-semibold text-indigo-700">{teacher.name}</h4>
                                <p className="text-xs text-gray-500">{teacher.subjects?.slice(0,2).join(', ')}</p>
                                <div className="flex items-center text-xs text-amber-600"><StarIcon className="h-3 w-3 mr-0.5"/>{teacher.ratingAverage?.toFixed(1)} ({teacher.ratingCount} reviews)</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
      )}


      {/* Course Listing */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{searchTerm || selectedAgeGroup !== 'All' || selectedSubject !== 'All' ? 'Filtered Courses' : 'All Available Courses'}</h2>
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} teacher={allTeacherProfiles.find(t => t.id === course.teacherId)} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-600">No courses match your current filters. Try adjusting your search!</p>
        </Card>
      )}
    </div>
  );
};

export default ParentCourseDiscoveryScreen;
