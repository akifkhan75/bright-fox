
import React, { useContext, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { View, UserRole, Activity, AgeGroup, LessonContentType, ActivityStatus, DifficultyLevel } from '../../types'; 
import Card from '../../components/Card';
import { ArrowLeftIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid'; 
import IconButton from '../../components/IconButton';
import { ACTIVITY_CATEGORIES_CONFIG } from '../../constants';


const CategoryActivitiesScreen: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const { categoryId: categoryIdFromParams } = useParams<{ categoryId: string }>();

  // Prefer categoryId from state if passed, otherwise from params. Ensure it's lowercased for consistency.
  const categoryId = (location.state?.categoryId as string || categoryIdFromParams)?.toLowerCase();

  const categoryConfig = ACTIVITY_CATEGORIES_CONFIG.find(cat => cat.id.toLowerCase() === categoryId);
  
  // Use categoryConfig?.name for display name if available, otherwise fallback.
  const categoryNameFromState = location.state?.categoryName as string || categoryConfig?.name || "Category";
  const categoryColorFromState = location.state?.categoryColor as string || categoryConfig?.color || "bg-gray-500";
  
  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid || !categoryId) {
    context?.setViewWithPath(View.KidHome, '/kidhome', { replace: true });
    return <div className="p-4 text-center">Loading activities or unauthorized...</div>;
  }

  const { kidProfile, allActivities, setViewWithPath, goBack } = context;

  const categoryActivities = useMemo(() => {
    // Use the normalized category ID from categoryConfig for filtering if available.
    // Otherwise, use the categoryName (from state or config) and normalize it.
    // This assumes `activity.category` stores the display name (e.g., "Numbers")
    const resolvedCategoryIdentifier = categoryConfig ? categoryConfig.id.toLowerCase() : categoryNameFromState.toLowerCase();
    
    return allActivities.filter(activity => {
        // Match activity.category (e.g., "Numbers") against the categoryConfig.name ("Numbers") or category.id ("numbers")
        const activityCategoryNormalized = activity.category.toLowerCase();
        const categoryConfigNameNormalized = categoryConfig?.name.toLowerCase();
        
        const categoryMatch = categoryConfig ? 
            (activityCategoryNormalized === categoryConfigNameNormalized || activityCategoryNormalized === categoryConfig.id.toLowerCase()) :
            activityCategoryNormalized === resolvedCategoryIdentifier;

        return categoryMatch &&
               (activity.ageGroups.includes(kidProfile.ageGroup as AgeGroup) || activity.ageGroups.length === 0 /* Consider activities for all ages if no specific match */) && 
               activity.status === ActivityStatus.Approved;
      }
    );
  }, [allActivities, categoryConfig, categoryNameFromState, kidProfile.ageGroup]);

  const handleActivityClick = (activity: Activity) => {
    // V8 Change: Add explicit console.warn for debugging
    if (activity.view !== undefined && View[activity.view] !== undefined) {
      const path = `/${View[activity.view].toString().toLowerCase()}`;
      setViewWithPath(activity.view, path, { state: { activityName: activity.name, activityId: activity.id } });
    } else {
      console.warn(
        `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
        `has an invalid or undefined 'view' property (value: ${activity.view}). ` +
        `Ensure 'view' is a valid key in the 'View' enum in types.ts and correctly assigned in constants.ts. ` +
        `Navigating to placeholder.`
      );
      setViewWithPath(View.ActivityPlaceholder, `/activityplaceholder`, { state: { activityName: activity.name, activityId: activity.id } });
    }
  };
  
  const headerBgGradient = categoryColorFromState
    .replace('hover:', '')
    .replace('bg-', 'from-')
    .replace('-500', '-400') 
    .replace('-400', '-300'); 
  const toBgGradient = categoryColorFromState
    .replace('hover:', '')
    .replace('bg-', 'to-')
    .replace('-500', '-600') 
    .replace('-400', '-500');


  return (
    <div className={`p-4 pt-6 md:p-6 min-h-full bg-gradient-to-br ${headerBgGradient} ${toBgGradient} text-white`}>
      <div className="flex items-center mb-6">
        <IconButton
            icon={<ArrowLeftIcon className="h-6 w-6 text-white" />}
            onClick={goBack}
            ariaLabel="Go back to categories"
            className="mr-2 !p-1 hover:bg-white/20 active:bg-white/30"
        />
        <h1 className="text-3xl sm:text-4xl font-bold font-display">{categoryNameFromState} Adventures!</h1>
      </div>

      {categoryActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {categoryActivities.map(activity => {
            const IconComponent = activity.icon;
            const activityCardColor = activity.color || 'bg-sky-500'; 
            return(
            <Card 
              key={activity.id} 
              onClick={() => handleActivityClick(activity)}
              className={`${activityCardColor.replace('bg-','!bg-')} text-white !p-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out flex items-center space-x-3`}
            >
              <IconComponent className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold font-kidFriendly leading-tight">{activity.name}</h2>
                {activity.activityContent?.description && <p className="text-xs sm:text-sm opacity-80 line-clamp-2">{activity.activityContent.description}</p>}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-1 ${activity.difficulty === DifficultyLevel.Easy ? 'bg-green-400/80' : activity.difficulty === DifficultyLevel.Medium ? 'bg-yellow-400/80 text-black' : 'bg-red-400/80'}`}>
                    {activity.difficulty || DifficultyLevel.Easy}
                </span>
                {activity.isPremium && <span className="ml-1 text-[10px] bg-purple-400/80 px-1.5 py-0.5 rounded-full">Pro</span>}
              </div>
            </Card>
          )})}
        </div>
      ) : (
        <Card className="text-center py-10 !bg-white/20 !backdrop-blur-sm">
          <PuzzlePieceIcon className="h-16 w-16 text-white/70 mx-auto mb-4" />
          <p className="font-semibold text-lg">No activities found in {categoryNameFromState} for {kidProfile.name}'s age group right now.</p>
          <p className="text-sm mt-1 opacity-90">Try exploring other categories or check back soon!</p>
        </Card>
      )}
    </div>
  );
};

export default CategoryActivitiesScreen;