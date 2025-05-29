'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, X, Check, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  appointment_date: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  created_at: string;
  patient: {
    full_name: string;
  } | null;
  doctor: {
    full_name: string;
  } | null;
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const supabase = createClient();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(full_name),
          doctor:profiles!appointments_doctor_id_fkey(full_name)
        `)
        .order('appointment_date', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterAppointments() {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }

  async function updateAppointmentStatus(appointmentId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment:', error);
        return;
      }

      // Refresh the list
      fetchAppointments();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'confirmed': return <Check className="h-3 w-3" />;
      case 'cancelled': return <X className="h-3 w-3" />;
      case 'completed': return <Check className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
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
              placeholder="Search by patient, doctor, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-white/70 text-sm">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </p>
        <Button 
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
          variant="outline" 
          size="sm"
          className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Clear Filters
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {appointment.patient?.full_name || 'Unknown Patient'} → {appointment.doctor?.full_name || 'Unknown Doctor'}
                </p>
                <p className="text-white/70 text-sm">
                  {new Date(appointment.appointment_date).toLocaleDateString()} at {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {appointment.notes && (
                  <p className="text-white/50 text-xs mt-1">
                    Note: {appointment.notes}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusIcon(appointment.status)}
                <span className="ml-1">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
              </Badge>
              
              <div className="flex items-center space-x-2">
                {appointment.status === 'scheduled' && (
                  <Button 
                    onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                    size="sm" 
                    className="glass-button bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Confirm
                  </Button>
                )}
                
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                  <Button 
                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                    size="sm" 
                    variant="outline" 
                    className="glass-button bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                )}

                {appointment.status === 'confirmed' && (
                  <Button 
                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                    size="sm" 
                    className="glass-button bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredAppointments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70">
              {searchTerm || statusFilter !== 'all' 
                ? 'No appointments match your search criteria' 
                : 'No appointments found'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 