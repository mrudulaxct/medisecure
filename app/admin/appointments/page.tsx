import { requireAuth } from '@/lib/auth';
import { AppointmentsList } from '@/components/admin/appointments-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default async function AdminAppointmentsPage() {
  const profile = await requireAuth('admin');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Appointment Management</h1>
              <p className="text-white/70">View and manage all appointments</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Appointments</CardTitle>
            <CardDescription className="text-white/60">
              Manage patient appointments and schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentsList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 