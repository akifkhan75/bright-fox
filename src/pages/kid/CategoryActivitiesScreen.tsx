
import React, { useContext, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { AppViewEnum, UserRole, Activity, AgeGroup, LessonContentType, ActivityStatus, DifficultyLevel } from '../../types'; 
import Card from '../../components/Card';
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; 
import IconButton from '../../components/IconButton';
import { ACTIVITY_CATEGORIES_CONFIG, ACTIVITIES_CONFIG as FRONTEND_ACTIVITIES_CONFIG } from '../../constants';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

// Helper to map string icon names to actual HeroIcon components (if they were ever components)
// For RN, this will primarily be a pass-through if icon names are already for Ionicons/etc.
const getIconNameFromString = (iconName: string | undefined): string => {
    // Assuming iconName is already the correct string for Ionicons
    return iconName || 'shapes-outline'; // Default Ionicons name
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
    context?.setViewWithPath(AppViewEnum.KidHome, 'KidHome', { replace: true }); // Use RN route name
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Loading activities or unauthorized...</Text></View>; // Basic RN View
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
    if (activity.view !== undefined) {
      const viewName = AppViewEnum[activity.view]; // Get string name like "CountingGameScreen" from enum number
      if (viewName) {
        // For React Native, the 'path' is the route name.
        const routeName = viewName; // e.g., "CountingGameScreen"
        setViewWithPath(activity.view, routeName, { state: { activityName: activity.name, activityId: activity.id } });
      } else {
        console.warn(
          `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
          `has an AppViewEnum value (${activity.view}) that doesn't map to a string name. ` +
          `Navigating to placeholder.`
        );
        setViewWithPath(AppViewEnum.ActivityPlaceholder, 'ActivityPlaceholder', { state: { activityName: activity.name, activityId: activity.id } });
      }
    } else {
      console.warn(
        `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
        `has an undefined 'view' property. Navigating to placeholder.`
      );
      setViewWithPath(AppViewEnum.ActivityPlaceholder, 'ActivityPlaceholder', { state: { activityName: activity.name, activityId: activity.id } });
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


  // RN Components
  const { View, Text, StyleSheet, ScrollView, TouchableOpacity } = require('react-native');
  const { LinearGradient } = require('expo-linear-gradient'); // For gradient

  const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1, padding: 16, paddingTop: 24 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    backButton: { marginRight: 8, padding: 4 }, // Adjusted for RN IconButton
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', fontFamily: 'FredokaOne-Regular' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    activityCardTouchable: { width: '48%', marginBottom: 16},
    activityCard: {
        padding: 12, borderRadius: 12, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
        flexDirection: 'row', alignItems: 'center', 
    },
    iconContainer: { marginRight: 10 },
    activityIcon: { width: 40, height: 40 }, // Size for Ionicons
    textContainer: { flex: 1 },
    activityName: { fontSize: 16, fontWeight: 'bold', color: 'white', fontFamily: 'Baloo2-Bold' },
    activityDescription: { fontSize: 10, color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap' },
    badgeContainer: { flexDirection: 'row', marginTop: 4 },
    badge: { fontSize: 9, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginRight: 4, overflow: 'hidden' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyIcon: { marginBottom: 16 },
    emptyText: { fontSize: 16, fontWeight: '600', color: 'white', textAlign: 'center'},
    emptySubText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4},
  });

  // Simplified color parsing for RN
  const parseColor = (tailwindColor: string) => {
    if (tailwindColor.includes('orange')) return '#FDBA74';
    if (tailwindColor.includes('sky')) return '#38BDF8';
    if (tailwindColor.includes('green')) return '#4ADE80';
    if (tailwindColor.includes('purple')) return '#A78BFA';
    if (tailwindColor.includes('rose')) return '#FB7185';
    if (tailwindColor.includes('lime')) return '#A3E635';
    if (tailwindColor.includes('teal')) return '#2DD4BF';
    if (tailwindColor.includes('indigo')) return '#818CF8';
    if (tailwindColor.includes('slate')) return '#94A3B8';
    return '#CCCCCC'; // Default
  };
  const gradientColors = [parseColor(headerBgGradient), parseColor(toBgGradient)];


  return (
    <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.gradient}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{categoryNameFromState} Adventures!</Text>
                </View>

                {categoryActivities.length > 0 ? (
                    <View style={styles.grid}>
                    {categoryActivities.map(activity => {
                        const iconName = getIconNameFromString(activity.icon);
                        const cardBgColor = parseColor(activity.color || 'bg-sky-500');
                        
                        return(
                        <TouchableOpacity key={activity.id} style={styles.activityCardTouchable} onPress={() => handleActivityClick(activity)}>
                            <View style={[styles.activityCard, {backgroundColor: cardBgColor}]}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={iconName as any} size={styles.activityIcon.width} color="white" />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.activityName}>{activity.name}</Text>
                                    {activity.activityContent?.description && <Text style={styles.activityDescription} numberOfLines={2}>{activity.activityContent.description}</Text>}
                                    <View style={styles.badgeContainer}>
                                        <Text style={[styles.badge, { backgroundColor: activity.difficulty === DifficultyLevel.Easy ? '#34D399' : activity.difficulty === DifficultyLevel.Medium ? '#FBBF24' : '#F87171', color: activity.difficulty === DifficultyLevel.Medium? 'black':'white'}]}>
                                            {activity.difficulty || DifficultyLevel.Easy}
                                        </Text>
                                        {activity.isPremium && <Text style={[styles.badge, {backgroundColor: '#A78BFA', color: 'white'}]}>Pro</Text>}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        )})}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="extension-puzzle-outline" size={64} color="rgba(255,255,255,0.7)" style={styles.emptyIcon} />
                        <Text style={styles.emptyText}>No activities found in {categoryNameFromState} for {kidProfile.name}'s age group right now.</Text>
                        <Text style={styles.emptySubText}>Try exploring other categories or check back soon!</Text>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    </View>
  );
};

export default CategoryActivitiesScreen;
