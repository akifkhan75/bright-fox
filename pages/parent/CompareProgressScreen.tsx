import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
import { ChartBarIcon, UsersIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const CompareProgressScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.kidProfile || context.appState.currentUserRole !== UserRole.Parent) {
    return <div className="p-4 text-center">Access Denied or loading...</div>;
  }
  const { kidProfile, kidProgress } = context;

  // Mock data for comparison
  const ageGroupAverageSkills = {
    'counting_to_10': 0.75, // 75% of kids in this age group master this
    'recognizing_shapes': 0.85,
    'simple_addition': 0.40,
    'reading_cvc_words': 0.55,
  };
  const kidSkills = kidProgress?.skillsMastered || {};

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full">
            <ChartBarIcon className="h-8 w-8 text-white"/>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Compare {kidProfile.name}'s Progress</h2>
            <p className="text-sm opacity-90">Anonymized comparison with age-group averages.</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Skill Comparison (Mock Data)</h3>
        <div className="space-y-4">
          {Object.entries(ageGroupAverageSkills).map(([skillId, avgMastery]) => {
            const kidMastered = kidSkills[skillId.replace(/\s+/g, '_').toLowerCase()] || false; // Ensure skillId matches format
            const skillName = skillId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Format skill name
            
            return (
              <div key={skillId}>
                <p className="text-md font-medium text-gray-800">{skillName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-1/2">
                    <p className="text-xs text-gray-500 mb-0.5">{kidProfile.name}'s Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-3.5">
                      <div 
                        className={`h-3.5 rounded-full ${kidMastered ? 'bg-green-500' : 'bg-green-200'}`} 
                        style={{ width: kidMastered ? '100%' : '10%' }} // Simple binary for kid
                      ></div>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <p className="text-xs text-gray-500 mb-0.5">Age Group Average ({kidProfile.ageGroup} yrs)</p>
                    <div className="w-full bg-gray-200 rounded-full h-3.5">
                      <div 
                        className="bg-sky-500 h-3.5 rounded-full" 
                        style={{ width: `${avgMastery * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                {kidMastered && <p className="text-xs text-green-600 mt-1">Great job, {kidProfile.name} has mastered this!</p>}
              </div>
            );
          })}
        </div>
      </Card>
      
      <Card className="!bg-indigo-50 border border-indigo-200">
        <div className="flex items-start">
            <ShieldExclamationIcon className="h-10 w-10 text-indigo-500 mr-3 flex-shrink-0"/>
            <div>
                <h4 className="text-md font-semibold text-indigo-700">Important Note on Comparisons</h4>
                <p className="text-xs text-indigo-600 mt-1">
                This comparison is based on anonymized data from other users in the same age group and should be used as a general guide, not a definitive measure. Every child learns at their own pace! Focus on celebrating {kidProfile.name}'s unique journey and effort.
                </p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default CompareProgressScreen;
