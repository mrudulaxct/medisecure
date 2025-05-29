import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  Plus,
  Search,
  Filter,
  UserPlus,
  CalendarPlus
} from 'lucide-react';
import { Profile } from '@/lib/types';
import Link from 'next/link';

interface AdminDashboardProps {
  profile: Profile;
}

export function AdminDashboard({ profile }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-white/60 text-xs">+12 this week</p>
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
                <p className="text-2xl font-bold text-white">2,340</p>
                <p className="text-white/60 text-xs">+45 today</p>
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
                <p className="text-2xl font-bold text-white">8,920</p>
                <p className="text-white/60 text-xs">+156 this month</p>
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
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-white/60 text-xs">18 available today</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="glass-button bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg h-20 flex-col">
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            
            <Button asChild className="glass-button bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg h-20 flex-col">
              <Link href="/admin/appointments/new">
                <CalendarPlus className="h-6 w-6 mb-2" />
                Book Appointment
              </Link>
            </Button>
            
            <Button asChild className="glass-button bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg h-20 flex-col">
              <Link href="/admin/users/new">
                <UserPlus className="h-6 w-6 mb-2" />
                Add User
              </Link>
            </Button>
            
            <Button asChild className="glass-button bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg h-20 flex-col">
              <Link href="/admin/reports">
                <BarChart3 className="h-6 w-6 mb-2" />
                View Reports
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
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-white/60">
                Manage user accounts and roles
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
            {/* Recent Users */}
            {[
              { name: 'John Doe', email: 'john@example.com', role: 'patient', status: 'pending' },
              { name: 'Dr. Sarah Wilson', email: 'sarah@example.com', role: 'doctor', status: 'active' },
              { name: 'Mike Johnson', email: 'mike@example.com', role: 'staff', status: 'active' },
              { name: 'Emma Brown', email: 'emma@example.com', role: 'patient', status: 'pending' },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
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
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }>
                    {user.status}
                  </Badge>
                  <Button asChild size="sm" variant="outline" className="glass-button bg-white/20 text-white border-white/20">
                    <Link href={`/admin/users/${user.email.split('@')[0]}`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
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
            {[
              { patient: 'John Doe', doctor: 'Dr. Sarah Wilson', date: 'Today, 2:30 PM', status: 'confirmed' },
              { patient: 'Emma Brown', doctor: 'Dr. Michael Chen', date: 'Tomorrow, 10:00 AM', status: 'scheduled' },
              { patient: 'Mike Johnson', doctor: 'Dr. Emily Davis', date: 'Jan 25, 3:15 PM', status: 'scheduled' },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{appointment.patient} → {appointment.doctor}</p>
                    <p className="text-white/70 text-sm">{appointment.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 