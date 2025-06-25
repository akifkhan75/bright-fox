
import React, { useContext, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { View, UserRole, Activity, AgeGroup, LessonContentType, ActivityStatus, DifficultyLevel } from '../../types'; 
import Card from '../../components/Card';
import { ArrowLeftIcon, PuzzlePieceIcon, CalculatorIcon, BookOpenIcon, PaintBrushIcon, QuestionMarkCircleIcon, HeartIcon, BeakerIcon, SparklesIcon, MagnifyingGlassIcon, CubeIcon, LightBulbIcon, PencilIcon, AdjustmentsHorizontalIcon, Bars3BottomLeftIcon, EyeIcon, MusicalNoteIcon, BuildingLibraryIcon, ChatBubbleLeftRightIcon, Squares2X2Icon, LinkIcon, MapIcon, SunIcon, MoonIcon, ReceiptPercentIcon, AcademicCapIcon, GlobeAltIcon, CpuChipIcon } from '@heroicons/react/24/solid'; 
import IconButton from '../../components/IconButton';
import { ACTIVITY_CATEGORIES_CONFIG, ACTIVITIES_CONFIG as FRONTEND_ACTIVITIES_CONFIG } from '../../constants'; // Import frontend constants for icon fallback

// Helper to map string icon names to actual HeroIcon components
const getIconComponentFromString = (iconName: string | undefined): React.ElementType => {
    if (!iconName) return PuzzlePieceIcon; // Default
    switch (iconName) {
        case 'AcademicCapIcon': return AcademicCapIcon;
        case 'CalculatorIcon': return CalculatorIcon;
        case 'BookOpenIcon': return BookOpenIcon;
        case 'PuzzlePieceIcon': return PuzzlePieceIcon;
        case 'PaintBrushIcon': return PaintBrushIcon;
        case 'QuestionMarkCircleIcon': return QuestionMarkCircleIcon;
        case 'HeartIcon': return HeartIcon;
        case 'BeakerIcon': return BeakerIcon;
        case 'SparklesIcon': return SparklesIcon;
        case 'MagnifyingGlassIcon': return MagnifyingGlassIcon;
        case 'CubeIcon': return CubeIcon;
        case 'LightBulbIcon': return LightBulbIcon;
        case 'PencilIcon': return PencilIcon;
        case 'AdjustmentsHorizontalIcon': return AdjustmentsHorizontalIcon;
        case 'Bars3BottomLeftIcon': return Bars3BottomLeftIcon;
        case 'EyeIcon': return EyeIcon;
        case 'MusicalNoteIcon': return MusicalNoteIcon;
        case 'BuildingLibraryIcon': return BuildingLibraryIcon;
        case 'ChatBubbleLeftRightIcon': return ChatBubbleLeftRightIcon;
        case 'Squares2X2Icon': return Squares2X2Icon;
        case 'LinkIcon': return LinkIcon;
        case 'MapIcon': return MapIcon;
        case 'SunIcon': return SunIcon;
        case 'MoonIcon': return MoonIcon;
        case 'ReceiptPercentIcon': return ReceiptPercentIcon;
        case 'GlobeAltIcon': return GlobeAltIcon;
        case 'CpuChipIcon': return CpuChipIcon;
        // Add other icons from ACTIVITY_CATEGORIES_CONFIG if needed
        default: return PuzzlePieceIcon;
    }
};


const CategoryActivitiesScreen: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const { categoryId: categoryIdFromParams } = useParams<{ categoryId: string }>();

  const categoryIdUrl = (location.state?.categoryId as string || categoryIdFromParams)?.toLowerCase();
  const categoryConfig = ACTIVITY_CATEGORIES_CONFIG.find(cat => cat.id.toLowerCase() === categoryIdUrl);
  
  const categoryNameFromState = location.state?.categoryName as string || categoryConfig?.name || "Category";
  const categoryColorFromState = location.state?.categoryColor as string || categoryConfig?.color || "bg-gray-500";
  
  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid || !categoryIdUrl) {
    context?.setViewWithPath(View.KidHome, '/kidhome', { replace: true });
    return <div className="p-4 text-center">Loading activities or unauthorized...</div>;
  }

  const { kidProfile, allActivities, setViewWithPath, goBack } = context;

  const categoryActivities = useMemo(() => {
    if (!categoryConfig) return []; 

    return allActivities.filter(activity => {
        const activityCategoryNormalized = activity.category.toLowerCase();
        const targetCategoryIdNormalized = categoryConfig.id.toLowerCase(); 

        const categoryMatch = activityCategoryNormalized === targetCategoryIdNormalized;
        
        const ageMatch = kidProfile.ageGroup === null || 
                         activity.ageGroups.length === 0 || 
                         activity.ageGroups.includes(kidProfile.ageGroup as AgeGroup); 

        const statusMatch = activity.status === ActivityStatus.Approved;

        return categoryMatch && ageMatch && statusMatch;
      }
    );
  }, [allActivities, categoryConfig, kidProfile.ageGroup]);

  const handleActivityClick = (activity: Activity) => {
    const viewString = activity.view as unknown as string;
    
    const viewEnumKey = Object.keys(View).find(key => {
        const enumValue = (View as any)[key];
        // We are looking for string keys whose values are numbers (the actual enum members)
        // and whose lowercase string key matches the viewString from activity data.
        if (typeof enumValue === 'number') { // This implies `key` is a string name of the enum member
            return key.toLowerCase() === viewString?.toLowerCase();
        }
        return false;
    });

    if (viewEnumKey) { // viewEnumKey is the string name of the enum, e.g., "CountingGameScreen"
        const viewEnumValue = (View as any)[viewEnumKey]; // Numeric value of the enum
        const path = `/${viewEnumKey.toLowerCase()}`;     // Path, e.g., "/countinggamescreen"
        setViewWithPath(viewEnumValue, path, { state: { activityName: activity.name, activityId: activity.id } });
    } else {
      console.warn(
        `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
        `has a 'view' property ("${viewString}") that does not map to any key in the 'View' enum. ` +
        `Ensure 'view' strings in backend data match 'View' enum keys (case-insensitive). ` +
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
            let IconComponent: React.ElementType = PuzzlePieceIcon; 
            if (typeof activity.icon === 'function') { 
                IconComponent = activity.icon;
            } else if (typeof (activity as any).iconName === 'string') { 
                IconComponent = getIconComponentFromString((activity as any).iconName);
            } else { 
                const frontendActivityDef = FRONTEND_ACTIVITIES_CONFIG.find(fa => fa.id === activity.id);
                if (frontendActivityDef && typeof frontendActivityDef.icon === 'function') {
                    IconComponent = frontendActivityDef.icon;
                }
            }
            
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
          <p className="text-xs mt-2 opacity-70">(If you're testing, ensure the backend activities database is fully populated, activities are 'Approved', and the kid's age group is set correctly.)</p>
        </Card>
      )}
    </div>
  );
};

export default CategoryActivitiesScreen;
