'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Eye, EyeOff, Loader2, User, UserCheck, Users, Stethoscope } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '' as UserRole | '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const roleOptions = [
    { value: 'patient', label: 'Patient', icon: User, description: 'Book appointments and view records' },
    { value: 'doctor', label: 'Doctor', icon: Stethoscope, description: 'Manage patients and medical records' },
    { value: 'staff', label: 'Staff', icon: Users, description: 'Administrative support and patient care' },
    { value: 'admin', label: 'Administrator', icon: UserCheck, description: 'Full system access and management' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            role: formData.role as UserRole,
            full_name: formData.fullName,
            email: formData.email,
          });

        if (profileError) {
          setError('Failed to create profile. Please try again.');
          return;
        }

        // Create role-specific record
        if (formData.role === 'patient') {
          await supabase.from('patients').insert({
            id: authData.user.id,
            date_of_birth: new Date().toISOString().split('T')[0], // Temporary default
            gender: 'other', // Temporary default
          });
        } else if (formData.role === 'doctor') {
          await supabase.from('doctors').insert({
            id: authData.user.id,
            specialization: 'General Medicine', // Temporary default
            license_number: `LIC-${Date.now()}`, // Temporary default
          });
        } else if (formData.role === 'staff') {
          await supabase.from('staff').insert({
            id: authData.user.id,
            department: 'General', // Temporary default
            position: 'Staff', // Temporary default
          });
        }

        router.push('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediSecure
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-white/70">
            Join our healthcare management platform
          </p>
        </div>

        {/* Signup Form */}
        <Card className="glass-card border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-white/60">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50"
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  Role
                </Label>
                <Select onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center space-x-3">
                          <role.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pr-10"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white/80"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white/80"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" required className="rounded border-white/30 bg-white/20" />
                <Label className="text-sm text-white/70">
                  I agree to the{' '}
                  <Link href="/terms" className="text-white hover:text-white/80">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-white hover:text-white/80">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full glass-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center">
                <p className="text-white/70">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-white hover:text-white/80 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 