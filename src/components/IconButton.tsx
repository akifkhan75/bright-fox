
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel: string; // Changed from ariaLabel
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onPress, style, accessibilityLabel, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonBase, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    padding: 8, // Corresponds to p-2
    borderRadius: 9999, // Corresponds to rounded-full
    alignItems: 'center',
    justifyContent: 'center',
    // hover:bg-gray-200 and active:bg-gray-300 need to be handled by Pressable's state or custom logic if exact visual needed
  },
});

export default IconButton;
