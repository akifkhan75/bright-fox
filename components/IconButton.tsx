import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, AccessibilityProps } from 'react-native';

interface IconButtonProps extends AccessibilityProps {
  icon: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel: string; // React Native uses accessibilityLabel instead of aria-label
}

const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  style, 
  accessibilityLabel, 
  disabled = false,
  onPress,
  ...props 
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 24, // Makes it circular
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;