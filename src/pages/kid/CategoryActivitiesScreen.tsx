import React, { useContext, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from '../../App';
import { AppViewEnum, UserRole, Activity, AgeGroup, ActivityStatus, DifficultyLevel } from '../../types';
import { ACTIVITY_CATEGORIES_CONFIG } from '../../constants';

const getIconNameFromString = (iconName: string | undefined): string => {
  return iconName || 'shapes-outline'; // Default Ionicons name
};

const parseColor = (tailwindColor: string) => {
  const colorMap: Record<string, string> = {
    orange: '#FDBA74',
    sky: '#38BDF8',
    green: '#4ADE80',
    purple: '#A78BFA',
    rose: '#FB7185',
    lime: '#A3E635',
    teal: '#2DD4BF',
    indigo: '#818CF8',
    slate: '#94A3B8'
  };
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (tailwindColor.includes(key)) return value;
  }
  return '#CCCCCC'; // Default
};

const CategoryActivitiesScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  
  const categoryIdUrl = route.params?.categoryId?.toLowerCase();
  const categoryConfig = ACTIVITY_CATEGORIES_CONFIG.find(cat => cat.id.toLowerCase() === categoryIdUrl);
  
  const categoryNameFromState = route.params?.categoryName || categoryConfig?.name || "Category";
  const categoryColorFromState = route.params?.categoryColor || categoryConfig?.color || "bg-gray-500";

  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid || !categoryIdUrl) {
    context?.setViewWithPath(AppViewEnum.KidHome, 'KidHome', { replace: true });
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading activities or unauthorized...</Text>
      </View>
    );
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
    });
  }, [allActivities, categoryConfig, kidProfile.ageGroup]);

  const handleActivityClick = (activity: Activity) => {
    if (activity.view !== undefined) {
      const viewName = AppViewEnum[activity.view];
      if (viewName) {
        const routeName = viewName;
        setViewWithPath(activity.view, routeName, { 
          activityName: activity.name, 
          activityId: activity.id 
        });
      } else {
        console.warn(
          `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
          `has an AppViewEnum value (${activity.view}) that doesn't map to a string name.`
        );
        setViewWithPath(AppViewEnum.ActivityPlaceholder, 'ActivityPlaceholder', { 
          activityName: activity.name, 
          activityId: activity.id 
        });
      }
    } else {
      console.warn(
        `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
        `has an undefined 'view' property.`
      );
      setViewWithPath(AppViewEnum.ActivityPlaceholder, 'ActivityPlaceholder', { 
        activityName: activity.name, 
        activityId: activity.id 
      });
    }
  };

  const gradientColors = [
    parseColor(categoryColorFromState.replace('bg-', 'from-')),
    parseColor(categoryColorFromState.replace('bg-', 'to-').replace('-500', '-600'))
  ];

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={gradientColors} 
        style={styles.gradient}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                
                return (
                  <TouchableOpacity 
                    key={activity.id} 
                    style={styles.activityCardTouchable} 
                    onPress={() => handleActivityClick(activity)}
                  >
                    <View style={[styles.activityCard, {backgroundColor: cardBgColor}]}>
                      <View style={styles.iconContainer}>
                        <Ionicons 
                          name={iconName as any} 
                          size={styles.activityIcon.width} 
                          color="white" 
                        />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.activityName}>{activity.name}</Text>
                        {activity.activityContent?.description && (
                          <Text 
                            style={styles.activityDescription} 
                            numberOfLines={2}
                          >
                            {activity.activityContent.description}
                          </Text>
                        )}
                        <View style={styles.badgeContainer}>
                          <Text style={[
                            styles.badge, 
                            { 
                              backgroundColor: activity.difficulty === DifficultyLevel.Easy 
                                ? '#34D399' 
                                : activity.difficulty === DifficultyLevel.Medium 
                                  ? '#FBBF24' 
                                  : '#F87171',
                              color: activity.difficulty === DifficultyLevel.Medium ? 'black' : 'white'
                            }
                          ]}>
                            {activity.difficulty || DifficultyLevel.Easy}
                          </Text>
                          {activity.isPremium && (
                            <Text style={[styles.badge, {backgroundColor: '#A78BFA', color: 'white'}]}>
                              Pro
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="extension-puzzle-outline" 
                size={64} 
                color="rgba(255,255,255,0.7)" 
                style={styles.emptyIcon} 
              />
              <Text style={styles.emptyText}>
                No activities found in {categoryNameFromState} for {kidProfile.name}'s age group right now.
              </Text>
              <Text style={styles.emptySubText}>
                Try exploring other categories or check back soon!
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'FredokaOne-Regular',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCardTouchable: {
    width: '48%',
    marginBottom: 16,
  },
  activityCard: {
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Baloo2-Bold',
  },
  activityDescription: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    flexWrap: 'wrap',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default CategoryActivitiesScreen;