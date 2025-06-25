
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { AppContext } from '../../App'; // Adjust path if necessary
import { AppViewEnum, UserRole, ActivityCategoryConfig } from '../types'; // Renamed View, changed ActivityCategory
import Card from '../components/Card'; // Assuming Card is converted
import { ACTIVITY_CATEGORIES_CONFIG } from '../constants'; // Ensure icons are RN compatible
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const KidHomeScreen: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Kid) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading kid's home...</Text>
      </View>
    );
  }

  const { kidProfile, setViewWithPath } = context;

  const handleCategoryClick = (category: ActivityCategoryConfig) => {
    setViewWithPath(AppViewEnum.CategoryActivitiesScreen, 'CategoryActivitiesScreen', { 
        categoryId: category.id.toLowerCase(), 
        categoryName: category.name, 
        categoryColor: category.color,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.profileInfoChip}>
            <Text style={styles.profileInfoText}>
                For ages: {kidProfile.ageGroup || 'All'} {kidProfile.currentLearningLevel && `| ${kidProfile.currentLearningLevel} Level`}
            </Text>
        </View>
        <Text style={[styles.title, styles.fontDisplay]}>What do you want to do?</Text>
      </View>

      <View style={styles.grid}>
        {ACTIVITY_CATEGORIES_CONFIG.map((category, index) => {
          let tileBgColor = '#CCCCCC'; // Default
          if (category.color.includes('orange')) tileBgColor = '#FDBA74'; // orange-400
          else if (category.color.includes('sky')) tileBgColor = '#38BDF8'; // sky-500
          else if (category.color.includes('green')) tileBgColor = '#4ADE80'; // green-500
          else if (category.color.includes('purple')) tileBgColor = '#A78BFA'; // purple-500
          else if (category.color.includes('rose')) tileBgColor = '#FB7185'; // rose-400
          else if (category.color.includes('lime')) tileBgColor = '#A3E635'; // lime-500
          else if (category.color.includes('teal')) tileBgColor = '#2DD4BF'; // teal-400
          else if (category.color.includes('indigo')) tileBgColor = '#818CF8'; // indigo-400
          else if (category.color.includes('slate')) tileBgColor = '#94A3B8'; // slate-400

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.tile, { backgroundColor: tileBgColor } , (index % 2 === 0) ? styles.tileLeft : styles.tileRight]}
              onPress={() => handleCategoryClick(category)}
              activeOpacity={0.7}
            >
              <Ionicons name={category.icon as any} size={styles.icon.width} color="white" />
              <Text style={[styles.tileText, styles.fontKidFriendly]}>{category.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {ACTIVITY_CATEGORIES_CONFIG.length === 0 && (
        <Card style={styles.emptyCard}>
          <View>
            <Text style={styles.emptyText}>No activity categories available.</Text>
            <Text style={styles.emptySubText}>Please check back later!</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE', 
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 24 : 16, 
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  profileInfoChip: {
    backgroundColor: '#BAE6FD', 
    borderColor: '#7DD3FC', 
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  profileInfoText: {
    color: '#0369A1', 
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#0369A1', 
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%', 
    aspectRatio: 1, 
    borderRadius: 16, 
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  tileLeft: {},
  tileRight: {},
  icon: { 
    width: 56, 
    height: 56,
    marginBottom: 12,
  },
  tileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  emptyCard: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    padding: 20,
  },
  emptyText: {
    color: '#4B5563', 
    fontWeight: '600',
    fontSize: 18,
  },
  emptySubText: {
    color: '#6B7280', 
    fontSize: 14,
    marginTop: 4,
  },
  fontDisplay: {
    fontFamily: 'FredokaOne-Regular', 
  },
  fontKidFriendly: {
    fontFamily: 'Baloo2-Bold', 
  }
});

export default KidHomeScreen;
