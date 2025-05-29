import { UsersList } from '@/components/admin/users-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default async function AdminUsersPage() {

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-white/70">Manage all user accounts and permissions</p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
            <CardDescription className="text-white/60">
              Click on any user to view and edit their profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 