import { requireAuth } from '@/lib/auth';
import { BookAppointmentForm } from '@/components/admin/book-appointment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import Link from 'next/link';

export default async function BookAppointmentPage() {
  const profile = await requireAuth('admin');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Link href="/admin/appointments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Appointments
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <CalendarPlus className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Book Appointment</h1>
              <p className="text-white/70">Schedule a new appointment for a patient</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">New Appointment</CardTitle>
            <CardDescription className="text-white/60">
              Fill in the details to book a new appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookAppointmentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 