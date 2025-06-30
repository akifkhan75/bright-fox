import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  textStyle,
  loading = false,
  disabled = false,
  onPress,
}) => {
  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: '#0ea5e9',
      borderColor: '#0ea5e9',
    },
    secondary: {
      backgroundColor: '#ec4899',
      borderColor: '#ec4899',
    },
    danger: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: '#d1d5db',
    },
  };

  // Size styles
  const sizeStyles = {
    sm: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    md: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    lg: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
  };

  // Text styles based on variant
  const textVariantStyles = {
    primary: {
      color: '#ffffff',
    },
    secondary: {
      color: '#ffffff',
    },
    danger: {
      color: '#ffffff',
    },
    ghost: {
      color: '#374151',
    },
  };

  // Text size styles
  const textSizeStyles = {
    sm: {
      fontSize: 14,
    },
    md: {
      fontSize: 16,
    },
    lg: {
      fontSize: 18,
    },
  };

  // Disabled state
  const disabledStyles = disabled ? {
    opacity: 0.6,
  } : {};

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        disabledStyles,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textVariantStyles[variant].color} />
      ) : (
        <Text style={[
          styles.textBase,
          textVariantStyles[variant],
          textSizeStyles[size],
          textStyle,
        ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;