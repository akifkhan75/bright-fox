import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  style,
  textStyle,
  color = '#0284c7', // skyBlue color
}) => {
  let spinnerSize: number = 32; // md default
  if (size === 'sm') spinnerSize = 20;
  if (size === 'lg') spinnerSize = 48;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={spinnerSize}
        color={color}
      />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563', // gray-600
  },
});

export default LoadingSpinner;