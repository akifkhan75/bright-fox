import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PuzzlePieceIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

const JigsawPuzzleScreen: React.FC = () => {
  // Mock state for puzzle completion
  const [solved, setSolved] = React.useState(false);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-lime-200 via-emerald-200 to-teal-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <PuzzlePieceIcon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-emerald-700 mb-1 font-display">Jigsaw Fun!</h2>
        <p className="text-gray-600 mb-6">Put the pieces together to reveal the picture!</p>

        <div className="bg-gray-200 aspect-[4/3] w-full rounded-lg mb-6 p-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-400">
          {!solved ? (
            <>
              <img src="https://picsum.photos/seed/jigsawpuzzleincomplete/200/150?blur=2" alt="Blurred puzzle" className="rounded-md opacity-70"/>
              <p className="text-gray-500 mt-3 text-sm">Imagine puzzle pieces here that you can drag and drop!</p>
              <Button onClick={() => setSolved(true)} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
                Show Solved (Mock)
              </Button>
            </>
          ) : (
            <>
              <img src="https://picsum.photos/seed/jigsawpuzzlesolved/200/150" alt="Solved puzzle" className="rounded-md shadow-lg"/>
              <p className="text-emerald-700 mt-3 text-lg font-semibold">Yay! Puzzle Solved!</p>
            </>
          )}
        </div>
        
        {solved && (
           <Button onClick={() => setSolved(false)} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
             Play Again (Reset Mock)
           </Button>
        )}
      </Card>
    </div>
  );
};

export default JigsawPuzzleScreen;
