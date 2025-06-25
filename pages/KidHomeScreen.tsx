
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { View, UserRole, ActivityCategory } from '../../types';
import Card from '../../components/Card';
import { ACTIVITY_CATEGORIES_CONFIG } from '../../constants';

const KidHomeScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid) {
    // App.tsx routing logic should prevent unauthorized access or missing profiles.
    // If it reaches here, it implies context is ready for kid home.
    return <div className="p-4 text-center">Loading kid's home...</div>;
  }

  const { kidProfile, setViewWithPath } = context;

  const handleCategoryClick = (category: ActivityCategory) => {
    // Ensure path matches the route defined in App.tsx for CategoryActivitiesScreen
    setViewWithPath(View.CategoryActivitiesScreen, `/categoryactivities/${category.id.toLowerCase()}`, { state: { categoryName: category.name, categoryColor: category.color, categoryId: category.id.toLowerCase() } });
  };

  return (
    <div className="p-4 pt-6 md:p-6 bg-sky-50 min-h-full flex flex-col">
      <div className="mb-6 text-center">
         <p className="text-green-600 bg-green-100 border border-green-300 px-3 py-1.5 rounded-full inline-block text-sm font-semibold mb-3">
            For ages: {kidProfile.ageGroup || 'All'} {kidProfile.currentLearningLevel && `| ${kidProfile.currentLearningLevel} Level`}
          </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 font-display">What do you want to do?</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 flex-grow content-start">
        {ACTIVITY_CATEGORIES_CONFIG.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              aria-label={category.name}
              className={`p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl text-white flex flex-col items-center justify-center aspect-square transform hover:-translate-y-1 transition-all duration-200 ease-in-out ${category.color}`}
            >
              <IconComponent className="h-12 w-12 sm:h-16 sm:w-16 mb-2 sm:mb-3" />
              <span className="text-lg sm:text-xl font-bold font-kidFriendly">{category.name}</span>
            </button>
          );
        })}
      </div>
      
      {ACTIVITY_CATEGORIES_CONFIG.length === 0 && (
        <Card className="mt-8 text-center flex-grow flex items-center justify-center">
          <div>
            <p className="text-gray-600 font-semibold text-lg">No activity categories available right now.</p>
            <p className="text-gray-500 text-sm mt-1">Please check back later!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default KidHomeScreen;
