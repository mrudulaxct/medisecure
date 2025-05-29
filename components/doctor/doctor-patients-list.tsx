'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Eye, FileText, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface Patient {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  last_appointment?: string;
  appointment_count: number;
  gender?: string;
  date_of_birth?: string;
}

interface DoctorPatientsListProps {
  doctorId: string;
}

export function DoctorPatientsList({ doctorId }: DoctorPatientsListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  async function fetchPatients() {
    try {
      // Get unique patients from appointments
      const { data: appointmentData, error } = await supabase
        .from('appointments')
        .select(`
          patient_id,
          appointment_date,
          patient:profiles!appointments_patient_id_fkey(
            id,
            full_name,
            email,
            created_at
          )
        `)
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        return;
      }

      // Process unique patients with appointment info
      const patientMap = new Map();
      
      appointmentData?.forEach((apt: any) => {
        if (apt.patient) {
          const patientId = apt.patient.id;
          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              ...apt.patient,
              last_appointment: apt.appointment_date,
              appointment_count: 1
            });
          } else {
            const existing = patientMap.get(patientId);
            existing.appointment_count += 1;
            // Keep the most recent appointment date
            if (new Date(apt.appointment_date) > new Date(existing.last_appointment)) {
              existing.last_appointment = apt.appointment_date;
            }
          }
        }
      });

      // Try to get additional patient details from patients table
      for (const [patientId, patientData] of patientMap) {
        const { data: patientDetails } = await supabase
          .from('patients')
          .select('gender, date_of_birth')
          .eq('id', patientId)
          .single();
        
        if (patientDetails) {
          patientData.gender = patientDetails.gender;
          patientData.date_of_birth = patientDetails.date_of_birth;
        }
      }

      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterPatients() {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient => 
        patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-white/20"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/20 rounded"></div>
                  <div className="h-3 w-48 bg-white/20 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-16 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pl-10"
            />
          </div>
        </div>
        
        <Button 
          onClick={() => setSearchTerm('')}
          variant="outline" 
          size="sm"
          className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Clear Search
        </Button>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-white/70 text-sm">
          Showing {filteredPatients.length} of {patients.length} patients
        </p>
      </div>

      {/* Patients List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  {patient.full_name?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{patient.full_name}</p>
                <p className="text-white/70 text-sm">{patient.email}</p>
                <div className="flex items-center space-x-4 text-white/60 text-xs mt-1">
                  {patient.date_of_birth && (
                    <span>Age: {calculateAge(patient.date_of_birth)}</span>
                  )}
                  {patient.gender && (
                    <span>{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</span>
                  )}
                  <span>{patient.appointment_count} appointment{patient.appointment_count !== 1 ? 's' : ''}</span>
                  {patient.last_appointment && (
                    <span>Last visit: {new Date(patient.last_appointment).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button asChild size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                <Link href={`/doctor/patients/${patient.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Link>
              </Button>
              
              <Button asChild size="sm" className="glass-button bg-purple-600 hover:bg-purple-700 text-white">
                <Link href={`/doctor/records/new?patient=${patient.id}`}>
                  <FileText className="h-3 w-3 mr-1" />
                  Add Record
                </Link>
              </Button>

              <Button asChild size="sm" className="glass-button bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/doctor/records?patient=${patient.id}`}>
                  <FileText className="h-3 w-3 mr-1" />
                  View Records
                </Link>
              </Button>
            </div>
          </div>
        ))}
        
        {filteredPatients.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70">
              {searchTerm 
                ? 'No patients match your search criteria' 
                : 'No patients found. Patients will appear here after their first appointment with you.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 