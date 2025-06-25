
import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const cardContent = (
    <View style={[styles.cardBase, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  cardBase: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Corresponds to rounded-xl
    padding: 16,      // Default padding, can be overridden by style prop
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 }, // Corresponds to shadow-lg
    shadowOpacity: 0.1, // Adjusted for typical mobile shadow
    shadowRadius: 8,
    elevation: 5,     // Android shadow
  },
  pressable: {
    // You can add styles here if the Pressable itself needs styling outside the card
  },
  pressed: {
    opacity: 0.8, // Example pressed effect
  },
});

export default Card;
