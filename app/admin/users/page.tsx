import { requireAuth } from '@/lib/auth';
import { UsersList } from '@/components/admin/users-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Filter, Plus, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const profile = await requireAuth('admin');

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
          <Button asChild className="glass-button bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg">
            <Link href="/admin/users/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">Search & Filter</CardTitle>
            <CardDescription className="text-white/60">
              Find and filter users by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search by name, email, or role..."
                    className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="glass-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

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