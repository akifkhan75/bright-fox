import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { PencilIcon, CheckCircleIcon } from './icons'; // You'll need to create or import these icons

const TraceAnimalScreen: React.FC = () => {
  const [traced, setTraced] = React.useState(false);

  // Simple Cat Outline SVG
  const AnimalOutline = () => (
    <Text>animation</Text>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* <PencilIcon style={styles.icon} /> */}
        <Text style={styles.title}>Trace the Animal!</Text>
        <Text style={styles.subtitle}>Follow the lines to draw a cute animal!</Text>

        <View style={[
          styles.tracingArea,
          traced ? styles.tracedArea : styles.untracedArea
        ]}>
          <AnimalOutline />
          {/* {traced && <CheckCircleIcon style={styles.successIcon} />} */}
        </View>
        
        <Text style={styles.hintText}>
          {traced ? "Great tracing!" : "Imagine your finger is a magic pencil!"}
        </Text>

        <Button 
          onPress={() => setTraced(!traced)} 
          style={traced ? styles.pinkButton : styles.purpleButton}
          textStyle={styles.buttonText}
        >
          {traced ? "Trace Another!" : "I Traced It! (Mock)"}
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5d0fe', // pink-200 as base for gradient
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
    color: '#9333ea', // purple-600
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7e22ce', // purple-700
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563', // gray-600
    marginBottom: 24,
    textAlign: 'center',
  },
  tracingArea: {
    width: 240,
    height: 240,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  untracedArea: {
    borderStyle: 'dashed',
    borderColor: '#9ca3af', // gray-400
  },
  tracedArea: {
    borderColor: '#22c55e', // green-500
  },
  successIcon: {
    width: 40,
    height: 40,
    color: '#22c55e', // green-500
    position: 'absolute',
  },
  hintText: {
    fontSize: 14,
    color: '#6b7280', // gray-500
    marginBottom: 16,
    textAlign: 'center',
  },
  purpleButton: {
    backgroundColor: '#9333ea', // purple-500
  },
  pinkButton: {
    backgroundColor: '#ec4899', // pink-500
  },
  buttonText: {
    color: 'white',
  },
});

export default TraceAnimalScreen;