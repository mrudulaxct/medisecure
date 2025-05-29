import { Profile } from '@/lib/types';

interface AdminDashboardProps {
  profile: Profile;
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h2>
        <p className="text-white/70">Coming soon - User management, system oversight, and analytics</p>
      </div>
    </div>
  );
} 