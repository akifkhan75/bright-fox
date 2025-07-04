import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../../App';
import { UserRole, View as ViewType } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import StarIcon from '../../assets/icons/StarIcon';
// import SparklesIcon from '../../assets/icons/SparklesIcon';
// import CalendarDaysIcon from '../../assets/icons/CalendarDaysIcon';
// import CheckIcon from '../../assets/icons/CheckIcon';
import { useNavigation } from '@react-navigation/native';

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  features: string[];
  icon: React.ElementType | string;
  color: string;
  highlight?: boolean;
}

const tiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    price: '$0',
    billingCycle: 'Always Free',
    features: ['Access to basic activities', 'Limited Draw & Tell stories', 'Limited Why Zone questions'],
    icon: 'SparklesIcon',
    color: 'bg-gray-400',
  },
  {
    id: 'monthly',
    name: 'Premium Monthly',
    price: '$7.99',
    billingCycle: '/ month',
    features: ['All Free Explorer features', 'Unlimited access to all activities', 'Unlimited AI stories & Q&A', 'Unlock premium courses', 'Detailed progress reports'],
    icon: 'StarIcon',
    color: 'bg-sky-500',
    highlight: true,
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    price: '$69.99',
    billingCycle: '/ year (Save 25%)',
    features: ['All Premium Monthly features', 'Priority support', 'Early access to new features'],
    icon: 'CalendarDaysIcon',
    color: 'bg-purple-500',
  },
];

const ParentSubscriptionScreen: React.FC = () => {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  if (!context || context.appState.currentUserRole !== UserRole.Parent) {
    navigation.navigate('Login', { role: 'Parent' });
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied.</Text>
      </View>
    );
  }
  
  const currentSubscription = "Free Explorer"; // Mock

  const handleChoosePlan = (tierId: string) => {
    alert(`Choosing plan: ${tierId} (Mock functionality - Stripe integration needed)`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.headerCard}>
        <View style={styles.headerContent}>
          <StarIcon width={48} height={48} fill="#facc15" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Unlock Premium Adventures!</Text>
          <Text style={styles.headerSubtitle}>
            Choose the best plan for your family and supercharge your child's learning journey.
          </Text>
        </View>
      </Card>

      <View style={styles.tiersContainer}>
        {tiers.map(tier => {
          const Icon = tier.icon;
          return (
            <Card 
              key={tier.id} 
              style={[
                styles.tierCard,
                tier.highlight && styles.highlightedTierCard
              ]}
            >
              <View style={styles.tierContent}>
                <View style={styles.tierHeader}>
                  <Icon width={32} height={32} fill={tier.highlight ? "#facc15" : "#0ea5e9"} />
                  <Text style={styles.tierName}>{tier.name}</Text>
                </View>
                <Text style={styles.tierPrice}>
                  {tier.price} <Text style={styles.tierBillingCycle}>{tier.billingCycle}</Text>
                </Text>
                {tier.highlight && (
                  <Text style={styles.popularBadge}>Most Popular!</Text>
                )}
                
                <View style={styles.featuresList}>
                  {tier.features.map(feature => (
                    <View key={feature} style={styles.featureItem}>
                      <CheckIcon width={16} height={16} fill="#10b981" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.tierFooter}>
                {currentSubscription === tier.name ? (
                  <Button 
                    style={styles.currentPlanButton}
                    textStyle={styles.currentPlanButtonText}
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    onPress={() => handleChoosePlan(tier.id)}
                    style={[
                      styles.chooseButton,
                      { backgroundColor: tier.color === 'bg-sky-500' ? '#0ea5e9' : 
                                        tier.color === 'bg-purple-500' ? '#8b5cf6' : '#9ca3af' }
                    ]}
                  >
                    Choose {tier.name.split(' ')[0]}
                  </Button>
                )}
              </View>
            </Card>
          );
        })}
      </View>

      <Text style={styles.footerText}>
        Subscriptions can be managed or canceled anytime from your account settings. All prices are in USD.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#e0f2fe',
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerCard: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
    marginBottom: 24,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  tiersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  tierCard: {
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    flex: 1,
    minWidth: 300,
  },
  highlightedTierCard: {
    borderWidth: 4,
    borderColor: '#facc15',
  },
  tierContent: {
    padding: 24,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  tierBillingCycle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#64748b',
  },
  popularBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 16,
  },
  featuresList: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    flex: 1,
  },
  tierFooter: {
    padding: 24,
    paddingTop: 0,
  },
  currentPlanButton: {
    backgroundColor: '#e5e7eb',
  },
  currentPlanButtonText: {
    color: '#6b7280',
  },
  chooseButton: {
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ParentSubscriptionScreen;