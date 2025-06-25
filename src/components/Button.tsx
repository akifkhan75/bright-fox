
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  isLoading?: boolean; // Added for loading state
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onPress,
  style,
  textStyle,
  disabled = false,
  isLoading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: styles.primaryButton,
          text: styles.primaryButtonText,
        };
      case 'secondary':
        return {
          button: styles.secondaryButton,
          text: styles.secondaryButtonText,
        };
      case 'danger':
        return {
          button: styles.dangerButton,
          text: styles.dangerButtonText,
        };
      case 'ghost':
        return {
          button: styles.ghostButton,
          text: styles.ghostButtonText,
        };
      default:
        return {
          button: styles.primaryButton,
          text: styles.primaryButtonText,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          button: styles.smButton,
          text: styles.smButtonText,
        };
      case 'md':
        return {
          button: styles.mdButton,
          text: styles.mdButtonText,
        };
      case 'lg':
        return {
          button: styles.lgButton,
          text: styles.lgButtonText,
        };
      default:
        return {
          button: styles.mdButton,
          text: styles.mdButtonText,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const widthStyle = fullWidth ? styles.fullWidth : {};

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        variantStyle.button,
        sizeStyle.button,
        widthStyle,
        disabled || isLoading ? styles.disabledButton : {},
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === 'primary' || variant === 'secondary' || variant === 'danger' ? '#fff' : '#3B82F6'} />
      ) : (
        typeof children === 'string' ? (
          <Text style={[styles.baseButtonText, variantStyle.text, sizeStyle.text, textStyle]}>
            {children}
          </Text>
        ) : (
          children 
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  baseButtonText: {
    fontWeight: '600', // Corresponds to font-semibold
  },
  primaryButton: {
    backgroundColor: '#0EA5E9', // sky-500
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#EC4899', // pink-500
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  dangerButton: {
    backgroundColor: '#EF4444', // red-500
  },
  dangerButtonText: {
    color: '#FFFFFF',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
  },
  ghostButtonText: {
    color: '#374151', // gray-700
  },
  smButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smButtonText: {
    fontSize: 14,
  },
  mdButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mdButtonText: {
    fontSize: 16,
  },
  lgButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  lgButtonText: {
    fontSize: 18,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default Button;
