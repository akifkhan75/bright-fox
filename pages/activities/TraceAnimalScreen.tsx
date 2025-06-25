import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PencilIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const TraceAnimalScreen: React.FC = () => {
  const [traced, setTraced] = React.useState(false);
  // Example animal outline (SVG or image)
  const animalOutline = (
    <svg viewBox="0 0 100 100" className="w-48 h-48 text-gray-400">
      {/* Simple Cat Outline Example */}
      <path d="M50 10 C 20 10, 20 40, 20 40 C 20 60, 30 70, 50 90 C 70 70, 80 60, 80 40 C 80 40, 80 10, 50 10 Z M40 50 A5 5 0 0 1 30 50 A5 5 0 0 1 40 50 M70 50 A5 5 0 0 1 60 50 A5 5 0 0 1 70 50 M30 70 Q50 80 70 70" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <PencilIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-purple-700 mb-1 font-display">Trace the Animal!</h2>
        <p className="text-gray-600 mb-6">Follow the lines to draw a cute animal!</p>

        <div className={`bg-white aspect-square w-full max-w-xs mx-auto rounded-lg mb-6 p-4 flex flex-col items-center justify-center border-2 ${traced ? 'border-green-500' : 'border-dashed border-gray-400'}`}>
          {animalOutline}
          {traced && <CheckCircleIcon className="h-10 w-10 text-green-500 absolute"/>}
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          {traced ? "Great tracing!" : "Imagine your finger is a magic pencil!"}
        </p>

        <Button 
          onClick={() => setTraced(!traced)} 
          className={`mt-4 ${traced ? 'bg-pink-500 hover:bg-pink-600' : 'bg-purple-500 hover:bg-purple-600'}`}
        >
          {traced ? "Trace Another!" : "I Traced It! (Mock)"}
        </Button>
      </Card>
    </div>
  );
};

export default TraceAnimalScreen;
