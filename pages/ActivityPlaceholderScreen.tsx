import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Card from '../components/Card'; // Make sure this is a React Native component
// import PuzzlePieceIcon from '../assets/icons/PuzzlePieceIcon'; // You'll need to provide this icon

interface ActivityPlaceholderScreenProps {
  activityName?: string;
}

const ActivityPlaceholderScreen: React.FC<ActivityPlaceholderScreenProps> = ({ activityName: propActivityName }) => {
  const activityName = propActivityName || "Awesome Activity";

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Text>Icon</Text>
          {/* <PuzzlePieceIcon width={80} height={80} fill="#818cf8" /> */}
        </View>
        <Text style={styles.title}>{activityName}</Text>
        <Text style={styles.subtitle}>
          This fun activity is under construction! 🚧
        </Text>
        <Text style={styles.description}>
          Our little helpers are working hard to bring you exciting new games and learning experiences. Check back soon!
        </Text>
        <Image
          source={{ uri: 'https://picsum.photos/seed/constructionfox/300/200' }}
          style={styles.image}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e7ff', // indigo-200 equivalent
    // For gradient background, you might need a separate package like react-native-linear-gradient
  },
  card: {
    maxWidth: 448, // max-w-md equivalent
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4f46e5', // indigo-600
    marginBottom: 12,
    textAlign: 'center',
    // fontFamily: 'YourDisplayFont', // Add your custom font if needed
  },
  subtitle: {
    color: '#4b5563', // gray-600
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    color: '#6b7280', // gray-500
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    marginTop: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: 300,
    height: 200,
    alignSelf: 'center',
  },
});

export default ActivityPlaceholderScreen;