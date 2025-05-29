import { requireAuth } from '@/lib/auth';
import { DoctorAppointmentsList } from '@/components/doctor/doctor-appointments-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default async function DoctorAppointmentsPage() {
  const profile = await requireAuth('doctor');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Appointments</h1>
              <p className="text-white/70">Manage your appointment schedule</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Appointment Schedule</CardTitle>
            <CardDescription className="text-white/60">
              View and manage your patient appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorAppointmentsList doctorId={profile.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 