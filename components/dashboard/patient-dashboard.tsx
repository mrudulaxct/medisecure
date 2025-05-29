import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  Heart, 
  Clock,
  Plus,
  Activity
} from 'lucide-react';
import { Profile } from '@/lib/types';

interface PatientDashboardProps {
  profile: Profile;
}

export function PatientDashboard({ profile }: PatientDashboardProps) {
  console.log('PatientDashboard', profile);
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Next Appointment</p>
                <p className="text-2xl font-bold text-white">Tomorrow</p>
                <p className="text-white/60 text-xs">2:30 PM</p>
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
                <p className="text-2xl font-bold text-white">12</p>
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
                <p className="text-white/70 text-sm font-medium">Health Score</p>
                <p className="text-2xl font-bold text-white">Good</p>
                <p className="text-white/60 text-xs">Based on recent visits</p>
              </div>
              <Heart className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover-lift border-white/20 bg-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Last Visit</p>
                <p className="text-2xl font-bold text-white">5 days</p>
                <p className="text-white/60 text-xs">ago</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Upcoming Appointments</CardTitle>
                <CardDescription className="text-white/60">
                  Your scheduled medical appointments
                </CardDescription>
              </div>
              <Button className="glass-button bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Book New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: 'Tomorrow, 2:30 PM',
                  doctor: 'Dr. Sarah Johnson',
                  type: 'Regular Checkup',
                  status: 'confirmed'
                },
                {
                  date: 'Jan 25, 10:00 AM',
                  doctor: 'Dr. Michael Chen',
                  type: 'Follow-up',
                  status: 'scheduled'
                },
                {
                  date: 'Feb 1, 3:15 PM',
                  doctor: 'Dr. Emily Davis',
                  type: 'Consultation',
                  status: 'scheduled'
                }
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{appointment.type}</p>
                      <p className="text-white/70 text-sm">{appointment.doctor}</p>
                      <p className="text-white/60 text-xs">{appointment.date}</p>
                    </div>
                  </div>
                  <Badge className={
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Medical Records</CardTitle>
                <CardDescription className="text-white/60">
                  Your latest medical history
                </CardDescription>
              </div>
              <Button variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  date: 'Jan 15, 2024',
                  doctor: 'Dr. Sarah Johnson',
                  diagnosis: 'Annual Physical Examination',
                  type: 'Checkup'
                },
                {
                  date: 'Dec 20, 2023',
                  doctor: 'Dr. Michael Chen',
                  diagnosis: 'Follow-up for Blood Pressure',
                  type: 'Follow-up'
                },
                {
                  date: 'Nov 10, 2023',
                  doctor: 'Dr. Emily Davis',
                  diagnosis: 'Consultation for Headaches',
                  type: 'Consultation'
                }
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                      <FileText className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{record.diagnosis}</p>
                      <p className="text-white/70 text-sm">{record.doctor}</p>
                      <p className="text-white/60 text-xs">{record.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-white/70 border-white/20">
                    {record.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Summary */}
      <Card className="glass-card border-white/20 bg-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Health Summary
          </CardTitle>
          <CardDescription className="text-white/60">
            Overview of your health metrics and important information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-white/70 text-sm font-medium">Blood Type</p>
              <p className="text-2xl font-bold text-white">O+</p>
            </div>
            <div className="space-y-2">
              <p className="text-white/70 text-sm font-medium">Allergies</p>
              <p className="text-white">Penicillin, Peanuts</p>
            </div>
            <div className="space-y-2">
              <p className="text-white/70 text-sm font-medium">Emergency Contact</p>
              <p className="text-white">John Doe</p>
              <p className="text-white/60 text-sm">(555) 123-4567</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 