import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
// import ChartBarIcon from '../../assets/icons/ChartBarIcon';
// import UsersIcon from '../../assets/icons/UsersIcon';
// import ShieldExclamationIcon from '../../assets/icons/ShieldExclamationIcon';

const CompareProgressScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Parent) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied or loading...</Text>
      </View>
    );
  }

  const { kidProfile, kidProgress } = context;

  // Mock data for comparison
  const ageGroupAverageSkills = {
    'counting_to_10': 0.75, // 75% of kids in this age group master this
    'recognizing_shapes': 0.85,
    'simple_addition': 0.40,
    'reading_cvc_words': 0.55,
  };
  const kidSkills = kidProgress?.skillsMastered || {};

  const formatSkillName = (skillId: string) => {
    return skillId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            {/* <ChartBarIcon width={32} height={32} fill="#ffffff" /> */}
            <Text>Chart Icon</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Compare {kidProfile.name}'s Progress</Text>
            <Text style={styles.headerSubtitle}>Anonymized comparison with age-group averages.</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.skillsCard}>
        <Text style={styles.skillsTitle}>Skill Comparison (Mock Data)</Text>
        <View style={styles.skillsContainer}>
          {Object.entries(ageGroupAverageSkills).map(([skillId, avgMastery]) => {
            const kidMastered = kidSkills[skillId.replace(/\s+/g, '_').toLowerCase()] || false;
            const skillName = formatSkillName(skillId);
            
            return (
              <View key={skillId} style={styles.skillItem}>
                <Text style={styles.skillName}>{skillName}</Text>
                <View style={styles.progressBarsContainer}>
                  <View style={styles.progressBarContainer}>
                    <Text style={styles.progressLabel}>{kidProfile.name}'s Progress</Text>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          kidMastered ? styles.progressBarComplete : styles.progressBarIncomplete,
                          { width: kidMastered ? '100%' : '10%' }
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <Text style={styles.progressLabel}>Age Group Average ({kidProfile.ageGroup} yrs)</Text>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[styles.progressBarFill, styles.progressBarAverage, { width: `${avgMastery * 100}%` }]}
                      />
                    </View>
                  </View>
                </View>
                {kidMastered && (
                  <Text style={styles.masteredText}>Great job, {kidProfile.name} has mastered this!</Text>
                )}
              </View>
            );
          })}
        </View>
      </Card>
      
      <Card style={styles.noteCard}>
        <View style={styles.noteContent}>
          {/* <ShieldExclamationIcon width={40} height={40} fill="#6366f1" /> */}
          <Text>Icon</Text>
          <View style={styles.noteTextContainer}>
            <Text style={styles.noteTitle}>Important Note on Comparisons</Text>
            <Text style={styles.noteText}>
              This comparison is based on anonymized data from other users in the same age group and should be used as a general guide, not a definitive measure. Every child learns at their own pace! Focus on celebrating {kidProfile.name}'s unique journey and effort.
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  deniedContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#7c3aed',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  skillsCard: {
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  skillsContainer: {
    gap: 16,
  },
  skillItem: {
    gap: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  progressBarsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 7,
  },
  progressBarComplete: {
    backgroundColor: '#10b981',
  },
  progressBarIncomplete: {
    backgroundColor: '#a7f3d0',
  },
  progressBarAverage: {
    backgroundColor: '#0ea5e9',
  },
  masteredText: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 4,
  },
  noteCard: {
    backgroundColor: '#e0e7ff',
    borderColor: '#c7d2fe',
    borderWidth: 1,
  },
  noteContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#4f46e5',
  },
});

export default CompareProgressScreen;