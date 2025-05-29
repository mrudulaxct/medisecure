import { requireAuth } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, User, Calendar, Clock, Download } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface RecordDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecordDetailPage({ params }: RecordDetailPageProps) {
  const { id } = await params;
  const profile = await requireAuth('doctor');
  const supabase = await createClient();

  // Fetch the medical record
  const { data: record, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      patient:profiles!medical_records_patient_id_fkey(full_name, email, date_of_birth),
      doctor:profiles!medical_records_doctor_id_fkey(full_name)
    `)
    .eq('id', id)
    .eq('doctor_id', profile.id)
    .single();

  if (error || !record) {
    notFound();
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Link href="/doctor/records">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Records
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Medical Record</h1>
              <p className="text-white/70">Record ID: {record.id.slice(0, 8)}...</p>
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
            <CardContent className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Name</p>
                <p className="text-white font-medium">{record.patient?.full_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Email</p>
                <p className="text-white">{record.patient?.email || 'Not provided'}</p>
              </div>
              {record.patient?.date_of_birth && (
                <div>
                  <p className="text-white/60 text-sm">Age</p>
                  <p className="text-white">{calculateAge(record.patient.date_of_birth)} years old</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Record Details */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/20 bg-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Medical Record Details
                  </CardTitle>
                  <Badge className={getRecordTypeColor(record.record_type)}>
                    {record.record_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="text-white/60 flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Diagnosis</h3>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/90">{record.diagnosis}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Treatment Plan</h3>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/90 whitespace-pre-wrap">{record.treatment}</p>
                  </div>
                </div>

                {record.notes && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Additional Notes</h3>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-white/90 whitespace-pre-wrap">{record.notes}</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/60 text-sm">
                    Created by Dr. {record.doctor?.full_name || 'Unknown'} on{' '}
                    {new Date(record.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {record.file_url && (
                  <div className="flex items-center justify-center pt-4">
                    <Button 
                      className="glass-button bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open(record.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Attached File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button asChild className="glass-button bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg">
            <Link href={`/doctor/records/new?patient=${record.patient_id}`}>
              <FileText className="h-4 w-4 mr-2" />
              Add New Record for This Patient
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Link href={`/doctor/patients/${record.patient_id}`}>
              <User className="h-4 w-4 mr-2" />
              View Patient Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 