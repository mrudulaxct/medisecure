'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Upload
} from 'lucide-react';
import { Profile } from '@/lib/types';
import Link from 'next/link';

interface DoctorDashboardProps {
  profile: Profile;
}

interface DashboardStats {
  todayAppointments: number;
  totalPatients: number;
  pendingRecords: number;
  completedToday: number;
}

interface TodayAppointment {
  id: string;
  appointment_date: string;
  status: string;
  patient: {
    full_name: string;
  } | null;
  notes: string;
}

interface RecentPatient {
  id: string;
  full_name: string;
  email: string;
  last_appointment?: string;
}

export function DoctorDashboard({ profile }: DoctorDashboardProps) {
  console.log('DoctorDashboard', profile);
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    totalPatients: 0,
    pendingRecords: 0,
    completedToday: 0
  });
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, [profile.id]);

  async function fetchDashboardData() {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      // Fetch today's appointments
      const { data: todayAppts } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(full_name)
        `)
        .eq('doctor_id', profile.id)
        .gte('appointment_date', startOfDay)
        .lte('appointment_date', endOfDay)
        .order('appointment_date');

      setTodayAppointments(todayAppts || []);

      // Fetch stats
      const [totalApptsRes, completedTodayRes, totalPatientsRes, recordsRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('doctor_id', profile.id)
          .gte('appointment_date', startOfDay)
          .lte('appointment_date', endOfDay),
        
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .eq('doctor_id', profile.id)
          .eq('status', 'completed')
          .gte('appointment_date', startOfDay)
          .lte('appointment_date', endOfDay),
        
        supabase
          .from('appointments')
          .select('patient_id', { count: 'exact' })
          .eq('doctor_id', profile.id),
        
        supabase
          .from('medical_records')
          .select('id', { count: 'exact' })
          .eq('doctor_id', profile.id)
      ]);

      setStats({
        todayAppointments: totalApptsRes.count || 0,
        completedToday: completedTodayRes.count || 0,
        totalPatients: totalPatientsRes.count || 0,
        pendingRecords: recordsRes.count || 0
      });

      // Fetch recent patients
      const { data: patients } = await supabase
        .from('appointments')
        .select(`
          patient:profiles!appointments_patient_id_fkey(id, full_name, email),
          appointment_date
        `)
        .eq('doctor_id', profile.id)
        .order('appointment_date', { ascending: false })
        .limit(5);

      // Process unique patients
      const uniquePatients = new Map();
      patients?.forEach((apt: { patient: { id: string; full_name: string; email: string; }[]; appointment_date: string; }) => {
        if (apt.patient && !uniquePatients.has(apt.patient[0].id)) {
          uniquePatients.set(apt.patient[0].id, {
            ...apt.patient[0],
            last_appointment: apt.appointment_date
          });
        }
      });

      setRecentPatients(Array.from(uniquePatients.values()));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error:', error);
    }
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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-white/20 bg-white/10 animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-white/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Today&apos;s Appointments</p>
                <p className="text-2xl font-bold text-white">{stats.todayAppointments}</p>
                <p className="text-white/60 text-xs">{stats.completedToday} completed</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-white">{stats.totalPatients}</p>
                <p className="text-white/60 text-xs">Under your care</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Medical Records</p>
                <p className="text-2xl font-bold text-white">{stats.pendingRecords}</p>
                <p className="text-white/60 text-xs">Records managed</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Completed Today</p>
                <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
                <p className="text-white/60 text-xs">Appointments done</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-white/60">
            Common tasks for managing your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20 h-20 flex-col">
              <Link href="/doctor/appointments">
                <Calendar className="h-6 w-6 mb-2" />
                Manage Appointments
              </Link>
            </Button>
            
            <Button asChild className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20 h-20 flex-col">
              <Link href="/doctor/patients">
                <Users className="h-6 w-6 mb-2" />
                View Patients
              </Link>
            </Button>
            
            <Button asChild className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20 h-20 flex-col">
              <Link href="/doctor/records">
                <FileText className="h-6 w-6 mb-2" />
                Medical Records
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Today&apos;s Appointments</CardTitle>
              <CardDescription className="text-white/60">
                Your schedule for today
              </CardDescription>
            </div>
            <Button asChild className="glass-button bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/doctor/appointments">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {appointment.patient?.full_name || 'Unknown Patient'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'scheduled' && (
                      <Button 
                        onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        size="sm" 
                        className="glass-button bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    
                    {(appointment.status === 'scheduled' || appointment.status === 'completed') && (
                      <Button 
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        size="sm" 
                        variant="outline" 
                        className="glass-button bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <p className="text-white/60 text-center py-8">No appointments scheduled for today</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Patients</CardTitle>
              <CardDescription className="text-white/60">
                Patients you&apos;ve recently treated
              </CardDescription>
            </div>
            <Button asChild className="glass-button bg-green-600 hover:bg-green-700 text-white">
              <Link href="/doctor/patients">
                <Users className="h-4 w-4 mr-2" />
                View All Patients
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium">
                    {patient.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{patient.full_name}</p>
                    <p className="text-white/70 text-sm">{patient.email}</p>
                    {patient.last_appointment && (
                      <p className="text-white/50 text-xs">
                        Last visit: {new Date(patient.last_appointment).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button asChild size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                    <Link href={`/doctor/patients/${patient.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="glass-button bg-purple-600 hover:bg-purple-700 text-white">
                    <Link href={`/doctor/records/new?patient=${patient.id}`}>
                      <Upload className="h-3 w-3 mr-1" />
                      Record
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            {recentPatients.length === 0 && (
              <p className="text-white/60 text-center py-8">No recent patients found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 