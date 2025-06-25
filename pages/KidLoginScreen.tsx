
import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../App';
import { View, UserRole } from '../types';
import Button from '../components/Button';
import { APP_NAME } from '../constants';
import { ArrowLeftIcon, KeyIcon } from '@heroicons/react/24/solid';

const KidLoginScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!context) return null;
  const { loginKidWithPin, setViewWithPath } = context;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === '') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setError('');

      // Focus next input
      if (value !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setError("Please enter all 4 digits of your PIN.");
      return;
    }
    
    const loggedInKid = loginKidWithPin(enteredPin);
    if (loggedInKid) {
      setViewWithPath(View.KidHome, '/kidhome', { replace: true });
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
                // Auto-submit if last digit entered via button, or require explicit submit
                 handleSubmit(new Event('submit') as any); // Simulate submit event
            }
        }
    }
  };

  const handleDelete = () => {
    let lastFilledIndex = -1;
    for(let i = pin.length -1; i >=0; i--) {
        if(pin[i] !== '') {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 p-6 text-white">
      <div className="absolute top-4 left-4">
        <Button 
            onClick={() => setViewWithPath(View.RoleSelection, '/roleselection')} 
            variant="ghost" 
            className="!text-white hover:!bg-white/20 !border-white/50 !p-2"
            aria-label="Go Back"
        >
            <ArrowLeftIcon className="h-5 w-5"/>
        </Button>
      </div>
      
      <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-full max-w-sm">
        <KeyIcon className="h-16 w-16 text-yellow-300 mx-auto mb-4"/>
        <h1 className="text-3xl font-bold font-display mb-2">Enter Your PIN</h1>
        <p className="text-sm opacity-90 mb-6">Ask a grown-up if you need help!</p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2 sm:space-x-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="password" 
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold bg-white/30 border-2 border-white/50 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent outline-none text-white caret-yellow-300"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-200 bg-red-500/50 p-2 rounded-md mb-4">{error}</p>}
          
          {/* Numeric Keypad for touch devices */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                type="button"
                onClick={() => handleNumericButtonClick(String(num))}
                className="!text-2xl !font-bold !py-3 bg-white/25 hover:bg-white/40 !text-white !shadow-md"
              >
                {num}
              </Button>
            ))}
             <Button type="button" onClick={handleDelete} className="!text-lg col-span-1 bg-white/25 hover:bg-white/40 !text-white">DEL</Button>
            <Button type="button" onClick={() => handleNumericButtonClick('0')} className="!text-2xl !font-bold bg-white/25 hover:bg-white/40 !text-white">0</Button>
             <Button type="submit" className="!text-lg col-span-1 bg-yellow-400 hover:bg-yellow-500 !text-black">OK</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KidLoginScreen;
