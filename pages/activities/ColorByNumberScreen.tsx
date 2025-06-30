import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import { PaintBrushIcon, CheckCircleIcon } from './icons'; // You'll need to create or import these icons

// Mock Color by Number data
const colorMap = [
  { number: 1, color: '#ef4444', label: 'Red' }, // red-500
  { number: 2, color: '#3b82f6', label: 'Blue' }, // blue-500
  { number: 3, color: '#facc15', label: 'Yellow' }, // yellow-400
  { number: 4, color: '#22c55e', label: 'Green' }, // green-500
];

const imageSegments = [ // Simplified representation of an image
  { id: 'seg1', number: 1, area: 'top-left' },
  { id: 'seg2', number: 2, area: 'top-right' },
  { id: 'seg3', number: 3, area: 'bottom-left' },
  { id: 'seg4', number: 4, area: 'bottom-right' },
];

const ColorByNumberScreen: React.FC = () => {
  const [coloredSegments, setColoredSegments] = React.useState<Record<string, string>>({}); // { segId: color }
  
  const handleColorSegment = (segmentId: string, color: string) => {
    setColoredSegments(prev => ({...prev, [segmentId]: color }));
  };

  const allColored = Object.keys(coloredSegments).length === imageSegments.length;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <PaintBrushIcon style={styles.icon} />
        <Text style={styles.title}>Color by Number!</Text>
        <Text style={styles.subtitle}>Match the numbers to the colors to create a beautiful picture!</Text>

        {/* Color Palette */}
        <View style={styles.colorPalette}>
          {colorMap.map(c => (
            <View key={c.number} style={styles.colorItem}>
              <View style={[styles.colorCircle, { backgroundColor: c.color }]} />
              <Text style={styles.colorLabel}>{c.number} = {c.label}</Text>
            </View>
          ))}
        </View>

        {/* Image Area (Mock) */}
        <View style={styles.imageGrid}>
          {imageSegments.map(seg => {
            const segmentColorInfo = colorMap.find(c => c.number === seg.number);
            return (
              <TouchableOpacity
                key={seg.id}
                onPress={() => segmentColorInfo && handleColorSegment(seg.id, segmentColorInfo.color)}
                style={[
                  styles.imageSegment,
                  { 
                    backgroundColor: coloredSegments[seg.id] || 'white',
                    borderColor: '#d1d5db', // gray-300
                  }
                ]}
                accessibilityLabel={`Color segment ${seg.number}`}
              >
                {!coloredSegments[seg.id] && (
                  <Text style={styles.segmentNumber}>{seg.number}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {allColored && (
          <Card style={styles.successCard}>
            <CheckCircleIcon style={styles.successIcon} />
            <Text style={styles.successText}>Beautifully Colored!</Text>
          </Card>
        )}

        <Button 
          onPress={() => setColoredSegments({})} 
          style={styles.actionButton}
          disabled={!allColored && Object.keys(coloredSegments).length > 0 && !allColored}
          textStyle={styles.actionButtonText}
        >
          {allColored ? "Color Again!" : (Object.keys(coloredSegments).length > 0 ? "Reset Colors" : "Start Coloring!")}
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5d0fe', // fuchsia-200 as base for gradient
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
    color: '#7c3aed', // violet-600
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6d28d9', // violet-700
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563', // gray-600
    marginBottom: 24,
    textAlign: 'center',
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  colorItem: {
    alignItems: 'center',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 192, // 48 * 4
    height: 192,
    backgroundColor: '#f3f4f6', // gray-100
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db', // gray-300
    marginBottom: 24,
  },
  imageSegment: {
    width: '48%',
    height: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    margin: 2,
  },
  segmentNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  successCard: {
    backgroundColor: '#dcfce7', // green-100
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  successIcon: {
    width: 40,
    height: 40,
    color: '#16a34a', // green-600
    marginBottom: 8,
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#166534', // green-700
  },
  actionButton: {
    backgroundColor: '#7c3aed', // violet-600
    marginTop: 16,
  },
  actionButtonText: {
    color: 'white',
  },
});

export default ColorByNumberScreen;