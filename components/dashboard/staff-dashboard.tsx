import { Profile } from '@/lib/types';

interface StaffDashboardProps {
  profile: Profile;
}

export function StaffDashboard({ profile }: StaffDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Staff Dashboard</h2>
        <p className="text-white/70">Coming soon - Patient registration, appointment booking, and basic records</p>
      </div>
    </div>
  );
} 