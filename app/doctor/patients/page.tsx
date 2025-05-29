import { requireAuth } from '@/lib/auth';
import { DoctorPatientsList } from '@/components/doctor/doctor-patients-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default async function DoctorPatientsPage() {
  const profile = await requireAuth('doctor');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Patients</h1>
              <p className="text-white/70">View and manage your patients</p>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Patient List</CardTitle>
            <CardDescription className="text-white/60">
              Patients under your care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorPatientsList doctorId={profile.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 