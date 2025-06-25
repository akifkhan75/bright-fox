
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { UserRole, View } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { StarIcon, SparklesIcon, CalendarDaysIcon, CheckIcon } from '@heroicons/react/24/solid';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  features: string[];
  icon: React.ElementType;
  color: string; // Tailwind bg color for button
  highlight?: boolean;
}

const tiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: '$0',
    billingCycle: 'Always Free',
    features: ['Access to basic activities', 'Limited Draw & Tell stories', 'Limited Why Zone questions'],
    icon: SparklesIcon,
    color: 'bg-gray-400 hover:bg-gray-500',
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: '$7.99',
    billingCycle: '/ month',
    features: ['All Free Explorer features', 'Unlimited access to all activities', 'Unlimited AI stories & Q&A', 'Unlock premium courses', 'Detailed progress reports'],
    icon: StarIcon,
    color: 'bg-sky-500 hover:bg-sky-600',
    highlight: true,
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    price: '$69.99',
    billingCycle: '/ year (Save 25%)',
    features: ['All Premium Monthly features', 'Priority support', 'Early access to new features'],
    icon: CalendarDaysIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

const ParentSubscriptionScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || context.appState.currentUserRole !== UserRole.Parent) {
    context?.setViewWithPath(View.Login, '/login?role=Parent', { replace: true });
    return <div className="p-4 text-center">Access Denied.</div>;
  }
  
  const currentSubscription = "Free Explorer"; // Mock

  const handleChoosePlan = (tierId: string) => {
    alert(`Choosing plan: ${tierId} (Mock functionality - Stripe integration needed)`);
    // In a real app, this would initiate the payment process.
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-sky-100 via-indigo-100 to-purple-100 min-h-full">
      <Card className="max-w-xl mx-auto mb-6 !bg-transparent !shadow-none">
        <div className="text-center">
            <StarIcon className="h-12 w-12 text-yellow-400 mx-auto mb-3"/>
            <h1 className="text-3xl font-bold text-gray-800 font-display">Unlock Premium Adventures!</h1>
            <p className="text-gray-600 mt-2">Choose the best plan for your family and supercharge your child's learning journey.</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map(tier => (
          <Card key={tier.id} className={`flex flex-col !shadow-xl hover:!shadow-2xl transition-shadow ${tier.highlight ? 'border-4 border-yellow-400' : 'border border-gray-200'}`}>
            <div className="p-6">
                <div className="flex items-center mb-3">
                    <tier.icon className={`h-8 w-8 mr-3 ${tier.highlight ? 'text-yellow-500' : 'text-sky-500'}`} />
                    <h2 className="text-xl font-semibold text-gray-800">{tier.name}</h2>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{tier.price} <span className="text-sm font-normal text-gray-500">{tier.billingCycle}</span></p>
                {tier.highlight && <p className="text-xs text-yellow-600 font-semibold mb-3">Most Popular!</p>}
                
                <ul className="space-y-2 text-sm text-gray-600 my-6">
                {tier.features.map(feature => (
                    <li key={feature} className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5_ flex-shrink-0" />
                    <span>{feature}</span>
                    </li>
                ))}
                </ul>
            </div>
            <div className="mt-auto p-6 pt-0">
                {currentSubscription === tier.name ? (
                     <Button fullWidth disabled className="!bg-gray-300 !text-gray-500 cursor-not-allowed">
                        Current Plan
                    </Button>
                ) : (
                    <Button 
                        onClick={() => handleChoosePlan(tier.id)} 
                        fullWidth 
                        className={`${tier.color} !font-semibold`}
                    >
                        Choose {tier.name.split(' ')[0]}
                    </Button>
                )}
            </div>
          </Card>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 mt-8">
        Subscriptions can be managed or canceled anytime from your account settings. All prices are in USD.
      </p>
    </div>
  );
};

export default ParentSubscriptionScreen;
