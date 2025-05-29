'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Eye, Download, User, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

interface MedicalRecord {
  id: string;
  patient_id: string;
  record_type: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  created_at: string;
  patient: {
    full_name: string;
    email: string;
  } | null;
  file_url?: string;
}

interface DoctorRecordsListProps {
  doctorId: string;
}

export function DoctorRecordsList({ doctorId }: DoctorRecordsListProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [patientFilter, setPatientFilter] = useState<string>('all');
  const [patients, setPatients] = useState<{id: string, full_name: string}[]>([]);
  const supabase = createClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    
    // Set patient filter from URL params if provided
    const patientParam = searchParams.get('patient');
    if (patientParam) {
      setPatientFilter(patientParam);
    }
  }, [doctorId, searchParams]);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, typeFilter, patientFilter]);

  async function fetchRecords() {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select(`
          *,
          patient:profiles!medical_records_patient_id_fkey(full_name, email)
        `)
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
        return;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPatients() {
    try {
      // Get unique patients from appointments
      const { data: appointmentData } = await supabase
        .from('appointments')
        .select(`
          patient:profiles!appointments_patient_id_fkey(id, full_name)
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

  function filterRecords() {
    let filtered = records;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.record_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.record_type === typeFilter);
    }

    // Patient filter
    if (patientFilter !== 'all') {
      filtered = filtered.filter(record => record.patient_id === patientFilter);
    }

    setFilteredRecords(filtered);
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
                <div className="h-6 w-16 bg-white/20 rounded-full"></div>
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
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search by patient, diagnosis, or treatment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pl-10"
            />
          </div>
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="lab_result">Lab Result</SelectItem>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
            <SelectItem value="surgery">Surgery</SelectItem>
          </SelectContent>
        </Select>

        <Select value={patientFilter} onValueChange={setPatientFilter}>
          <SelectTrigger className="w-48 glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
            <SelectValue placeholder="Filter by patient" />
          </SelectTrigger>
          <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
            <SelectItem value="all">All Patients</SelectItem>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-white/70 text-sm">
          Showing {filteredRecords.length} of {records.length} records
        </p>
        <Button 
          onClick={() => {
            setSearchTerm('');
            setTypeFilter('all');
            setPatientFilter('all');
          }}
          variant="outline" 
          size="sm"
          className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Clear Filters
        </Button>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <p className="text-white font-medium">
                    {record.patient?.full_name || 'Unknown Patient'}
                  </p>
                  <Badge className={getRecordTypeColor(record.record_type)}>
                    {record.record_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-white/80 text-sm font-medium">{record.diagnosis}</p>
                <p className="text-white/70 text-sm">{record.treatment}</p>
                {record.notes && (
                  <p className="text-white/60 text-xs mt-1 line-clamp-2">
                    {record.notes}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-white/50 text-xs mt-2">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(record.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {record.patient?.email}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button asChild size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                <Link href={`/doctor/records/${record.id}`}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Link>
              </Button>
              
              {record.file_url && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="glass-button bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
                  onClick={() => window.open(record.file_url, '_blank')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  File
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {filteredRecords.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70 mb-4">
              {searchTerm || typeFilter !== 'all' || patientFilter !== 'all'
                ? 'No records match your search criteria' 
                : 'No medical records found'
              }
            </p>
            <Button asChild className="glass-button bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg">
              <Link href="/doctor/records/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First Record
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 