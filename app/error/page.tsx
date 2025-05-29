import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function ErrorPage() {
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
        </div>

        {/* Error Card */}
        <Card className="glass-card border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-white/60">
              There was an issue verifying your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-white/80">
                The verification link may be invalid, expired, or already used.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 text-sm">
              <h4 className="font-medium mb-2">What you can do:</h4>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>Check if you've already verified your email</li>
                <li>Try signing up again if the link is expired</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full glass-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <Link href="/auth/login">
                  <Home className="mr-2 h-4 w-4" />
                  Try Signing In
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
                <Link href="/auth/signup">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sign Up Again
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-white/70 text-sm">
                Need help?{' '}
                <Link href="mailto:support@medisecure.com" className="text-white hover:text-white/80 font-medium">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 