
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large'; // React Native ActivityIndicator sizes
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  text, 
  style,
  textStyle,
  color = '#0EA5E9' // Default skyBlue color
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: '#4B5563', // gray-600
  },
});

export default LoadingSpinner;
