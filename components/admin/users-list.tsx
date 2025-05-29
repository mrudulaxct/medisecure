'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Profile } from '@/lib/types';
import Link from 'next/link';

export function UsersList() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

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
    <div className="space-y-4">
      {users.map((user) => (
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
      
      {users.length === 0 && (
        <div className="text-center py-12">
          <UserX className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/70">No users found</p>
        </div>
      )}
    </div>
  );
} 