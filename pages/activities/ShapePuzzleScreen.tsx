import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PuzzlePieceIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

// Mock data for shapes
const shapes = [
  { id: 'circle', color: 'bg-red-400', style: { width: '60px', height: '60px', borderRadius: '50%' } },
  { id: 'square', color: 'bg-blue-400', style: { width: '60px', height: '60px' } },
  { id: 'triangle', color: 'bg-yellow-400', style: { width: '0', height: '0', borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '60px solid currentColor' } }, // currentColor will be tricky with Tailwind bg
];

const targets = [
  { id: 'circle_target', accepts: 'circle', style: { width: '70px', height: '70px', borderRadius: '50%', border: '2px dashed gray' } },
  { id: 'square_target', accepts: 'square', style: { width: '70px', height: '70px', border: '2px dashed gray' } },
  { id: 'triangle_target', accepts: 'triangle', style: { width: '70px', height: '60px', border: '2px dashed gray', display: 'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'gray'} , label: 'Triangle' },
];

const ShapePuzzleScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [completed, setCompleted] = useState<string[]>([]); // Store IDs of placed shapes

  // This is a very simplified mock. Real drag and drop is complex.
  const handleShapeClick = (shapeId: string) => {
    if (!completed.includes(shapeId)) {
      // In a real game, you'd check if it's placed on the correct target.
      // For this mock, clicking a shape "completes" it if its target is available.
      const target = targets.find(t => t.accepts === shapeId);
      if (target && !completed.includes(target.accepts)) {
          setCompleted(prev => [...prev, shapeId]);
      }
    }
  };
  
  const allShapesPlaced = completed.length === shapes.length;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-green-200 via-lime-200 to-yellow-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <PuzzlePieceIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-700 mb-1 font-display">Shape Puzzles!</h2>
        <p className="text-gray-600 mb-6">Match the shapes to their outlines. Click a shape to place it!</p>

        {/* Targets Area */}
        <div className="flex justify-around items-center bg-gray-100 p-4 rounded-lg mb-6 min-h-[100px]">
          {targets.map(target => (
            <div key={target.id} style={{...target.style, borderColor: completed.includes(target.accepts) ? 'green' : 'gray' }} className={`flex items-center justify-center ${completed.includes(target.accepts) ? 'bg-green-100' : ''}`}>
              {completed.includes(target.accepts) ? 
                <CheckCircleIcon className="h-8 w-8 text-green-500"/> :
                target.label || ''
              }
            </div>
          ))}
        </div>

        {/* Draggable Shapes Area */}
        {!allShapesPlaced ? (
          <div className="flex justify-around items-center mb-6 min-h-[80px]">
            {shapes.filter(s => !completed.includes(s.id)).map(shape => (
              <button 
                key={shape.id} 
                onClick={() => handleShapeClick(shape.id)}
                className={`cursor-pointer transition-all hover:opacity-80 hover:scale-110 ${shape.color} ${shape.id === 'triangle' ? 'text-yellow-400' : ''}`} // Special handling for CSS triangle color
                style={shape.style}
                aria-label={`Place ${shape.id}`}
              >
                {/* For CSS triangle to pick up color if bg-* is not working directly */}
                {shape.id === 'triangle' && <span className="opacity-0">.</span>} 
              </button>
            ))}
          </div>
        ) : (
            <Card className="!bg-green-100 text-green-700 p-4 my-6">
                <CheckCircleIcon className="h-10 w-10 mx-auto mb-2"/>
                <h3 className="text-xl font-semibold">Great Job!</h3>
                <p>You matched all the shapes!</p>
            </Card>
        )}
        
        <Button 
            onClick={() => { setCompleted([]); /* Potentially load next puzzle */ }} 
            className="mt-4 bg-green-500 hover:bg-green-600"
            disabled={!allShapesPlaced && completed.length > 0}
        >
            {allShapesPlaced ? "Play Again!" : (completed.length > 0 ? "Reset" : "Start Puzzle")}
        </Button>
      </Card>
    </div>
  );
};

export default ShapePuzzleScreen;
