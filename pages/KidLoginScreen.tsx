import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { AppContext } from '../App';
import { View as ViewType, UserRole } from '../types';
import Button from '../components/Button';
import { APP_NAME } from '../constants';
// import { ArrowLeftIcon, KeyIcon } from './icons'; // You'll need to create or import these icons

const KidLoginScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  if (!context) return null;
  const { loginKidWithPin, setViewWithPath } = context;

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]$/.test(text) || text === '') {
      const newPin = [...pin];
      newPin[index] = text;
      setPin(newPin);
      setError('');

      // Focus next input
      if (text !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }: any, index: number) => {
    if (key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setError("Please enter all 4 digits of your PIN.");
      return;
    }
    
    const loggedInKid = loginKidWithPin(enteredPin);
    if (loggedInKid) {
      setViewWithPath(ViewType.KidHome, '/kidhome', { replace: true });
    } else {
      setError("Incorrect PIN. Please try again or ask a grown-up for help.");
      setPin(['', '', '', '']); // Clear PIN on error
      inputRefs.current[0]?.focus();
    }
  };

  const handleNumericButtonClick = (num: string) => {
    const currentPinStr = pin.join('');
    if (currentPinStr.length < 4) {
      const firstEmptyIndex = pin.findIndex(p => p === '');
      if (firstEmptyIndex !== -1) {
        const newPin = [...pin];
        newPin[firstEmptyIndex] = num;
        setPin(newPin);
        setError('');
        if (firstEmptyIndex < 3) {
          inputRefs.current[firstEmptyIndex + 1]?.focus();
        } else if (firstEmptyIndex === 3) {
          handleSubmit();
        }
      }
    }
  };

  const handleDelete = () => {
    let lastFilledIndex = -1;
    for (let i = pin.length - 1; i >= 0; i--) {
      if (pin[i] !== '') {
        lastFilledIndex = i;
        break;
      }
    }
    if (lastFilledIndex !== -1) {
      const newPin = [...pin];
      newPin[lastFilledIndex] = '';
      setPin(newPin);
      inputRefs.current[lastFilledIndex]?.focus();
    }
    setError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Button 
          onPress={() => setViewWithPath(ViewType.RoleSelection, '/roleselection')}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        >
          {/* <ArrowLeftIcon style={styles.backButtonIcon} /> */}
        </Button>
      </View>
      
      <View style={styles.loginContainer}>
        {/* <KeyIcon style={styles.keyIcon} /> */}
        <Text style={styles.title}>Enter Your PIN</Text>
        <Text style={styles.subtitle}>Ask a grown-up if you need help!</Text>

        <View style={styles.pinInputContainer}>
          {pin.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              style={styles.pinInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              secureTextEntry
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        {/* Numeric Keypad */}
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                onPress={() => handleNumericButtonClick(String(num))}
                style={styles.numberButton}
                textStyle={styles.numberButtonText}
              >
                {num}
              </Button>
            ))}
          </View>
          <View style={styles.keypadRow}>
            {[4, 5, 6].map((num) => (
              <Button
                key={num}
                onPress={() => handleNumericButtonClick(String(num))}
                style={styles.numberButton}
                textStyle={styles.numberButtonText}
              >
                {num}
              </Button>
            ))}
          </View>
          <View style={styles.keypadRow}>
            {[7, 8, 9].map((num) => (
              <Button
                key={num}
                onPress={() => handleNumericButtonClick(String(num))}
                style={styles.numberButton}
                textStyle={styles.numberButtonText}
              >
                {num}
              </Button>
            ))}
          </View>
          <View style={styles.keypadRow}>
            <Button 
              onPress={handleDelete} 
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            >
              DEL
            </Button>
            <Button
              onPress={() => handleNumericButtonClick('0')}
              style={styles.numberButton}
              textStyle={styles.numberButtonText}
            >
              0
            </Button>
            <Button 
              onPress={handleSubmit} 
              style={styles.submitButton}
              textStyle={styles.submitButtonText}
            >
              OK
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6ee7b7', // green-300 as base for gradient
    padding: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    padding: 8,
  },
  backButtonText: {
    color: 'white',
  },
  backButtonIcon: {
    width: 20,
    height: 20,
    color: 'white',
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    backdropFilter: 'blur(10px)', // Note: React Native doesn't support backdrop-filter
  },
  keyIcon: {
    width: 64,
    height: 64,
    color: '#fde047', // yellow-300
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  pinInput: {
    width: 56,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  errorText: {
    fontSize: 14,
    color: '#fee2e2', // red-200
    backgroundColor: 'rgba(239, 68, 68, 0.5)', // red-500/50
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  keypadContainer: {
    width: '100%',
    marginTop: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  numberButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fde047', // yellow-400
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: 'black',
  },
});

export default KidLoginScreen;