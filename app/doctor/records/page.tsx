import { requireAuth } from '@/lib/auth';
import { DoctorRecordsList } from '@/components/doctor/doctor-records-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function DoctorRecordsPage() {
  const profile = await requireAuth('doctor');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-purple-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Medical Records</h1>
              <p className="text-white/70">Manage patient medical records</p>
            </div>
          </div>
          <Button asChild className="glass-button bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg">
            <Link href="/doctor/records/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Record
            </Link>
          </Button>
        </div>

        {/* Records List */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Patient Records</CardTitle>
            <CardDescription className="text-white/60">
              View and manage medical records for your patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorRecordsList doctorId={profile.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 