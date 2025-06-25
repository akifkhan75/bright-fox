
import React from 'react';
import { useLocation } from 'react-router-dom'; // Added
import Card from '../components/Card';
import { PuzzlePieceIcon } from '@heroicons/react/24/solid'; // Example icon

interface ActivityPlaceholderScreenProps {
  activityName?: string; // Prop is now optional, primarily use location.state
}

const ActivityPlaceholderScreen: React.FC<ActivityPlaceholderScreenProps> = ({ activityName: propActivityName }) => {
  const location = useLocation();
  const activityNameFromState = location.state?.activityName as string | undefined;
  
  // Prioritize state, then prop, then fallback
  const activityName = activityNameFromState || propActivityName || "Awesome Activity";

  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center min-h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <Card className="max-w-md w-full">
        <PuzzlePieceIcon className="h-20 w-20 text-indigo-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-indigo-600 mb-3 font-display">{activityName}</h2>
        <p className="text-gray-600 mb-6 text-lg">
          This fun activity is under construction! 🚧
        </p>
        <p className="text-gray-500 text-sm">
          Our little helpers are working hard to bring you exciting new games and learning experiences. Check back soon!
        </p>
        <img src="https://picsum.photos/seed/constructionfox/300/200" alt="Cute animal under construction" className="mt-6 rounded-lg shadow-md mx-auto"/>
      </Card>
    </div>
  );
};

export default ActivityPlaceholderScreen;