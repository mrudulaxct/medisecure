import { requireAuth } from '@/lib/auth';
import { NewRecordForm } from '@/components/doctor/new-record-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function NewRecordPage() {
  const profile = await requireAuth('doctor');

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
              <h1 className="text-3xl font-bold text-white">New Medical Record</h1>
              <p className="text-white/70">Add a new medical record for a patient</p>
            </div>
          </div>
        </div>

        {/* Record Form */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Patient Medical Record</CardTitle>
            <CardDescription className="text-white/60">
              Fill in the medical record details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewRecordForm doctorId={profile.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 