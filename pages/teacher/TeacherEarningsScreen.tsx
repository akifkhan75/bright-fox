import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { UserRole } from '../../types';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { BanknotesIcon, CalendarDaysIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid'; // Using solid for emphasis

const TeacherEarningsScreen: React.FC = () => {
  const context = useContext(AppContext);

  if (!context || !context.teacherProfile || context.appState.currentUserRole !== UserRole.Teacher) {
    return <div className="p-4 text-center">Access Denied.</div>;
  }
  const { teacherProfile } = context;

  // Mock Data
  const totalEarnings = 123.45;
  const lastPayoutDate = '2024-07-01';
  const lastPayoutAmount = 75.00;
  const nextPayoutDate = '2024-08-01';
  const minimumPayoutThreshold = 50.00;

  return (
    <div className="p-4 md:p-6 bg-slate-100 min-h-full">
      <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full">
            <BanknotesIcon className="h-8 w-8 text-white"/>
          </div>
          <div>
            <h2 className="text-2xl font-bold">My Earnings</h2>
            <p className="text-sm opacity-90">Track your revenue from premium content.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="text-center !bg-green-50">
          <p className="text-sm text-green-700 font-medium">Total Earnings (All Time)</p>
          <p className="text-4xl font-bold text-green-600 my-2">${totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-500">Based on sales of your premium activities.</p>
        </Card>
        <Card className="text-center !bg-sky-50">
          <p className="text-sm text-sky-700 font-medium">Next Payout Estimate</p>
          <p className="text-4xl font-bold text-sky-600 my-2">${(totalEarnings - lastPayoutAmount > 0 ? totalEarnings - lastPayoutAmount : 0).toFixed(2)}</p>
          <p className="text-xs text-gray-500">Scheduled for {nextPayoutDate} (if threshold met).</p>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Payout Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Minimum Payout Threshold:</strong> ${minimumPayoutThreshold.toFixed(2)}</p>
          <p><strong>Last Payout:</strong> ${lastPayoutAmount.toFixed(2)} on {lastPayoutDate}</p>
          <p><strong>Payment Method:</strong> PayPal (teacher@example.com) - <Button variant="ghost" size="sm" className="!p-0 !text-sm !text-blue-600 hover:!underline">Change</Button></p>
          <p className="text-xs text-gray-500 mt-1">Payouts are processed on the 1st of each month for balances exceeding the threshold. A 30% platform fee applies.</p>
        </div>
        <Button className="mt-4 bg-emerald-500 hover:bg-emerald-600">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2 inline" /> Download Earnings Report (CSV)
        </Button>
      </Card>
      
      <Card>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Recent Transactions (Mock)</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between p-2 bg-gray-50 rounded"><span>Premium Story "The Brave Knight" Sale</span> <span className="font-semibold text-green-600">+$0.70</span></li>
          <li className="flex justify-between p-2 rounded"><span>Premium Puzzle "Space Adventure" Sale</span> <span className="font-semibold text-green-600">+$0.70</span></li>
          <li className="flex justify-between p-2 bg-gray-50 rounded"><span>Premium Quiz "Dino Facts" Sale</span> <span className="font-semibold text-green-600">+$0.70</span></li>
        </ul>
        <Button variant="ghost" size="sm" className="mt-3 !text-sm !text-blue-600 hover:!underline">View All Transactions</Button>
      </Card>
    </div>
  );
};

export default TeacherEarningsScreen;
