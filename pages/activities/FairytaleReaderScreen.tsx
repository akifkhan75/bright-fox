import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BookOpenIcon } from '@heroicons/react/24/solid';

// Mock Fairytale
const fairytale = {
  title: "The Little Fox and the Sparkling River",
  pages: [
    "Once upon a time, in a lush green forest, lived a little fox named Finley. Finley loved adventures more than anything!",
    "One sunny morning, Finley heard a magical whisper coming from the Sparkling River. 'Come find me,' it seemed to say.",
    "Curious, Finley tiptoed to the riverbank. The water shimmered with rainbow colors! In the middle, a tiny, glowing fish was waving its fin.",
    "'Hello!' chirped Finley. 'Are you the magic whisper?' The fish giggled, a sound like tiny bells. 'I am! I guard the river's joy. Will you help me spread it?'",
    "Finley nodded eagerly. The fish gave Finley a smooth, glowing pebble. 'Take this to a sad part of the forest, and joy will bloom!'",
    "Finley found a gloomy patch where flowers drooped. Placing the pebble down, the whole area lit up with color and happy songs! Finley learned that sharing joy makes it grow even bigger.",
  ],
  moral: "Sharing joy and kindness makes the world a brighter place."
};

const FairytaleReaderScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    if (currentPage < fairytale.pages.length -1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const isLastPage = currentPage === fairytale.pages.length -1;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full">
        <BookOpenIcon className="h-12 w-12 text-sky-600 mx-auto mb-4" />
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-700 mb-3 text-center font-display">{fairytale.title}</h2>
        
        <Card className="!bg-white/70 min-h-[150px] sm:min-h-[200px] flex items-center justify-center p-4 sm:p-6 mb-6 shadow-inner">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center font-kidFriendly">
                {fairytale.pages[currentPage]}
            </p>
        </Card>

        {isLastPage && (
            <Card className="!bg-yellow-100 text-yellow-700 p-3 text-center mb-4">
                <h4 className="font-semibold">Moral of the Story:</h4>
                <p className="text-sm">{fairytale.moral}</p>
            </Card>
        )}

        <div className="flex justify-between items-center">
          <Button onClick={handlePrevPage} disabled={currentPage === 0} variant="secondary" className="!bg-pink-500 hover:!bg-pink-600">
            Previous
          </Button>
          <p className="text-sm text-gray-500">Page {currentPage + 1} of {fairytale.pages.length}</p>
          <Button onClick={isLastPage ? () => setCurrentPage(0) : handleNextPage} className="bg-sky-500 hover:bg-sky-600">
            {isLastPage ? "Read Again" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FairytaleReaderScreen;
