import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { BeakerIcon, LightBulbIcon } from './icons'; // You'll need to create or import these icons

const experiments = [
  {
    title: "Float or Sink?",
    description: "Gather different small items (like a coin, a leaf, a small toy, a crayon). Fill a bowl with water. Gently place each item in the water. Does it float or sink? Why do you think that is?",
    materials: ["Bowl of water", "Various small household items"],
    explanation: "Heavy things for their size (dense things) often sink, while lighter things for their size (less dense things) often float. Shape also matters!"
  },
  {
    title: "Magic Milk Colors",
    description: "Pour some milk into a shallow dish. Add a few drops of different food coloring. Dip a cotton swab in dish soap, then touch it to the milk near the colors. Watch the colors swirl!",
    materials: ["Milk", "Shallow dish", "Food coloring", "Dish soap", "Cotton swab"],
    explanation: "Dish soap breaks the surface tension of the milk and reacts with the fat, causing the colors to move and mix in cool patterns."
  }
];

const SimpleExperimentsScreen: React.FC = () => {
  const [currentExperimentIndex, setCurrentExperimentIndex] = React.useState(0);
  const experiment = experiments[currentExperimentIndex];

  const nextExperiment = () => {
    setCurrentExperimentIndex((prev) => (prev + 1) % experiments.length);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.mainCard}>
        <View style={styles.header}>
          {/* <BeakerIcon style={styles.icon} /> */}
          <Text style={styles.title}>Simple Science Lab!</Text>
        </View>
        
        <Card style={styles.experimentCard}>
          <View style={styles.experimentHeader}>
            {/* <LightBulbIcon style={styles.bulbIcon} /> */}
            <Text style={styles.experimentTitle}>{experiment.title}</Text>
          </View>
          <Text style={styles.experimentDescription}>{experiment.description}</Text>
          
          <Text style={styles.sectionTitle}>You will need:</Text>
          <View style={styles.materialsList}>
            {experiment.materials.map((mat, index) => (
              <Text key={index} style={styles.materialItem}>• {mat}</Text>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>What's Happening? (Simplified)</Text>
          <Text style={styles.explanation}>{experiment.explanation}</Text>
        </Card>

        <Button 
          onPress={nextExperiment} 
          style={styles.nextButton}
          textStyle={styles.nextButtonText}
        >
          Try Another Experiment!
        </Button>
        <Text style={styles.note}>Adult supervision recommended for all experiments.</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 48,
    height: 48,
    color: '#0891b2', // cyan-600
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#155e75', // cyan-700
    textAlign: 'center',
  },
  experimentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  experimentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulbIcon: {
    width: 28,
    height: 28,
    color: '#0369a1', // sky-700
    marginRight: 8,
  },
  experimentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0369a1', // sky-700
  },
  experimentDescription: {
    fontSize: 14,
    color: '#374151', // gray-700
    lineHeight: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563', // gray-600
    marginBottom: 4,
  },
  materialsList: {
    marginBottom: 12,
  },
  materialItem: {
    fontSize: 12,
    color: '#4b5563', // gray-600
    marginLeft: 8,
  },
  explanation: {
    fontSize: 12,
    color: '#4b5563', // gray-600
    lineHeight: 18,
  },
  nextButton: {
    backgroundColor: '#06b6d4', // cyan-500
  },
  nextButtonText: {
    color: 'white',
  },
  note: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SimpleExperimentsScreen;