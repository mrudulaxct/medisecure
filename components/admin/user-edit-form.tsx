'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, UserPlus, Stethoscope, Users, Shield } from 'lucide-react';
import { Profile, UserRole } from '@/lib/types';

interface UserEditFormProps {
  user: Profile;
}

export function UserEditForm({ user }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    role: user.role as UserRole,
    is_onboarded: user.is_onboarded || false,
    // Doctor specific fields
    specialization: '',
    license_number: '',
    // Staff specific fields
    department: '',
    position: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          is_onboarded: formData.is_onboarded,
        })
        .eq('id', user.id);

      if (profileError) {
        setError('Failed to update profile. Please try again.');
        return;
      }

      // Handle role-specific updates
      if (formData.role === 'doctor' && user.role !== 'doctor') {
        // Promote to doctor - create doctor record
        const { error: doctorError } = await supabase
          .from('doctors')
          .upsert({
            id: user.id,
            specialization: formData.specialization || 'General Medicine',
            license_number: formData.license_number || `LIC-${user.id}`,
            is_available: true,
          });

        if (doctorError) {
          console.error('Doctor creation error:', doctorError);
          setError('User role updated but failed to create doctor profile.');
          return;
        }

        // Remove from patients if they were a patient
        if (user.role === 'patient') {
          await supabase.from('patients').delete().eq('id', user.id);
        }
      } else if (formData.role === 'staff' && user.role !== 'staff') {
        // Create staff record
        const { error: staffError } = await supabase
          .from('staff')
          .upsert({
            id: user.id,
            department: formData.department || 'General',
            position: formData.position || 'Staff',
          });

        if (staffError) {
          console.error('Staff creation error:', staffError);
          setError('User role updated but failed to create staff profile.');
          return;
        }
      } else if (formData.role === 'patient' && user.role !== 'patient') {
        // Create patient record
        const { error: patientError } = await supabase
          .from('patients')
          .upsert({
            id: user.id,
            date_of_birth: '2000-01-01', // Default, can be updated later
            gender: 'other',
          });

        if (patientError) {
          console.error('Patient creation error:', patientError);
          setError('User role updated but failed to create patient profile.');
          return;
        }

        // Remove from doctors if they were a doctor
        if (user.role === 'doctor') {
          await supabase.from('doctors').delete().eq('id', user.id);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/users');
        router.refresh();
      }, 2000);
    } catch (error) {
      console.log('Error updating user:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  function getRoleIcon(role: UserRole) {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'staff': return <Users className="h-4 w-4" />;
      case 'patient': return <UserPlus className="h-4 w-4" />;
      default: return <UserPlus className="h-4 w-4" />;
    }
  }

  function getRoleColor(role: UserRole) {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
          User updated successfully! Redirecting...
        </div>
      )}

      {/* Current Status */}
      <Card className="glass-card border-white/20 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Badge className={getRoleColor(user.role)}>
              {getRoleIcon(user.role)}
              <span className="ml-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            </Badge>
            <Badge className={user.is_onboarded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {user.is_onboarded ? 'Active' : 'Pending'}
            </Badge>
            <span className="text-white/60 text-sm">
              Joined {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-white">
            Full Name
          </Label>
          <Input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
            placeholder="Enter email"
            required
          />
        </div>
      </div>

      {/* Role and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white">Role</Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
              <SelectItem value="patient">
                <div className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Patient
                </div>
              </SelectItem>
              <SelectItem value="doctor">
                <div className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Doctor
                </div>
              </SelectItem>
              <SelectItem value="staff">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Staff
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-white">Account Status</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_onboarded"
              checked={formData.is_onboarded}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFormData({ ...formData, is_onboarded: e.target.checked })
              }
              className="rounded bg-white/20 border-white/30 text-blue-600 focus:ring-blue-500 focus:border-blue-500"
            />
            <Label htmlFor="is_onboarded" className="text-white/70 text-sm">
              {formData.is_onboarded ? 'Account is active' : 'Account is pending approval'}
            </Label>
          </div>
        </div>
      </div>

      {/* Role-specific fields */}
      {formData.role === 'doctor' && (
        <Card className="glass-card border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Doctor Information
            </CardTitle>
            <CardDescription className="text-white/60">
              Additional information required for doctor role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-white">
                  Specialization
                </Label>
                <Input
                  id="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                  placeholder="e.g., Cardiology, General Medicine"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_number" className="text-white">
                  License Number
                </Label>
                <Input
                  id="license_number"
                  type="text"
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                  placeholder="Medical license number"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {formData.role === 'staff' && (
        <Card className="glass-card border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Staff Information
            </CardTitle>
            <CardDescription className="text-white/60">
              Additional information required for staff role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">
                  Department
                </Label>
                <Input
                  id="department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                  placeholder="e.g., Reception, Administration"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-white">
                  Position
                </Label>
                <Input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                  placeholder="e.g., Receptionist, Administrator"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          disabled={loading}
          className="glass-button bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update User
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 