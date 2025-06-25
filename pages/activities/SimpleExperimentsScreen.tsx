import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BeakerIcon, LightBulbIcon } from '@heroicons/react/24/solid';

const experiments = [
  {
    title: "Float or Sink?",
    description: "Gather different small items (like a coin, a leaf, a small toy, a crayon). Fill a bowl with water. Gently place each item in the water. Does it float or sink? Why do you think that is?",
    materials: ["Bowl of water", "Various small household items"],
    explanation: "Heavy things for their size (dense things) often sink, while lighter things for their size (less dense things) often float. Shape also matters!"
  },
  {
    title: "Magic Milk Colors",
    description: "Pour some milk into a shallow dish. Add a few drops of different food coloring. Dip a cotton swab in dish soap, then touch it to the milk near the colors. Watch the colors swirl!",
    materials: ["Milk", "Shallow dish", "Food coloring", "Dish soap", "Cotton swab"],
    explanation: "Dish soap breaks the surface tension of the milk and reacts with the fat, causing the colors to move and mix in cool patterns."
  }
];

const SimpleExperimentsScreen: React.FC = () => {
  const [currentExperimentIndex, setCurrentExperimentIndex] = React.useState(0);
  const experiment = experiments[currentExperimentIndex];

  const nextExperiment = () => {
    setCurrentExperimentIndex((prev) => (prev + 1) % experiments.length);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-cyan-200 via-sky-200 to-blue-200 min-h-full flex flex-col items-center justify-center">
      <Card className="max-w-lg w-full">
        <div className="text-center mb-4">
            <BeakerIcon className="h-12 w-12 text-cyan-600 mx-auto mb-2" />
            <h2 className="text-3xl font-bold text-cyan-700 font-display">Simple Science Lab!</h2>
        </div>
        
        <Card className="!bg-white/80 mb-6 shadow-inner">
            <div className="flex items-center text-sky-700 mb-2">
                <LightBulbIcon className="h-7 w-7 mr-2"/>
                <h3 className="text-xl font-semibold">{experiment.title}</h3>
            </div>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{experiment.description}</p>
            
            <h4 className="font-semibold text-gray-600 text-sm">You will need:</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 mb-3">
                {experiment.materials.map(mat => <li key={mat}>{mat}</li>)}
            </ul>
            
            <h4 className="font-semibold text-gray-600 text-sm">What's Happening? (Simplified)</h4>
            <p className="text-xs text-gray-600">{experiment.explanation}</p>
        </Card>

        <Button 
          onClick={nextExperiment} 
          className="w-full bg-cyan-500 hover:bg-cyan-600"
        >
          Try Another Experiment!
        </Button>
        <p className="text-xs text-gray-500 mt-4 text-center">Adult supervision recommended for all experiments.</p>
      </Card>
    </div>
  );
};

export default SimpleExperimentsScreen;
