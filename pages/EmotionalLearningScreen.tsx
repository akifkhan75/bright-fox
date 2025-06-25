
import React, { useState, useContext } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { AppContext } from '../App';
import { HeartIcon } from '@heroicons/react/24/solid';

interface Emotion {
  name: string;
  emoji: string;
  color: string; // Tailwind bg color
  affirmation: string;
}

const emotions: Emotion[] = [
  { name: 'Happy', emoji: '😊', color: 'bg-yellow-400', affirmation: "It's great to feel happy! Share your smile!" },
  { name: 'Sad', emoji: '😢', color: 'bg-blue-400', affirmation: "It's okay to feel sad sometimes. Talk to someone you trust." },
  { name: 'Angry', emoji: '😠', color: 'bg-red-500', affirmation: "Feeling angry is normal. Take deep breaths to calm down." },
  { name: 'Excited', emoji: '🤩', color: 'bg-orange-400', affirmation: "Woohoo! Excitement is a super fun feeling!" },
  { name: 'Calm', emoji: '😌', color: 'bg-green-400', affirmation: "Feeling calm and peaceful is wonderful." },
  { name: 'Surprised', emoji: '😮', color: 'bg-purple-400', affirmation: "Wow, a surprise! How interesting!" },
];

const EmotionalLearningScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  const handleSelectEmotion = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  return (
    <div className="p-4 md:p-6 bg-pink-50 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <HeartIcon className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-pink-600 mb-3 font-display">How Are You Feeling?</h2>
        <p className="text-gray-600 mb-6">
          It's okay to feel lots of different ways! Pick an emotion below.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {emotions.map((emotion) => (
            <button
              key={emotion.name}
              onClick={() => handleSelectEmotion(emotion)}
              className={`p-4 rounded-xl shadow-md transition-all duration-150 transform hover:scale-105
                ${selectedEmotion?.name === emotion.name ? `ring-4 ring-offset-2 ${emotion.color.replace('bg-', 'ring-')}` : emotion.color}
                ${emotion.color.includes('yellow') || emotion.color.includes('orange') ? 'text-black' : 'text-white'}`}
            >
              <div className="text-5xl mb-1">{emotion.emoji}</div>
              <div className="font-semibold">{emotion.name}</div>
            </button>
          ))}
        </div>

        {selectedEmotion && (
          <Card className={`${selectedEmotion.color} ${selectedEmotion.color.includes('yellow') || selectedEmotion.color.includes('orange') ? 'text-black' : 'text-white'} p-4 rounded-lg shadow-inner`}>
            <h3 className="text-xl font-semibold mb-1">You're feeling {selectedEmotion.name.toLowerCase()} {selectedEmotion.emoji}</h3>
            <p className="text-sm">{selectedEmotion.affirmation}</p>
          </Card>
        )}
        
        {selectedEmotion && (
            <Button onClick={() => setSelectedEmotion(null)} variant="ghost" className="mt-6 text-pink-600 border-pink-300 hover:bg-pink-100">
                Pick Another Feeling
            </Button>
        )}
      </Card>
    </div>
  );
};

export default EmotionalLearningScreen;