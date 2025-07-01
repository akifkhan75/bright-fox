import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole, ActivityCategory } from '../types';
import Card from '../components/Card';
import { ACTIVITY_CATEGORIES_CONFIG } from '../constants';

const KidHomeScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid) {
    // App.tsx routing logic should prevent unauthorized access or missing profiles.
    // If it reaches here, it implies context is ready for kid home.
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading kid's home...</Text>
      </View>
    );
  }

  const { kidProfile, setViewWithPath } = context;

  const handleCategoryClick = (category: ActivityCategory) => {
    setViewWithPath(
      ViewType.CategoryActivitiesScreen, 
      `/categoryactivities/${category.id.toLowerCase()}`, 
      { 
        state: { 
          categoryName: category.name, 
          categoryColor: category.color, 
          categoryId: category.id.toLowerCase() 
        } 
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.ageBadge}>
          <Text style={styles.ageBadgeText}>
            For ages: {kidProfile.ageGroup || 'All'} 
            {kidProfile.currentLearningLevel && ` | ${kidProfile.currentLearningLevel} Level`}
          </Text>
        </View>
        <Text style={styles.title}>What do you want to do?</Text>
      </View>

      <View style={styles.categoriesGrid}>
        {ACTIVITY_CATEGORIES_CONFIG.map((category) => {
          const IconComponent = category.icon;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryClick(category)}
              style={[
                styles.categoryButton,
                { backgroundColor: category.color }
              ]}
              accessibilityLabel={category.name}
            >
              <IconComponent style={styles.categoryIcon} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {ACTIVITY_CATEGORIES_CONFIG.length === 0 && (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyCardContent}>
            <Text style={styles.emptyCardText}>
              No activity categories available right now.
            </Text>
            <Text style={styles.emptyCardSubtext}>
              Please check back later!
            </Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f9ff', // sky-50
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  ageBadge: {
    backgroundColor: '#dcfce7', // green-100
    borderWidth: 1,
    borderColor: '#86efac', // green-300
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  ageBadgeText: {
    color: '#16a34a', // green-600
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0369a1', // sky-700
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  categoryButton: {
    width: '47%', // Approximately 2 columns
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
    color: 'white',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  emptyCard: {
    marginTop: 32,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCardContent: {
    alignItems: 'center',
  },
  emptyCardText: {
    color: '#4b5563', // gray-600
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyCardSubtext: {
    color: '#6b7280', // gray-500
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default KidHomeScreen;