import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppContext } from '../App';
// import HeartIcon from './icons/HeartIcon'; // You'll need to create or import this icon

interface Emotion {
  name: string;
  emoji: string;
  color: string; // Background color
  textColor: string; // Text color
  ringColor: string; // Selected ring color
  affirmation: string;
}

const emotions: Emotion[] = [
  { name: 'Happy', emoji: '😊', color: '#facc15', textColor: 'black', ringColor: '#facc15', affirmation: "It's great to feel happy! Share your smile!" },
  { name: 'Sad', emoji: '😢', color: '#60a5fa', textColor: 'white', ringColor: '#60a5fa', affirmation: "It's okay to feel sad sometimes. Talk to someone you trust." },
  { name: 'Angry', emoji: '😠', color: '#ef4444', textColor: 'white', ringColor: '#ef4444', affirmation: "Feeling angry is normal. Take deep breaths to calm down." },
  { name: 'Excited', emoji: '🤩', color: '#fb923c', textColor: 'black', ringColor: '#fb923c', affirmation: "Woohoo! Excitement is a super fun feeling!" },
  { name: 'Calm', emoji: '😌', color: '#4ade80', textColor: 'white', ringColor: '#4ade80', affirmation: "Feeling calm and peaceful is wonderful." },
  { name: 'Surprised', emoji: '😮', color: '#a78bfa', textColor: 'white', ringColor: '#a78bfa', affirmation: "Wow, a surprise! How interesting!" },
];

const EmotionalLearningScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  const handleSelectEmotion = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <View style={styles.heartIconContainer}>
          {/* <HeartIcon style={styles.heartIcon} /> */}
        </View>
        <Text style={styles.title}>How Are You Feeling?</Text>
        <Text style={styles.subtitle}>
          It's okay to feel lots of different ways! Pick an emotion below.
        </Text>

        <View style={styles.emotionsGrid}>
          {emotions.map((emotion) => (
            <TouchableOpacity
              key={emotion.name}
              onPress={() => handleSelectEmotion(emotion)}
              style={[
                styles.emotionButton,
                { 
                  backgroundColor: emotion.color,
                  borderColor: selectedEmotion?.name === emotion.name ? emotion.ringColor : 'transparent',
                  borderWidth: selectedEmotion?.name === emotion.name ? 4 : 0,
                }
              ]}
            >
              <Text style={[styles.emoji, { color: emotion.textColor }]}>{emotion.emoji}</Text>
              <Text style={[styles.emotionName, { color: emotion.textColor }]}>{emotion.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedEmotion && (
          <Card style={[
            styles.affirmationCard, 
            { 
              backgroundColor: selectedEmotion.color,
            }
          ]}>
            <Text style={[styles.affirmationTitle, { color: selectedEmotion.textColor }]}>
              You're feeling {selectedEmotion.name.toLowerCase()} {selectedEmotion.emoji}
            </Text>
            <Text style={[styles.affirmationText, { color: selectedEmotion.textColor }]}>
              {selectedEmotion.affirmation}
            </Text>
          </Card>
        )}
        
        {selectedEmotion && (
          <Button 
            onPress={() => setSelectedEmotion(null)} 
            style={styles.resetButton}
            textStyle={styles.resetButtonText}
          >
            Pick Another Feeling
          </Button>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fdf2f8', // pink-50
    justifyContent: 'center',
  },
  card: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    alignItems: 'center',
  },
  heartIconContainer: {
    marginBottom: 16,
  },
  heartIcon: {
    width: 48,
    height: 48,
    color: '#ec4899', // pink-500
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#db2777', // pink-600
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#4b5563', // gray-600
    marginBottom: 24,
    textAlign: 'center',
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  emotionButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  emotionName: {
    fontWeight: '600',
    fontSize: 16,
  },
  affirmationCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  affirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 14,
  },
  resetButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#f9a8d4', // pink-300
    backgroundColor: 'transparent',
  },
  resetButtonText: {
    color: '#db2777', // pink-600
  },
});

export default EmotionalLearningScreen;