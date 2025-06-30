import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const JigsawPuzzleScreen: React.FC = () => {
  const [solved, setSolved] = useState(false);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Icon 
          name="puzzle" 
          size={48} 
          color="#059669" // emerald-600
          style={styles.icon}
        />
        <Text style={styles.title}>Jigsaw Fun!</Text>
        <Text style={styles.subtitle}>Put the pieces together to reveal the picture!</Text>

        <View style={styles.puzzleArea}>
          {!solved ? (
            <>
              <Image 
                source={{ uri: 'https://picsum.photos/seed/jigsawpuzzleincomplete/200/150?blur=2' }}
                style={styles.puzzleImage}
              />
              <Text style={styles.placeholderText}>Imagine puzzle pieces here that you can drag and drop!</Text>
              <Button
                onPress={() => setSolved(true)}
                style={styles.solveButton}
                textStyle={styles.buttonText}
              >
                Show Solved (Mock)
              </Button>
            </>
          ) : (
            <>
              <Image 
                source={{ uri: 'https://picsum.photos/seed/jigsawpuzzlesolved/200/150' }}
                style={[styles.puzzleImage, styles.solvedImage]}
              />
              <Text style={styles.successText}>Yay! Puzzle Solved!</Text>
            </>
          )}
        </View>
        
        {solved && (
          <Button
            onPress={() => setSolved(false)}
            style={styles.solveButton}
            textStyle={styles.buttonText}
          >
            Play Again (Reset Mock)
          </Button>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 24,
    backgroundColor: '#d9f99d', // lime-200 as base color
    // For gradient: You'll need react-native-linear-gradient
    // backgroundImage: 'linear-gradient(to bottom right, #d9f99d, #a7f3d0, #99f6e4)'
  },
  card: {
    maxWidth: 448, // max-w-md
    width: '100%',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#047857', // emerald-700
    marginBottom: 4,
    // fontFamily: 'YourDisplayFont',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563', // gray-600
    marginBottom: 24,
  },
  puzzleArea: {
    backgroundColor: '#e5e7eb', // gray-200
    aspectRatio: 4/3,
    width: '100%',
    borderRadius: 8,
    marginBottom: 24,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#9ca3af', // gray-400
    alignItems: 'center',
    justifyContent: 'center',
  },
  puzzleImage: {
    borderRadius: 6,
    opacity: 0.7,
    width: 200,
    height: 150,
  },
  solvedImage: {
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderText: {
    color: '#6b7280', // gray-500
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#047857', // emerald-700
    fontSize: 18,
    marginTop: 12,
    fontWeight: '600',
  },
  solveButton: {
    backgroundColor: '#10b981', // emerald-500
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
  },
});

export default JigsawPuzzleScreen;