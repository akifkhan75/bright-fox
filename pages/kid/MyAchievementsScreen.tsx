import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, ImageBackground } from 'react-native';
import { AppContext } from '../../App';
import { UserRole, Badge } from '../../types';
import { BADGE_DEFINITIONS } from '../../constants';
import Card from '../../components/Card';
// import StarIcon from '../../assets/icons/StarIcon';
// import ShieldCheckIcon from '../../assets/icons/ShieldCheckIcon';
// import AcademicCapIcon from '../../assets/icons/AcademicCapIcon';

const MyAchievementsScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.kidProfile || !context.kidProgress || context.appState.currentUserRole !== UserRole.Kid) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading achievements or not authorized...</Text>
      </View>
    );
  }

  const { kidProfile, kidProgress } = context;

  const earnedGeneralBadges: Badge[] = kidProgress.badgesEarned
    .map(badgeId => BADGE_DEFINITIONS.find(b => b.id === badgeId && !b.courseId))
    .filter(b => b !== undefined) as Badge[];
    
  const unearnedGeneralBadges: Badge[] = BADGE_DEFINITIONS.filter(bDef => !bDef.courseId && !kidProgress.badgesEarned.includes(bDef.id));

  const earnedCourseBadges: Badge[] = kidProgress.badgesEarned
    .map(badgeId => BADGE_DEFINITIONS.find(b => b.id === badgeId && b.courseId))
    .filter(b => b !== undefined) as Badge[];

  const unearnedCourseBadges: Badge[] = BADGE_DEFINITIONS.filter(bDef => bDef.courseId && !kidProgress.badgesEarned.includes(bDef.id));

  const xpToNextLevel = (kidProgress.level || 1) * 100; 
  const progressPercentage = Math.min(((kidProgress.xp || 0) / xpToNextLevel) * 100, 100);

  const BadgeDisplay: React.FC<{badge: Badge, earned: boolean}> = ({badge, earned}) => (
    <Card style={[styles.badgeCard, { backgroundColor: earned ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)' }]}>
      <Text style={[styles.badgeIcon, !earned && styles.grayscale]}>{badge.icon}</Text>
      <Text style={styles.badgeName}>{badge.name}</Text>
      <Text style={[styles.badgeDescription, { opacity: earned ? 0.8 : 0.6 }]}>
        {earned ? badge.description : badge.criteria}
      </Text>
    </Card>
  );

  const renderBadgeGrid = (badges: Badge[], earned: boolean) => (
    <FlatList
      data={badges}
      numColumns={3}
      columnWrapperStyle={styles.badgeGrid}
      renderItem={({ item }) => <BadgeDisplay badge={item} earned={earned} />}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );

  return (
    <ImageBackground 
      // source={require('../../assets/gradient-bg.png')} // Replace with your gradient image
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{kidProfile.avatar}</Text>
          </View>
          <Text style={styles.title}>My Achievements!</Text>
          <Text style={styles.subtitle}>Wow, {kidProfile.name}, look what you've done!</Text>
        </View>

        <Card style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level: {kidProgress.level || 1}</Text>
            {/* <AcademicCapIcon width={40} height={40} fill="#facc15" /> */}
            <Text>Icon</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View 
              style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.xpText}>{kidProgress.xp || 0} / {xpToNextLevel} XP to next level</Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Completion Badges!</Text>
          {earnedCourseBadges.length > 0 ? (
            renderBadgeGrid(earnedCourseBadges, true)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Complete courses to earn special badges! 🎓</Text>
            </Card>
          )}
          {unearnedCourseBadges.length > 0 && earnedCourseBadges.length > 0 && (
            <View style={styles.divider} />
          )}
          {unearnedCourseBadges.length > 0 && (
            <>
              <Text style={styles.unlockTitle}>Unlock these Course Badges:</Text>
              {renderBadgeGrid(unearnedCourseBadges, false)}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Badges!</Text>
          {earnedGeneralBadges.length > 0 ? (
            renderBadgeGrid(earnedGeneralBadges, true)
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No activity badges yet, but keep playing to earn some! 🎉</Text>
            </Card>
          )}
          {unearnedGeneralBadges.length > 0 && earnedGeneralBadges.length > 0 && (
            <View style={styles.divider} />
          )}
          {unearnedGeneralBadges.length > 0 && (
            <>
              <Text style={styles.unlockTitle}>Unlock these Activity Badges:</Text>
              {renderBadgeGrid(unearnedGeneralBadges, false)}
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  avatarContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  levelCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    // backdropFilter: 'blur(10px)',
    padding: 20,
    marginBottom: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  progressBarBackground: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  proggressBarFill: {
    height: '100%',
    backgroundColor: '#facc15',
    borderRadius: 10,
  },
  xpText: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    textAlign: 'right',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  badgeCard: {
    padding: 12,
    borderRadius: 8,
    margin: 4,
    flex: 1,
    maxWidth: '33%',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  badgeName: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  grayscale: {
    opacity: 0.7,
  },
  badgeGrid: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 16,
  },
  unlockTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    opacity: 0.9,
    marginTop: 12,
    marginBottom: 8,
  },
});

export default MyAchievementsScreen;