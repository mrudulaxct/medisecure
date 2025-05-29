import { Profile } from '@/lib/types';

interface DoctorDashboardProps {
  profile: Profile;
}

export function DoctorDashboard({ profile }: DoctorDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Doctor Dashboard</h2>
        <p className="text-white/70">Coming soon - Patient management, schedules, and medical records</p>
      </div>
    </div>
  );
} 