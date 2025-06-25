
import React, { useState, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateStoryFromPrompt } from '../services/geminiService';
import { StoryOutput, AgeGroup } from '../types';
import { SparklesIcon, PencilIcon } from '@heroicons/react/24/outline';

// Simple Drawing Canvas (Placeholder)
const DrawingCanvas: React.FC<{ onDrawEnd: (description: string) => void }> = ({ onDrawEnd }) => {
  // This is a placeholder. A real canvas would involve complex event handling.
  // For now, we'll use a text input to describe the drawing.
  const [description, setDescription] = useState('');

  const handleSubmitDrawing = () => {
    if (description.trim()) {
      onDrawEnd(description.trim());
    } else {
      alert("Please describe your drawing or draw something!");
    }
  };

  return (
    <div className="bg-gray-200 aspect-video w-full rounded-lg mb-4 p-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-400">
      <PencilIcon className="h-16 w-16 text-gray-400 mb-2"/>
      <p className="text-center text-gray-500 mb-2 text-sm">
        Imagine you're drawing here! <br/> Then, describe your masterpiece below.
      </p>
      <input 
        type="text" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., A happy sun with sunglasses"
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
      />
      <Button onClick={handleSubmitDrawing} size="sm" className="mt-3 bg-skyBlue hover:bg-sky-500">Done Drawing!</Button>
    </div>
  );
};

const mapAgeGroupForGemini = (ageGroup: AgeGroup | null): '3-5' | '6-8' | null => {
  if (!ageGroup) return null;
  switch (ageGroup) {
    case '2-4':
      return '3-5';
    case '5-7':
      return '6-8'; 
    case '8-10':
      return '6-8';
    default:
      return null;
  }
};


const DrawAndTellScreen: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { kidProfile } = context;

  const [drawingDescription, setDrawingDescription] = useState<string | null>(null);
  const [story, setStory] = useState<StoryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrawingEnd = useCallback(async (description: string) => {
    setDrawingDescription(description);
    setIsLoading(true);
    setError(null);
    setStory(null);
    try {
      const mappedAgeGroup = mapAgeGroupForGemini(kidProfile.ageGroup);
      const generatedStory = await generateStoryFromPrompt(description, mappedAgeGroup);
      setStory(generatedStory);
    } catch (err) {
      console.error(err);
      setError("Oh no! The storyteller is a bit sleepy. Try again?");
    } finally {
      setIsLoading(false);
    }
  }, [kidProfile.ageGroup]);

  const resetActivity = () => {
    setDrawingDescription(null);
    setStory(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="p-4 md:p-6 bg-purple-50 min-h-full">
      <Card className="max-w-lg mx-auto">
        <div className="flex items-center text-purple-600 mb-4">
            <SparklesIcon className="h-8 w-8 mr-2"/>
            <h2 className="text-2xl font-bold font-display">Draw & Tell Adventure!</h2>
        </div>
        
        {!story && !isLoading && (
          <>
            <p className="text-gray-600 mb-4">
              First, draw a picture (or describe what you'd draw). Then, we'll make a story about it!
            </p>
            <DrawingCanvas onDrawEnd={handleDrawingEnd} />
          </>
        )}

        {isLoading && <LoadingSpinner text="Our story wizards are at work..." className="my-8" />}
        
        {error && <p className="text-red-500 text-center my-4">{error}</p>}

        {story && (
          <div className="mt-6 p-4 bg-purple-100 rounded-lg shadow">
            <h3 className="text-2xl font-bold text-purple-700 mb-2 font-kidFriendly">{story.title}</h3>
            {drawingDescription && <p className="text-sm text-gray-500 mb-3 italic">Based on your drawing of: "{drawingDescription}"</p>}
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{story.story}</p>
            {story.characters && story.characters.length > 0 && (
                <p className="text-sm text-purple-600 mt-3"><strong>Characters:</strong> {story.characters.join(', ')}</p>
            )}
            {story.setting && (
                <p className="text-sm text-purple-600"><strong>Setting:</strong> {story.setting}</p>
            )}
          </div>
        )}

        {(story || error) && (
          <Button onClick={resetActivity} fullWidth className="mt-6 bg-purple-500 hover:bg-purple-600">
            Draw Another Story!
          </Button>
        )}
      </Card>
    </div>
  );
};

export default DrawAndTellScreen;
