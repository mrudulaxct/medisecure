import { requireAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Shield, Palette, Database } from 'lucide-react';

export default async function SettingsPage() {
  const profile = await requireAuth();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/70">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card className="glass-card border-white/20 bg-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-white/60 text-sm">Receive appointment reminders</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">SMS Notifications</p>
                  <p className="text-white/60 text-sm">Get urgent updates via SMS</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="glass-card border-white/20 bg-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white">Security</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Change Password</p>
                  <p className="text-white/60 text-sm">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Two-Factor Auth</p>
                  <p className="text-white/60 text-sm">Add extra security to your account</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glass-card border-white/20 bg-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Preferences</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Theme</p>
                  <p className="text-white/60 text-sm">Choose your preferred theme</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  Dark
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Language</p>
                  <p className="text-white/60 text-sm">Select your language</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  English
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="glass-card border-white/20 bg-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-white">Data & Privacy</CardTitle>
              </div>
              <CardDescription className="text-white/60">
                Control your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Download Data</p>
                  <p className="text-white/60 text-sm">Export your account data</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-white/20 text-white border-white/20">
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Delete Account</p>
                  <p className="text-white/60 text-sm">Permanently delete your account</p>
                </div>
                <Button variant="outline" size="sm" className="glass-button bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-white/60">
              Your current account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/70 font-medium">Account ID</p>
                <p className="text-white font-mono">{profile.id}</p>
              </div>
              <div>
                <p className="text-white/70 font-medium">Member Since</p>
                <p className="text-white">{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-white/70 font-medium">Last Updated</p>
                <p className="text-white">{new Date(profile.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 