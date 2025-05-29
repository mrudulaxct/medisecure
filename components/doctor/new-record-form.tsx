'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
  email: string;
}

interface NewRecordFormProps {
  doctorId: string;
}

export function NewRecordForm({ doctorId }: NewRecordFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    record_type: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    fetchPatients();
    
    // Pre-select patient if provided in URL params
    const patientParam = searchParams.get('patient');
    if (patientParam) {
      setFormData(prev => ({ ...prev, patient_id: patientParam }));
    }
  }, [searchParams]);

  async function fetchPatients() {
    try {
      // Get unique patients from appointments
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select(`
          patient:profiles!appointments_patient_id_fkey(id, full_name, email)
        `)
        .eq('doctor_id', doctorId);

      const uniquePatients = new Map();
      appointmentData?.forEach((apt) => {
        const patient = Array.isArray(apt.patient) ? apt.patient[0] : apt.patient;
        if (patient && !uniquePatients.has(patient.id)) {
          uniquePatients.set(patient.id, patient);
        }
      });

      setPatients(Array.from(uniquePatients.values()));
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('medical_records')
        .insert({
          patient_id: formData.patient_id,
          doctor_id: doctorId,
          record_type: formData.record_type,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          notes: formData.notes,
        });

      if (error) {
        setError('Failed to create medical record. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/doctor/records');
      }, 2000);
    } catch (error) {
      console.log('Error creating medical record:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
          Medical record created successfully! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <div className="space-y-2">
          <Label className="text-white">Patient *</Label>
          <Select value={formData.patient_id} onValueChange={(value) => setFormData({ ...formData, patient_id: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select a patient" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  <div>
                    <p className="font-medium">{patient.full_name}</p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Record Type */}
        <div className="space-y-2">
          <Label className="text-white">Record Type *</Label>
          <Select value={formData.record_type} onValueChange={(value) => setFormData({ ...formData, record_type: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select record type" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="lab_result">Lab Result</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="surgery">Surgery</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="space-y-2">
        <Label htmlFor="diagnosis" className="text-white">
          Diagnosis *
        </Label>
        <Input
          id="diagnosis"
          type="text"
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
          placeholder="Enter primary diagnosis"
          required
        />
      </div>

      {/* Treatment */}
      <div className="space-y-2">
        <Label htmlFor="treatment" className="text-white">
          Treatment Plan *
        </Label>
        <Textarea
          id="treatment"
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
          placeholder="Describe the treatment plan, medications, procedures..."
          rows={4}
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-white">
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
          placeholder="Any additional observations, follow-up instructions, or notes..."
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading || !formData.patient_id || !formData.record_type || !formData.diagnosis || !formData.treatment}
          className="glass-button bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Record
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 