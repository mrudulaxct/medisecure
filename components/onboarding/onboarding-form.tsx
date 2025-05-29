'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Profile, Gender } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface OnboardingFormProps {
  profile: Profile;
}

export function OnboardingForm({ profile }: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: undefined as Date | undefined,
    gender: '' as Gender | '',
    contactNumber: '',
    address: '',
    bloodGroup: '',
    specialization: '',
    department: '',
    position: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, just update the profile as patient (admin will change role later)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_onboarded: true,
        })
        .eq('id', profile.id);

      if (updateError) {
        setError('Failed to complete onboarding. Please try again.');
        return;
      }

      // Create patient record with the provided information
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id: profile.id,
          date_of_birth: formData.dateOfBirth?.toISOString().split('T')[0] || '2000-01-01',
          gender: (formData.gender as Gender) || 'other',
          contact_number: formData.contactNumber || null,
          address: formData.address || null,
          blood_group: formData.bloodGroup || null,
        });

      if (patientError) {
        // If patient record creation fails, it's okay - admin can fix this later
        console.warn('Patient record creation failed:', patientError);
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.log('Onboarding error:', error);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date of Birth */}
        <div className="space-y-2">
          <Label className="text-white">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "glass-input bg-white/20 border-white/30 text-white w-full justify-start text-left font-normal",
                  !formData.dateOfBirth && "text-white/50"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateOfBirth ? (
                  format(formData.dateOfBirth, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass-card bg-white/90 backdrop-blur-md border-white/20">
              <Calendar
                mode="single"
                selected={formData.dateOfBirth}
                onSelect={(date) => setFormData({ ...formData, dateOfBirth: date })}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-white">Gender</Label>
          <Select onValueChange={(value: Gender) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="contactNumber" className="text-white">
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Blood Group */}
        <div className="space-y-2">
          <Label htmlFor="bloodGroup" className="text-white">
            Blood Group (Optional)
          </Label>
          <Select onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
            <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-white">
          Address
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
          placeholder="Enter your full address"
          rows={3}
        />
      </div>

      {/* Reason for joining */}
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-white">
          Why are you joining MediSecure? (Optional)
        </Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
          placeholder="Tell us about your healthcare needs or professional background..."
          rows={3}
        />
      </div>

      <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-200 text-sm">
        <h4 className="font-medium mb-2">Important Notes:</h4>
        <ul className="space-y-1 text-xs">
          <li>• Your account will be reviewed by an administrator</li>
          <li>• You&apos;ll be assigned the appropriate role (Patient, Doctor, or Staff)</li>
          <li>• You&apos;ll receive an email notification once your account is approved</li>
          <li>• All information can be updated later from your dashboard</li>
        </ul>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full glass-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg py-3"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Completing setup...
          </>
        ) : (
          'Complete Profile Setup'
        )}
      </Button>
    </form>
  );
} 