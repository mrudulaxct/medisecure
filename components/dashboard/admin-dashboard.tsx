'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  Search,
  CalendarPlus
} from 'lucide-react';
import { Profile } from '@/lib/types';
import Link from 'next/link';

interface AdminDashboardProps {
  profile: Profile;
}

interface DashboardStats {
  totalUsers: number;
  totalAppointments: number;
  totalRecords: number;
  activeDoctors: number;
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAppointments: 0,
    totalRecords: 0,
    activeDoctors: 0
  });
  const [recentUsers, setRecentUsers] = useState<Profile[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch stats
      const [usersRes, appointmentsRes, recordsRes, doctorsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('appointments').select('id', { count: 'exact' }),
        supabase.from('medical_records').select('id', { count: 'exact' }),
        supabase.from('doctors').select('id', { count: 'exact' })
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalAppointments: appointmentsRes.count || 0,
        totalRecords: recordsRes.count || 0,
        activeDoctors: doctorsRes.count || 0
      });

      // Fetch recent users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      setRecentUsers(users || []);

      // Fetch recent appointments with patient and doctor info
      const { data: appointments } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey(full_name),
          doctor:profiles!appointments_doctor_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentAppointments(appointments || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
                <p className="text-white/70 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-white/60 text-xs">All registered users</p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Appointments</p>
                <p className="text-2xl font-bold text-white">{stats.totalAppointments}</p>
                <p className="text-white/60 text-xs">All appointments</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Medical Records</p>
                <p className="text-2xl font-bold text-white">{stats.totalRecords}</p>
                <p className="text-white/60 text-xs">Total records</p>
              </div>
              <FileText className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Active Doctors</p>
                <p className="text-2xl font-bold text-white">{stats.activeDoctors}</p>
                <p className="text-white/60 text-xs">Registered doctors</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-white/60">
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20 h-20 flex-col">
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            
            <Button asChild className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20 h-20 flex-col">
              <Link href="/admin/appointments/new">
                <CalendarPlus className="h-6 w-6 mb-2" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Users</CardTitle>
              <CardDescription className="text-white/60">
                Newest registered users
              </CardDescription>
            </div>
            <Button asChild className="glass-button bg-red-600 hover:bg-red-700 text-white">
              <Link href="/admin/users">
                <Search className="h-4 w-4 mr-2" />
                View All Users
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium">
                    {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.full_name || 'No name'}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'staff' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }>
                    {user.role}
                  </Badge>
                  <Badge className={
                    user.is_onboarded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }>
                    {user.is_onboarded ? 'active' : 'pending'}
                  </Badge>
                  <Button asChild size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                    <Link href={`/admin/users/${user.id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-white/60 text-center py-4">No users found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Appointments */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Appointments</CardTitle>
              <CardDescription className="text-white/60">
                Latest scheduled appointments
              </CardDescription>
            </div>
            <Button asChild className="glass-button bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/admin/appointments">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {appointment.patient?.full_name || 'Unknown Patient'} → {appointment.doctor?.full_name || 'Unknown Doctor'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {new Date(appointment.appointment_date).toLocaleDateString()} at {new Date(appointment.appointment_date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }>
                    {appointment.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
            {recentAppointments.length === 0 && (
              <p className="text-white/60 text-center py-4">No appointments found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 