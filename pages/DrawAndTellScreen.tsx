import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { AppContext } from '../App';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateStoryFromPrompt } from '../services/geminiService';
import { StoryOutput, AgeGroup } from '../types';
// import { SparklesIcon, PencilIcon } from './icons'; // You'll need to create or import these icons

// Simple Drawing Canvas (Placeholder)
const DrawingCanvas: React.FC<{ onDrawEnd: (description: string) => void }> = ({ onDrawEnd }) => {
  const [description, setDescription] = useState('');

  const handleSubmitDrawing = () => {
    if (description.trim()) {
      onDrawEnd(description.trim());
    } else {
      Alert.alert("Oops!", "Please describe your drawing or draw something!");
    }
  };

  return (
    <View style={styles.canvasContainer}>
      {/* <PencilIcon style={styles.pencilIcon} /> */}
      <Text style={styles.canvasText}>
        Imagine you're drawing here!{'\n'}Then, describe your masterpiece below.
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="e.g., A happy sun with sunglasses"
        style={styles.drawingInput}
      />
      <Button 
        onPress={handleSubmitDrawing} 
        size="sm" 
        style={styles.drawingButton}
      >
        Done Drawing!
      </Button>
    </View>
  );
};

const mapAgeGroupForGemini = (ageGroup: AgeGroup | null): '3-5' | '6-8' | null => {
  if (!ageGroup) return null;
  switch (ageGroup) {
    case '2-4':
      return '3-5';
    case '5-7':
      return '6-8'; 
    case '8-10':
      return '6-8';
    default:
      return null;
  }
};

const DrawAndTellScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { kidProfile } = context;

  const [drawingDescription, setDrawingDescription] = useState<string | null>(null);
  const [story, setStory] = useState<StoryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrawingEnd = useCallback(async (description: string) => {
    setDrawingDescription(description);
    setIsLoading(true);
    setError(null);
    setStory(null);
    try {
      const mappedAgeGroup = mapAgeGroupForGemini(kidProfile.ageGroup);
      const generatedStory = await generateStoryFromPrompt(description, mappedAgeGroup);
      setStory(generatedStory);
    } catch (err) {
      console.error(err);
      setError("Oh no! The storyteller is a bit sleepy. Try again?");
    } finally {
      setIsLoading(false);
    }
  }, [kidProfile.ageGroup]);

  const resetActivity = () => {
    setDrawingDescription(null);
    setStory(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          {/* <SparklesIcon style={styles.sparklesIcon} /> */}
          <Text style={styles.title}>Draw & Tell Adventure!</Text>
        </View>
        
        {!story && !isLoading && (
          <>
            <Text style={styles.instructions}>
              First, draw a picture (or describe what you'd draw). Then, we'll make a story about it!
            </Text>
            <DrawingCanvas onDrawEnd={handleDrawingEnd} />
          </>
        )}

        {isLoading && <LoadingSpinner text="Our story wizards are at work..." style={styles.spinner} />}
        
        {error && <Text style={styles.error}>{error}</Text>}

        {story && (
          <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            {drawingDescription && (
              <Text style={styles.drawingDescription}>
                Based on your drawing of: "{drawingDescription}"
              </Text>
            )}
            <Text style={styles.storyText}>{story.story}</Text>
            {story.characters && story.characters.length > 0 && (
              <Text style={styles.storyMeta}><Text style={styles.metaLabel}>Characters:</Text> {story.characters.join(', ')}</Text>
            )}
            {story.setting && (
              <Text style={styles.storyMeta}><Text style={styles.metaLabel}>Setting:</Text> {story.setting}</Text>
            )}
          </View>
        )}

        {(story || error) && (
          <Button 
            onPress={resetActivity} 
            fullWidth 
            style={styles.resetButton}
          >
            Draw Another Story!
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
    backgroundColor: '#f5f3ff', // purple-50
  },
  card: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sparklesIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
    color: '#9333ea', // purple-600
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333ea', // purple-600
  },
  instructions: {
    color: '#4b5563', // gray-600
    marginBottom: 16,
  },
  canvasContainer: {
    aspectRatio: 1,
    width: '100%',
    backgroundColor: '#e5e7eb', // gray-200
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9ca3af', // gray-400
  },
  pencilIcon: {
    width: 64,
    height: 64,
    marginBottom: 8,
    color: '#9ca3af', // gray-400
  },
  canvasText: {
    textAlign: 'center',
    color: '#6b7280', // gray-500
    marginBottom: 8,
    fontSize: 14,
  },
  drawingInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 6,
    backgroundColor: 'white',
  },
  drawingButton: {
    marginTop: 12,
    backgroundColor: '#0284c7', // skyBlue
  },
  spinner: {
    marginVertical: 32,
  },
  error: {
    color: '#ef4444', // red-500
    textAlign: 'center',
    marginVertical: 16,
  },
  storyContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#ede9fe', // purple-100
    borderRadius: 12,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7e22ce', // purple-700
    marginBottom: 8,
  },
  drawingDescription: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    fontStyle: 'italic',
    marginBottom: 12,
  },
  storyText: {
    color: '#374151', // gray-700
    lineHeight: 24,
  },
  storyMeta: {
    fontSize: 12,
    color: '#9333ea', // purple-600
    marginTop: 12,
  },
  metaLabel: {
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 24,
    backgroundColor: '#8b5cf6', // purple-500
  },
});

export default DrawAndTellScreen;