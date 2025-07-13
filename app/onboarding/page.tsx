import { requireOnboarding } from '@/lib/nextauth';
import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default async function OnboardingPage() {
  const profile = await requireOnboarding();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8">
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
          <div className="flex items-center justify-center space-x-2 mb-4">
            <UserCheck className="h-8 w-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">
              Complete Your Profile
            </h2>
          </div>
          <p className="mt-2 text-white/70 max-w-lg mx-auto">
            Welcome! Please complete your profile information. An administrator will review and assign your role shortly.
          </p>
        </div>

        {/* Onboarding Form */}
        <Card className="glass-card border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Profile Setup
            </CardTitle>
            <CardDescription className="text-center text-white/60">
              Tell us a bit more about yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm profile={profile} />
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="glass-card border-white/20 bg-white/5 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-white">What happens next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
                <div className="text-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 mx-auto mb-2">
                    1
                  </div>
                  <p>Complete your profile information</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500/20 text-purple-400 mx-auto mb-2">
                    2
                  </div>
                  <p>Admin reviews your application</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500/20 text-green-400 mx-auto mb-2">
                    3
                  </div>
                  <p>Get access to your dashboard</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 