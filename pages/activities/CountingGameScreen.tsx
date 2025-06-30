import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { CalculatorIcon, CheckCircleIcon, XCircleIcon } from './icons'; // You'll need to create or import these icons

const CountingGameScreen: React.FC = () => {
  const [targetCount, setTargetCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);
  const [score, setScore] = useState(0);

  const generateProblem = () => {
    setFeedback(null);
    const newTarget = Math.floor(Math.random() * 8) + 2; // Count between 2 and 9
    setTargetCount(newTarget);

    const correctOption = newTarget;
    let newOptions = [correctOption];
    while (newOptions.length < 3) {
      const randomOption = Math.floor(Math.random() * 9) + 1;
      if (!newOptions.includes(randomOption)) {
        newOptions.push(randomOption);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5)); // Shuffle options
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleOptionClick = (option: number) => {
    if (option === targetCount) {
      setFeedback({ message: "That's Right!", correct: true });
      setScore(s => s + 1);
      setTimeout(generateProblem, 1500);
    } else {
      setFeedback({ message: "Try Again!", correct: false });
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* <CalculatorIcon style={styles.icon} /> */}
        <Text style={styles.title}>Counting Fun!</Text>
        <Text style={styles.subtitle}>How many apples can you count?</Text>
        <Text style={styles.scoreText}>Score: <Text style={styles.scoreValue}>{score}</Text></Text>

        {/* Display Items to Count */}
        <View style={styles.appleContainer}>
          {Array.from({ length: targetCount }).map((_, index) => (
            <Text key={index} style={styles.appleEmoji} accessibilityLabel="apple">🍎</Text>
          ))}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map(opt => (
            <Button 
              key={opt} 
              onPress={() => handleOptionClick(opt)}
              style={styles.optionButton}
              textStyle={styles.optionButtonText}
              disabled={!!feedback}
            >
              {opt}
            </Button>
          ))}
        </View>
        
        {feedback && (
          <Card style={[
            styles.feedbackCard,
            feedback.correct ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            <View style={styles.feedbackContent}>
              {feedback.correct ? (
                // <CheckCircleIcon style={styles.feedbackIcon} />
                <Text>check circle</Text>
              ) : (
                // <XCircleIcon style={styles.feedbackIcon} />
                <Text>x circle</Text>
              )}
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </View>
          </Card>
        )}

        {!feedback && <View style={styles.feedbackPlaceholder} />}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fed7aa', // orange-200 as base for gradient
  },
  card: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    color: '#ea580c', // orange-600
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c2410c', // orange-700
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563', // gray-600
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 14,
    color: '#6b7280', // gray-500
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreValue: {
    fontWeight: 'bold',
  },
  appleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // gray-100
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  appleEmoji: {
    fontSize: 36,
    margin: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  optionButton: {
    flex: 1,
    minWidth: 80,
    backgroundColor: '#f97316', // orange-500
    paddingVertical: 16,
  },
  optionButtonText: {
    fontSize: 24,
    color: 'white',
  },
  feedbackCard: {
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  correctFeedback: {
    backgroundColor: '#dcfce7', // green-100
  },
  incorrectFeedback: {
    backgroundColor: '#fee2e2', // red-100
  },
  feedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  feedbackText: {
    fontWeight: '600',
  },
  correctFeedbackText: {
    color: '#166534', // green-700
  },
  incorrectFeedbackText: {
    color: '#991b1b', // red-700
  },
  feedbackPlaceholder: {
    height: 52,
  },
});

export default CountingGameScreen;