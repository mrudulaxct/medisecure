import { requireAuth } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, Calendar, FileText, Clock, Plus, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PatientProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientProfilePage({ params }: PatientProfilePageProps) {
  const { id } = await params;
  const profile = await requireAuth('doctor');
  const supabase = await createClient();

  // Fetch patient information
  const { data: patient, error: patientError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (patientError || !patient) {
    notFound();
  }

  // Check if this doctor has treated this patient
  const { data: hasAppointment } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', profile.id)
    .eq('patient_id', id)
    .limit(1);

  if (!hasAppointment || hasAppointment.length === 0) {
    notFound();
  }

  // Fetch appointment history
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', profile.id)
    .eq('patient_id', id)
    .order('appointment_date', { ascending: false });

  // Fetch medical records
  const { data: records } = await supabase
    .from('medical_records')
    .select('*')
    .eq('doctor_id', profile.id)
    .eq('patient_id', id)
    .order('created_at', { ascending: false });

  // Fetch additional patient details from patients table
  const { data: patientDetails } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  function calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getRecordTypeColor(type: string) {
    switch (type.toLowerCase()) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'lab_result': return 'bg-green-100 text-green-800';
      case 'prescription': return 'bg-purple-100 text-purple-800';
      case 'imaging': return 'bg-orange-100 text-orange-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Link href="/doctor/patients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Patient Profile</h1>
              <p className="text-white/70">Detailed patient information and history</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <Card className="glass-card border-white/20 bg-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg">
                    {patient.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold text-lg">{patient.full_name}</h3>
                  <p className="text-white/70">{patient.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                {patientDetails?.date_of_birth && (
                  <div>
                    <p className="text-white/60 text-sm">Age</p>
                    <p className="text-white">{calculateAge(patientDetails.date_of_birth)} years old</p>
                  </div>
                )}

                {patientDetails?.gender && (
                  <div>
                    <p className="text-white/60 text-sm">Gender</p>
                    <p className="text-white">{patientDetails.gender.charAt(0).toUpperCase() + patientDetails.gender.slice(1)}</p>
                  </div>
                )}

                {patientDetails?.phone && (
                  <div>
                    <p className="text-white/60 text-sm flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Phone
                    </p>
                    <p className="text-white">{patientDetails.phone}</p>
                  </div>
                )}

                {patientDetails?.address && (
                  <div>
                    <p className="text-white/60 text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Address
                    </p>
                    <p className="text-white">{patientDetails.address}</p>
                  </div>
                )}

                <div>
                  <p className="text-white/60 text-sm">Patient Since</p>
                  <p className="text-white">{new Date(patient.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-white/60 text-sm">Total Appointments</p>
                  <p className="text-white">{appointments?.length || 0}</p>
                </div>

                <div>
                  <p className="text-white/60 text-sm">Medical Records</p>
                  <p className="text-white">{records?.length || 0}</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button asChild className="w-full glass-button bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg">
                  <Link href={`/doctor/records/new?patient=${patient.id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medical Record
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
                  <Link href={`/doctor/records?patient=${patient.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View All Records
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointment History and Records */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Medical Records */}
            <Card className="glass-card border-white/20 bg-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Medical Records
                  </CardTitle>
                  <Button asChild size="sm" className="glass-button bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href={`/doctor/records?patient=${patient.id}`}>
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records?.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                          <FileText className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-white font-medium">{record.diagnosis}</p>
                            <Badge className={getRecordTypeColor(record.record_type)}>
                              {record.record_type.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm">{record.treatment}</p>
                          <p className="text-white/50 text-xs">
                            {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                        <Link href={`/doctor/records/${record.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                  {!records || records.length === 0 && (
                    <p className="text-white/60 text-center py-8">No medical records found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appointment History */}
            <Card className="glass-card border-white/20 bg-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments?.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {new Date(appointment.appointment_date).toLocaleDateString()}
                          </p>
                          <p className="text-white/70 text-sm">
                            {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {appointment.notes && (
                            <p className="text-white/60 text-xs mt-1">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                  {!appointments || appointments.length === 0 && (
                    <p className="text-white/60 text-center py-8">No appointments found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 