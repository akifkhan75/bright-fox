import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CalculatorIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const CountingGameScreen: React.FC = () => {
  const [targetCount, setTargetCount] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);
  const [score, setScore] = useState(0);

  const generateProblem = () => {
    setFeedback(null);
    const newTarget = Math.floor(Math.random() * 8) + 2; // Count between 2 and 9
    setTargetCount(newTarget);

    const correctOption = newTarget;
    let newOptions = [correctOption];
    while (newOptions.length < 3) {
      const randomOption = Math.floor(Math.random() * 9) + 1;
      if (!newOptions.includes(randomOption)) {
        newOptions.push(randomOption);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5)); // Shuffle options
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleOptionClick = (option: number) => {
    if (option === targetCount) {
      setFeedback({ message: "That's Right!", correct: true });
      setScore(s => s + 1);
      setTimeout(generateProblem, 1500);
    } else {
      setFeedback({ message: "Try Again!", correct: false });
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CalculatorIcon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-orange-700 mb-1 font-display">Counting Fun!</h2>
        <p className="text-gray-600 mb-4">How many apples can you count?</p>
        <p className="text-sm text-gray-500 mb-4">Score: <span className="font-bold">{score}</span></p>

        {/* Display Items to Count */}
        <div className="flex flex-wrap justify-center items-center bg-gray-100 p-4 rounded-lg mb-6 min-h-[100px] shadow-inner">
          {Array.from({ length: targetCount }).map((_, index) => (
            <span key={index} className="text-4xl m-1" role="img" aria-label="apple">🍎</span>
          ))}
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {options.map(opt => (
            <Button 
              key={opt} 
              onClick={() => handleOptionClick(opt)}
              className="!text-2xl !py-4 bg-orange-500 hover:bg-orange-600 font-kidFriendly"
              disabled={!!feedback}
            >
              {opt}
            </Button>
          ))}
        </div>
        
        {feedback && (
            <Card className={`!p-3 ${feedback.correct ? '!bg-green-100 text-green-700' : '!bg-red-100 text-red-700'}`}>
                <div className="flex items-center justify-center">
                    {feedback.correct ? <CheckCircleIcon className="h-6 w-6 mr-2"/> : <XCircleIcon className="h-6 w-6 mr-2"/>}
                    <p className="font-semibold">{feedback.message}</p>
                </div>
            </Card>
        )}

        {!feedback && <div className="h-[52px]"></div> /* Placeholder for feedback height */}
        
      </Card>
    </div>
  );
};

export default CountingGameScreen;
