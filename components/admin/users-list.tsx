'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, UserCheck, UserX, Search, Filter } from 'lucide-react';
import { Profile } from '@/lib/types';
import Link from 'next/link';

export function UsersList() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterUsers() {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.is_onboarded);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(user => !user.is_onboarded);
      }
    }

    setFilteredUsers(filtered);
  }

  function getRoleColor(role: string) {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'patient': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-white/20"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/20 rounded"></div>
                  <div className="h-3 w-48 bg-white/20 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-6 w-16 bg-white/20 rounded-full"></div>
                <div className="h-6 w-16 bg-white/20 rounded-full"></div>
                <div className="h-8 w-16 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 pl-10"
            />
          </div>
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48 glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 glass-input bg-white/20 border-white/30 text-white focus:border-white/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="glass-card bg-white/90 backdrop-blur-md border-white/20">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-white/70 text-sm">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <Button 
          onClick={() => {
            setSearchTerm('');
            setRoleFilter('all');
            setStatusFilter('all');
          }}
          variant="outline" 
          size="sm"
          className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          Clear Filters
        </Button>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium">{user.full_name || 'No name'}</p>
                <p className="text-white/70 text-sm">{user.email}</p>
                <p className="text-white/50 text-xs">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              
              <Badge className={
                user.is_onboarded 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }>
                {user.is_onboarded ? (
                  <>
                    <UserCheck className="h-3 w-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <UserX className="h-3 w-3 mr-1" />
                    Pending
                  </>
                )}
              </Badge>
              
              <div className="flex items-center space-x-2">
                <Button 
                  asChild 
                  size="sm" 
                  variant="outline" 
                  className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Link href={`/admin/users/${user.id}`}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Link>
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="glass-button bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserX className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/70">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? 'No users match your search criteria' 
                : 'No users found'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 