import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { PaintBrushIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

// Mock Color by Number data
const colorMap = [
  { number: 1, color: 'bg-red-500', label: 'Red' },
  { number: 2, color: 'bg-blue-500', label: 'Blue' },
  { number: 3, color: 'bg-yellow-400', label: 'Yellow' },
  { number: 4, color: 'bg-green-500', label: 'Green' },
];

const imageSegments = [ // Simplified representation of an image
  { id: 'seg1', number: 1, area: 'top-left' },
  { id: 'seg2', number: 2, area: 'top-right' },
  { id: 'seg3', number: 3, area: 'bottom-left' },
  { id: 'seg4', number: 4, area: 'bottom-right' },
];

const ColorByNumberScreen: React.FC = () => {
  const [coloredSegments, setColoredSegments] = React.useState<Record<string, string>>({}); // { segId: colorClass }
  
  const handleColorSegment = (segmentId: string, colorClass: string) => {
    setColoredSegments(prev => ({...prev, [segmentId]: colorClass }));
  };

  const allColored = Object.keys(coloredSegments).length === imageSegments.length;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-violet-200 via-fuchsia-200 to-rose-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <PaintBrushIcon className="h-12 w-12 text-violet-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-violet-700 mb-1 font-display">Color by Number!</h2>
        <p className="text-gray-600 mb-6">Match the numbers to the colors to create a beautiful picture!</p>

        {/* Color Palette */}
        <div className="flex justify-center space-x-2 mb-4">
          {colorMap.map(c => (
            <div key={c.number} className="text-center">
              <div className={`w-8 h-8 rounded-full shadow ${c.color} mx-auto`}></div>
              <p className="text-xs mt-1">{c.number} = {c.label}</p>
            </div>
          ))}
        </div>

        {/* Image Area (Mock) */}
        <div className="grid grid-cols-2 gap-1 bg-gray-100 p-2 rounded-lg mb-6 w-48 h-48 mx-auto border-2 border-gray-300">
          {imageSegments.map(seg => {
            const segmentColorInfo = colorMap.find(c => c.number === seg.number);
            return (
              <button
                key={seg.id}
                onClick={() => segmentColorInfo && handleColorSegment(seg.id, segmentColorInfo.color)}
                className={`w-full h-full flex items-center justify-center text-lg font-bold border border-gray-300 transition-colors ${coloredSegments[seg.id] || 'bg-white hover:bg-gray-50'}`}
                style={{ backgroundColor: coloredSegments[seg.id] ? '' : undefined }} // Let Tailwind class take over if colored
                aria-label={`Color segment ${seg.number}`}
              >
                {!coloredSegments[seg.id] && seg.number}
              </button>
            );
          })}
        </div>
        
        {allColored && (
            <Card className="!bg-green-100 text-green-700 p-4 my-4">
                <CheckCircleIcon className="h-10 w-10 mx-auto mb-2"/>
                <h3 className="text-xl font-semibold">Beautifully Colored!</h3>
            </Card>
        )}

        <Button 
          onClick={() => setColoredSegments({})} 
          className="mt-4 bg-violet-500 hover:bg-violet-600"
          disabled={!allColored && Object.keys(coloredSegments).length > 0 && !allColored}
        >
          {allColored ? "Color Again!" : (Object.keys(coloredSegments).length > 0 ? "Reset Colors" : "Start Coloring!")}
        </Button>
      </Card>
    </div>
  );
};

export default ColorByNumberScreen;
