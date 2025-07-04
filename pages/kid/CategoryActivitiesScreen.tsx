import React, { useContext, useMemo } from 'react';
import { View as RNView, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../App';
import { View, UserRole, Activity, AgeGroup, ActivityStatus, DifficultyLevel } from '../../types'; 
import Card from '../../components/Card';
import { ArrowLeftIcon, PuzzlePieceIcon } from 'react-native-heroicons/solid'; 
import IconButton from '../../components/IconButton';
import { ACTIVITY_CATEGORIES_CONFIG } from '../../constants';

const CategoryActivitiesScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get categoryId from route params or navigation state
  const categoryIdFromParams = route.params?.categoryId;
  const categoryId = (route.params?.categoryId || categoryIdFromParams)?.toLowerCase();

  const categoryConfig = ACTIVITY_CATEGORIES_CONFIG.find(cat => cat.id.toLowerCase() === categoryId);
  
  // Use categoryConfig?.name for display name if available, otherwise fallback
  const categoryNameFromState = route.params?.categoryName || categoryConfig?.name || "Category";
  const categoryColorFromState = route.params?.categoryColor || categoryConfig?.color || "#6b7280"; // gray-500

  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid || !categoryId) {
    context?.setViewWithPath(View.KidHome, '/kidhome', { replace: true });
    return (
      <RNView style={styles.loadingContainer}>
        <Text>Loading activities or unauthorized...</Text>
      </RNView>
    );
  }

  const { kidProfile, allActivities, setViewWithPath, goBack } = context;

  const categoryActivities = useMemo(() => {
    const resolvedCategoryIdentifier = categoryConfig 
      ? categoryConfig.id.toLowerCase() 
      : categoryNameFromState.toLowerCase();
    
    return allActivities.filter(activity => {
      const activityCategoryNormalized = activity.category.toLowerCase();
      const categoryConfigNameNormalized = categoryConfig?.name.toLowerCase();
      
      const categoryMatch = categoryConfig 
        ? (activityCategoryNormalized === categoryConfigNameNormalized || 
           activityCategoryNormalized === categoryConfig.id.toLowerCase())
        : activityCategoryNormalized === resolvedCategoryIdentifier;

      return categoryMatch &&
             (activity.ageGroups.includes(kidProfile.ageGroup as AgeGroup) || 
             activity.ageGroups.length === 0) && 
             activity.status === ActivityStatus.Approved;
    });
  }, [allActivities, categoryConfig, categoryNameFromState, kidProfile.ageGroup]);

  const handleActivityClick = (activity: Activity) => {
    if (activity.view !== undefined && View[activity.view] !== undefined) {
      const path = `/${View[activity.view].toString().toLowerCase()}`;
      setViewWithPath(activity.view, path, { 
        state: { activityName: activity.name, activityId: activity.id } 
      });
    } else {
      console.warn(
        `Activity Navigation Warning: Activity "${activity.name}" (ID: ${activity.id}) ` +
        `has an invalid or undefined 'view' property (value: ${activity.view}). ` +
        `Ensure 'view' is a valid key in the 'View' enum in types.ts and correctly assigned in constants.ts. ` +
        `Navigating to placeholder.`
      );
      setViewWithPath(View.ActivityPlaceholder, `/activityplaceholder`, { 
        state: { activityName: activity.name, activityId: activity.id } 
      });
    }
  };

  // Create gradient colors based on category color
  const fromColor = categoryColorFromState.replace('#', '').toLowerCase();
  const toColor = categoryColorFromState.replace('#', '').toLowerCase(); // Simplified for RN

  return (
    <ImageBackground
      // source={require('../assets/gradient-bg.png')} // You should provide a gradient background image
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <RNView style={styles.headerContainer}>
          <IconButton
            icon={<ArrowLeftIcon size={24} color="white" />}
            onPress={goBack}
            ariaLabel="Go back to categories"
            style={styles.backButton}
          />
          <Text style={styles.title}>{categoryNameFromState} Adventures!</Text>
        </RNView>

        {categoryActivities.length > 0 ? (
          <RNView style={styles.activitiesGrid}>
            {categoryActivities.map(activity => {
              const IconComponent = activity.icon;
              const activityCardColor = activity.color || '#0ea5e9'; // sky-500
              
              return (
                <Card 
                  key={activity.id} 
                  onPress={() => handleActivityClick(activity)}
                  style={[styles.activityCard, { backgroundColor: activityCardColor }]}
                >
                  <RNView style={styles.cardContent}>
                    <IconComponent size={40} color="white" />
                    <RNView style={styles.cardTextContainer}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                      {activity.activityContent?.description && (
                        <Text 
                          style={styles.activityDescription}
                          numberOfLines={2}
                        >
                          {activity.activityContent.description}
                        </Text>
                      )}
                      <RNView style={styles.tagsContainer}>
                        <RNView style={[
                          styles.difficultyTag,
                          activity.difficulty === DifficultyLevel.Easy 
                            ? styles.easyTag 
                            : activity.difficulty === DifficultyLevel.Medium 
                              ? styles.mediumTag 
                              : styles.hardTag
                        ]}>
                          <Text style={[
                            styles.tagText,
                            activity.difficulty === DifficultyLevel.Medium && styles.mediumTagText
                          ]}>
                            {activity.difficulty || DifficultyLevel.Easy}
                          </Text>
                        </RNView>
                        {activity.isPremium && (
                          <RNView style={styles.premiumTag}>
                            <Text style={styles.tagText}>Pro</Text>
                          </RNView>
                        )}
                      </RNView>
                    </RNView>
                  </RNView>
                </Card>
              );
            })}
          </RNView>
        ) : (
          <Card style={styles.emptyStateCard}>
            <PuzzlePieceIcon size={64} color="rgba(255,255,255,0.7)" />
            <Text style={styles.emptyStateText}>
              No activities found in {categoryNameFromState} for {kidProfile.name}'s age group right now.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Try exploring other categories or check back soon!
            </Text>
          </Card>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 24,
    minHeight: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'KidFriendly', // Make sure to include this font
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  activityCard: {
    width: '48%', // Approximately 2 columns
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  difficultyTag: {
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  easyTag: {
    backgroundColor: 'rgba(74, 222, 128, 0.8)', // green-400
  },
  mediumTag: {
    backgroundColor: 'rgba(250, 204, 21, 0.8)', // yellow-400
  },
  hardTag: {
    backgroundColor: 'rgba(248, 113, 113, 0.8)', // red-400
  },
  premiumTag: {
    backgroundColor: 'rgba(192, 132, 252, 0.8)', // purple-400
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    color: 'white',
  },
  mediumTagText: {
    color: 'black',
  },
  emptyStateCard: {
    padding: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // backdropFilter: 'blur(10px)',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CategoryActivitiesScreen;