
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { UserRole, Badge } from '../../types';
import { BADGE_DEFINITIONS } from '../../constants';
import Card from '../../components/Card';
import { StarIcon, ShieldCheckIcon, AcademicCapIcon } from '@heroicons/react/24/solid';

const MyAchievementsScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.kidProfile || !context.kidProgress || context.appState.currentUserRole !== UserRole.Kid) {
    return <div className="p-4 text-center">Loading achievements or not authorized...</div>;
  }
  const { kidProfile, kidProgress } = context;

  const earnedGeneralBadges: Badge[] = kidProgress.badgesEarned
    .map(badgeId => BADGE_DEFINITIONS.find(b => b.id === badgeId && !b.courseId))
    .filter(b => b !== undefined) as Badge[];
    
  const unearnedGeneralBadges: Badge[] = BADGE_DEFINITIONS.filter(bDef => !bDef.courseId && !kidProgress.badgesEarned.includes(bDef.id));

  const earnedCourseBadges: Badge[] = kidProgress.badgesEarned
    .map(badgeId => BADGE_DEFINITIONS.find(b => b.id === badgeId && b.courseId))
    .filter(b => b !== undefined) as Badge[];

  const unearnedCourseBadges: Badge[] = BADGE_DEFINITIONS.filter(bDef => bDef.courseId && !kidProgress.badgesEarned.includes(bDef.id));


  const xpToNextLevel = (kidProgress.level || 1) * 100; 
  const progressPercentage = Math.min(((kidProgress.xp || 0) / xpToNextLevel) * 100, 100);

  const BadgeDisplay: React.FC<{badge: Badge, earned: boolean}> = ({badge, earned}) => (
     <Card className={`!backdrop-blur-sm text-center !p-3 transform hover:scale-105 transition-transform ${earned ? '!bg-white/25' : '!bg-black/10 opacity-70'}`}>
        <span className={`text-5xl block mb-1 ${!earned ? 'filter grayscale':''}`}>{badge.icon}</span>
        <h3 className="font-semibold text-sm leading-tight">{badge.name}</h3>
        <p className={`text-xs mt-0.5 ${earned ? 'opacity-80' : 'opacity-60'}`}>{earned ? badge.description : badge.criteria}</p>
    </Card>
  );

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 min-h-full text-white">
      <div className="text-center mb-8 pt-4">
        <span className="text-6xl p-3 bg-white/20 rounded-full inline-block mb-2 shadow-lg">{kidProfile.avatar}</span>
        <h1 className="text-4xl font-bold font-display text-shadow-md">My Achievements!</h1>
        <p className="text-lg opacity-90">Wow, {kidProfile.name}, look what you've done!</p>
      </div>

      <Card className="!bg-white/20 !backdrop-blur-sm mb-6 !p-5">
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold font-kidFriendly">Level: {kidProgress.level || 1}</h2>
            <AcademicCapIcon className="h-10 w-10 text-yellow-300"/>
        </div>
        <div className="w-full bg-white/30 rounded-full h-5 mb-1 shadow-inner">
          <div 
            className="bg-yellow-400 h-5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-right opacity-80">{kidProgress.xp || 0} / {xpToNextLevel} XP to next level</p>
      </Card>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold font-kidFriendly mb-3 text-shadow-sm">Course Completion Badges!</h2>
        {earnedCourseBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {earnedCourseBadges.map(badge => <BadgeDisplay key={badge.id} badge={badge} earned={true} />)}
          </div>
        ) : (
          <Card className="!bg-white/10 !backdrop-blur-sm text-center !py-6">
            <p className="font-semibold">Complete courses to earn special badges! 🎓</p>
          </Card>
        )}
         {unearnedCourseBadges.length > 0 && earnedCourseBadges.length > 0 && <hr className="my-4 border-white/20"/>}
         {unearnedCourseBadges.length > 0 && (
            <>
                <h3 className="text-lg font-medium font-kidFriendly mt-3 mb-2 opacity-90">Unlock these Course Badges:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     {unearnedCourseBadges.map(badge => <BadgeDisplay key={badge.id} badge={badge} earned={false} />)}
                </div>
            </>
         )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold font-kidFriendly mb-3 text-shadow-sm">Activity Badges!</h2>
        {earnedGeneralBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {earnedGeneralBadges.map(badge => <BadgeDisplay key={badge.id} badge={badge} earned={true} />)}
          </div>
        ) : (
          <Card className="!bg-white/10 !backdrop-blur-sm text-center !py-6">
            <p className="font-semibold">No activity badges yet, but keep playing to earn some! 🎉</p>
          </Card>
        )}
         {unearnedGeneralBadges.length > 0 && earnedGeneralBadges.length > 0 && <hr className="my-4 border-white/20"/>}
         {unearnedGeneralBadges.length > 0 && (
            <>
                <h3 className="text-lg font-medium font-kidFriendly mt-3 mb-2 opacity-90">Unlock these Activity Badges:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {unearnedGeneralBadges.map(badge => <BadgeDisplay key={badge.id} badge={badge} earned={false} />)}
                </div>
            </>
         )}
      </section>
      
    </div>
  );
};

export default MyAchievementsScreen;
