import { requireAuth } from '@/lib/nextauth';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { DoctorDashboard } from '@/components/dashboard/doctor-dashboard';
import { StaffDashboard } from '@/components/dashboard/staff-dashboard';
import { PatientDashboard } from '@/components/dashboard/patient-dashboard';

export default async function DashboardPage() {
  const profile = await requireAuth();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile.full_name}!
          </h1>
          <div className="flex items-center space-x-2">
           
            <span className="text-white/70">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Role-based Dashboard Content */}
        {profile.role === 'admin' && <AdminDashboard profile={profile} />}
        {profile.role === 'doctor' && <DoctorDashboard profile={profile} />}
        {profile.role === 'staff' && <StaffDashboard profile={profile} />}
        {profile.role === 'patient' && <PatientDashboard profile={profile} />}
      </div>
    </div>
  );
} 