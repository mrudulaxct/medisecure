'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CalendarPlus } from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
  email: string;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
}

export function BookAppointmentForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchPatientsAndDoctors();
  }, []);

  async function fetchPatientsAndDoctors() {
    try {
      // Fetch patients
      const { data: patientsData } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'patient')
        .eq('is_onboarded', true)
        .order('full_name');

      // Fetch doctors
      const { data: doctorsData } = await supabase
        .from('doctors')
        .select(`
          id,
          specialization,
          profiles!doctors_id_fkey(full_name)
        `)
        .eq('is_available', true);

      setPatients(patientsData || []);
      
      // Transform doctors data
      const transformedDoctors = doctorsData?.map(doctor => ({
        id: doctor.id,
        full_name: doctor.profiles?.[0]?.full_name || 'Unknown Doctor',
        specialization: doctor.specialization,
      })) || [];
      
      setDoctors(transformedDoctors);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Combine date and time
      const appointmentDateTime = new Date(`${formData.appointment_date}T${formData.appointment_time}`);

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: formData.patient_id,
          doctor_id: formData.doctor_id,
          appointment_date: appointmentDateTime.toISOString(),
          status: 'scheduled',
          notes: formData.notes,
        });

      if (error) {
        setError('Failed to book appointment. Please try again.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/appointments');
      }, 2000);
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Generate time slots for the next 30 days, 9 AM to 5 PM
  function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
          Appointment booked successfully! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Selection */}
        <div className="space-y-2">
          <Label className="text-white">Patient</Label>
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

        {/* Doctor Selection */}
        <div className="space-y-2">
          <Label className="text-white">Doctor</Label>
          <Select value={formData.doctor_id} onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div>
                    <p className="font-medium">{doctor.full_name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="appointment_date" className="text-white">
            Appointment Date
          </Label>
          <Input
            id="appointment_date"
            type="date"
            value={formData.appointment_date}
            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            min={today}
            className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
            required
          />
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label className="text-white">Appointment Time</Label>
          <Select value={formData.appointment_time} onValueChange={(value) => setFormData({ ...formData, appointment_time: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20 max-h-60">
              {generateTimeSlots().map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-white">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
          placeholder="Add any additional notes for the appointment..."
          rows={3}
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
          disabled={loading || !formData.patient_id || !formData.doctor_id || !formData.appointment_date || !formData.appointment_time}
          className="glass-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Book Appointment
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 