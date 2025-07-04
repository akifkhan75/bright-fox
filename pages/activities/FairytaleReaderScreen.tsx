import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { BookOpenIcon } from './icons'; // You'll need to create or import this icon

// Mock Fairytale
const fairytale = {
  title: "The Little Fox and the Sparkling River",
  pages: [
    "Once upon a time, in a lush green forest, lived a little fox named Finley. Finley loved adventures more than anything!",
    "One sunny morning, Finley heard a magical whisper coming from the Sparkling River. 'Come find me,' it seemed to say.",
    "Curious, Finley tiptoed to the riverbank. The water shimmered with rainbow colors! In the middle, a tiny, glowing fish was waving its fin.",
    "'Hello!' chirped Finley. 'Are you the magic whisper?' The fish giggled, a sound like tiny bells. 'I am! I guard the river's joy. Will you help me spread it?'",
    "Finley nodded eagerly. The fish gave Finley a smooth, glowing pebble. 'Take this to a sad part of the forest, and joy will bloom!'",
    "Finley found a gloomy patch where flowers drooped. Placing the pebble down, the whole area lit up with color and happy songs! Finley learned that sharing joy makes it grow even bigger.",
  ],
  moral: "Sharing joy and kindness makes the world a brighter place."
};

const FairytaleReaderScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    if (currentPage < fairytale.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const isLastPage = currentPage === fairytale.pages.length - 1;

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        {/* <BookOpenIcon style={styles.bookIcon} /> */}
        <Text style={styles.title}>{fairytale.title}</Text>
        
        <Card style={styles.pageCard}>
          <Text style={styles.pageText}>
            {fairytale.pages[currentPage]}
          </Text>
        </Card>

        {isLastPage && (
          <Card style={styles.moralCard}>
            <Text style={styles.moralTitle}>Moral of the Story:</Text>
            <Text style={styles.moralText}>{fairytale.moral}</Text>
          </Card>
        )}

        <View style={styles.navigationContainer}>
          <Button 
            onPress={handlePrevPage} 
            disabled={currentPage === 0} 
            style={styles.prevButton}
            textStyle={styles.buttonText}
          >
            Previous
          </Button>
          <Text style={styles.pageIndicator}>
            Page {currentPage + 1} of {fairytale.pages.length}
          </Text>
          <Button 
            onPress={isLastPage ? () => setCurrentPage(0) : handleNextPage} 
            style={styles.nextButton}
            textStyle={styles.buttonText}
          >
            {isLastPage ? "Read Again" : "Next"}
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#bae6fd', // sky-200 as base for gradient
  },
  mainCard: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  bookIcon: {
    width: 48,
    height: 48,
    color: '#0284c7', // sky-600
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0369a1', // sky-700
    textAlign: 'center',
    marginBottom: 16,
  },
  pageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    minHeight: 200,
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pageText: {
    color: '#374151', // gray-700
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  moralCard: {
    backgroundColor: '#fef9c3', // yellow-100
    padding: 12,
    marginBottom: 16,
  },
  moralTitle: {
    fontWeight: '600',
    color: '#854d0e', // yellow-700
    textAlign: 'center',
    marginBottom: 4,
  },
  moralText: {
    fontSize: 14,
    color: '#854d0e', // yellow-700
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: '#ec4899', // pink-500
    paddingHorizontal: 16,
  },
  nextButton: {
    backgroundColor: '#0284c7', // sky-500
    paddingHorizontal: 16,
  },
  buttonText: {
    color: 'white',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#6b7280', // gray-500
  },
});

export default FairytaleReaderScreen;