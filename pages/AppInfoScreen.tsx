
import React, { useContext } from 'react';
import Card from '../components/Card';
import { APP_NAME } from '../constants';
import { ShieldCheckIcon, SparklesIcon, HeartIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import { AppContext } from '../App';
import { View } from '../types';


const AppInfoScreen: React.FC = () => {
  const context = useContext(AppContext);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full">
      <Card className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <img src="https://picsum.photos/seed/brightfoxinfologo/100/100" alt={`${APP_NAME} Logo`} className="w-24 h-24 rounded-full mx-auto mb-3 shadow-lg border-4 border-skyBlue" />
          <h2 className="text-3xl font-bold text-skyBlue font-display">{APP_NAME}</h2>
          <p className="text-gray-500">Version 1.0.0 (Alpha)</p>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="text-lg">
            Welcome to <span className="font-semibold text-skyBlue">{APP_NAME}</span> – where learning is a joyful adventure!
          </p>
          <p>
            Our mission is to provide a safe, engaging, and ad-free environment for children to explore their creativity, learn new skills, and develop a love for knowledge.
          </p>

          <h3 className="text-xl font-semibold text-skyBlue pt-2 font-display">Our Core Values:</h3>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start">
              <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-2 mt-0.5_ flex-shrink-0" />
              <span><span className="font-semibold">Safe & Ad-Free:</span> No ads, no manipulative tactics. Just pure fun and learning.</span>
            </li>
            <li className="flex items-start">
              <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2 mt-0.5_ flex-shrink-0" />
              <span><span className="font-semibold">Creativity First:</span> We encourage kids to create, not just consume.</span>
            </li>
            <li className="flex items-start">
              <HeartIcon className="h-6 w-6 text-pink-500 mr-2 mt-0.5_ flex-shrink-0" />
              <span><span className="font-semibold">Parental Partnership:</span> Full transparency and control for parents.</span>
            </li>
             <li className="flex items-start">
              <CubeTransparentIcon className="h-6 w-6 text-purple-500 mr-2 mt-0.5_ flex-shrink-0" />
              <span><span className="font-semibold">AI-Enhanced Learning:</span> Personalized experiences powered by helpful AI (like Gemini!).</span>
            </li>
          </ul>
          
          <p className="pt-2">
            This app is a demonstration and uses placeholder content and mock data in some areas. The Gemini API integration provides dynamic story generation and Q&A capabilities.
          </p>

          {context && (
            <Button 
              onClick={() => context.setViewWithPath(View.ParentDashboard, '/parentdashboard')}
              fullWidth
              variant="ghost"
              className="mt-6"
            >
              Go to Parent Dashboard
            </Button>
          )}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} {APP_NAME} Team. All imaginary rights reserved.
        </p>
      </Card>
    </div>
  );
};

export default AppInfoScreen;