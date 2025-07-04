import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
// import BanknotesIcon from '../../assets/icons/BanknotesIcon';
// import CalendarDaysIcon from '../../assets/icons/CalendarDaysIcon';
// import ArrowDownTrayIcon from '../../assets/icons/ArrowDownTrayIcon';
// import { LinearGradient } from 'expo-linear-gradient';

const TeacherEarningsScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return (
      <View style={styles.deniedContainer}>
        <Text>Access Denied.</Text>
      </View>
    );
  }

  // Mock Data
  const totalEarnings = 123.45;
  const lastPayoutDate = '2024-07-01';
  const lastPayoutAmount = 75.00;
  const nextPayoutDate = '2024-08-01';
  const minimumPayoutThreshold = 50.00;
  const nextPayoutEstimate = totalEarnings - lastPayoutAmount > 0 ? totalEarnings - lastPayoutAmount : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.headerCard}>
        {/* <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        > */}
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              {/* <BanknotesIcon width={32} height={32} fill="#ffffff" /> */}
              <Text>Bank note icon</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>My Earnings</Text>
              <Text style={styles.headerSubtitle}>Track your revenue from premium content.</Text>
            </View>
          </View>
        {/* </LinearGradient> */}
      </Card>

      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: '#ecfdf5' }]}>
          <Text style={[styles.statLabel, { color: '#047857' }]}>Total Earnings (All Time)</Text>
          <Text style={[styles.statValue, { color: '#059669' }]}>${totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statNote}>Based on sales of your premium activities.</Text>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: '#f0f9ff' }]}>
          <Text style={[styles.statLabel, { color: '#0369a1' }]}>Next Payout Estimate</Text>
          <Text style={[styles.statValue, { color: '#0284c7' }]}>${nextPayoutEstimate.toFixed(2)}</Text>
          <Text style={styles.statNote}>Scheduled for {nextPayoutDate} (if threshold met).</Text>
        </Card>
      </View>

      <Card style={styles.payoutCard}>
        <Text style={styles.sectionTitle}>Payout Information</Text>
        <View style={styles.payoutInfo}>
          <Text style={styles.payoutText}><Text style={styles.bold}>Minimum Payout Threshold:</Text> ${minimumPayoutThreshold.toFixed(2)}</Text>
          <Text style={styles.payoutText}><Text style={styles.bold}>Last Payout:</Text> ${lastPayoutAmount.toFixed(2)} on {lastPayoutDate}</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.payoutText}><Text style={styles.bold}>Payment Method:</Text> PayPal (teacher@example.com) - </Text>
            <Button 
              style={styles.changeButton}
              textStyle={styles.changeButtonText}
            >
              Change
            </Button>
          </View>
          <Text style={styles.payoutNote}>Payouts are processed on the 1st of each month for balances exceeding the threshold. A 30% platform fee applies.</Text>
        </View>
        <Button 
          style={styles.downloadButton}
          textStyle={styles.downloadButtonText}
        >
          {/* <ArrowDownTrayIcon width={20} height={20} fill="#ffffff" /> */}
          <Text style={styles.downloadButtonText}> Download Earnings Report (CSV)</Text>
        </Button>
      </Card>
      
      <Card style={styles.transactionsCard}>
        <Text style={styles.sectionTitle}>Recent Transactions (Mock)</Text>
        <View style={styles.transactionsList}>
          <View style={[styles.transactionItem, styles.transactionItemAlt]}>
            <Text>Premium Story "The Brave Knight" Sale</Text>
            <Text style={styles.transactionAmount}>+$0.70</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text>Premium Puzzle "Space Adventure" Sale</Text>
            <Text style={styles.transactionAmount}>+$0.70</Text>
          </View>
          <View style={[styles.transactionItem, styles.transactionItemAlt]}>
            <Text>Premium Quiz "Dino Facts" Sale</Text>
            <Text style={styles.transactionAmount}>+$0.70</Text>
          </View>
        </View>
        <Button 
          style={styles.viewAllButton}
          textStyle={styles.viewAllButtonText}
        >
          View All Transactions
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statNote: {
    fontSize: 12,
    color: '#6b7280',
  },
  payoutCard: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  payoutInfo: {
    marginBottom: 16,
  },
  payoutText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  changeButton: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  changeButtonText: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  payoutNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  downloadButton: {
    backgroundColor: '#059669',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 8,
  },
  transactionsCard: {
    padding: 16,
  },
  transactionsList: {
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  transactionItemAlt: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  transactionAmount: {
    fontWeight: '600',
    color: '#059669',
  },
  viewAllButton: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
});

export default TeacherEarningsScreen;