import { UserEditForm } from '@/components/admin/user-edit-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

interface AdminUserEditPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the user to edit
  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !user) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="glass-button bg-white/20 hover:bg-white/30 text-white border-white/20">
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Edit User</h1>
              <p className="text-white/70">Manage user profile and permissions</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <Card className="glass-card border-white/20 bg-white/10">
          <CardHeader>
            <CardTitle className="text-white">User Information</CardTitle>
            <CardDescription className="text-white/60">
              Edit user details, role, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserEditForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 