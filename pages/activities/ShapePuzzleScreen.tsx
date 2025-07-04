import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../../App';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { PuzzlePieceIcon, CheckCircleIcon } from './icons'; // You'll need to create or import these icons

// Shape data
const shapes = [
  { id: 'circle', color: '#f87171', shape: 'circle' }, // red-400
  { id: 'square', color: '#60a5fa', shape: 'square' }, // blue-400
  { id: 'triangle', color: '#facc15', shape: 'triangle' }, // yellow-400
];

const targets = [
  { id: 'circle_target', accepts: 'circle', label: 'Circle' },
  { id: 'square_target', accepts: 'square', label: 'Square' },
  { id: 'triangle_target', accepts: 'triangle', label: 'Triangle' },
];

const ShapePuzzleScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [completed, setCompleted] = useState<string[]>([]); // Store IDs of placed shapes

  const handleShapeClick = (shapeId: string) => {
    if (!completed.includes(shapeId)) {
      const target = targets.find(t => t.accepts === shapeId);
      if (target && !completed.includes(target.accepts)) {
        setCompleted(prev => [...prev, shapeId]);
      }
    }
  };
  
  const allShapesPlaced = completed.length === shapes.length;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {/* <PuzzlePieceIcon style={styles.icon} /> */}
        <Text style={styles.title}>Shape Puzzles!</Text>
        <Text style={styles.subtitle}>Match the shapes to their outlines. Tap a shape to place it!</Text>

        {/* Targets Area */}
        <View style={styles.targetsContainer}>
          {targets.map(target => (
            <View 
              key={target.id} 
              style={[
                styles.target,
                styles[`${target.accepts}Target`],
                completed.includes(target.accepts) && styles.completedTarget
              ]}
            >
              {completed.includes(target.accepts) ? (
                // <CheckCircleIcon style={styles.checkIcon} />
                <Text>check circle</Text>
              ) : (
                <Text style={styles.targetLabel}>{target.label}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Shapes Area */}
        {!allShapesPlaced ? (
          <View style={styles.shapesContainer}>
            {shapes.filter(s => !completed.includes(s.id)).map(shape => (
              <TouchableOpacity
                key={shape.id}
                onPress={() => handleShapeClick(shape.id)}
                style={[
                  styles.shape,
                  styles[shape.shape],
                  { backgroundColor: shape.color }
                ]}
                accessibilityLabel={`Place ${shape.id}`}
              />
            ))}
          </View>
        ) : (
          <Card style={styles.successCard}>
            <CheckCircleIcon style={styles.successIcon} />
            <Text style={styles.successTitle}>Great Job!</Text>
            <Text style={styles.successText}>You matched all the shapes!</Text>
          </Card>
        )}
        
        <Button 
          onPress={() => setCompleted([])}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          disabled={!allShapesPlaced && completed.length > 0}
        >
          {allShapesPlaced ? "Play Again!" : (completed.length > 0 ? "Reset" : "Start Puzzle")}
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d9f99d', // lime-200 as base for gradient
  },
  card: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    padding: 20,
  },
  icon: {
    width: 48,
    height: 48,
    color: '#16a34a', // green-600
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#166534', // green-700
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563', // gray-600
    textAlign: 'center',
    marginBottom: 24,
  },
  targetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f3f4f6', // gray-100
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    minHeight: 100,
  },
  target: {
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: '#9ca3af', // gray-400
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleTarget: {
    borderRadius: 35,
  },
  squareTarget: {
    borderRadius: 4,
  },
  triangleTarget: {
    backgroundColor: 'transparent',
    width: 70,
    height: 60,
  },
  completedTarget: {
    backgroundColor: '#dcfce7', // green-100
    borderColor: '#16a34a', // green-600
  },
  targetLabel: {
    color: '#6b7280', // gray-500
    fontSize: 12,
  },
  checkIcon: {
    width: 32,
    height: 32,
    color: '#16a34a', // green-600
  },
  shapesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    minHeight: 80,
  },
  shape: {
    width: 60,
    height: 60,
  },
  circle: {
    borderRadius: 30,
  },
  square: {
    borderRadius: 4,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 60,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#facc15', // yellow-400
  },
  successCard: {
    backgroundColor: '#dcfce7', // green-100
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 40,
    height: 40,
    color: '#16a34a', // green-600
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#166534', // green-700
    marginBottom: 4,
  },
  successText: {
    color: '#166534', // green-700
  },
  actionButton: {
    backgroundColor: '#16a34a', // green-600
    marginTop: 16,
  },
  actionButtonText: {
    color: 'white',
  },
});

export default ShapePuzzleScreen;