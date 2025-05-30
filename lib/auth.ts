import { createClient } from '@/utils/supabase/server';
import { createClient as createClientBrowser } from '@/utils/supabase/client';
import { UserRole, Profile } from './types';
import { redirect } from 'next/navigation';

export async function getUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function requireAuth(requiredRole?: UserRole) {
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect('/auth/login');
  }

  // Check if user needs onboarding
  if (!profile.is_onboarded) {
    redirect('/onboarding');
  }

  if (requiredRole && profile.role !== requiredRole) {
    redirect('/dashboard');
  }

  return profile;
}

export async function requireOnboarding() {
  const profile = await getUserProfile();

  console.log('profile', profile);
  if (!profile) {
    redirect('/auth/login');
  }

  // If already onboarded, redirect to dashboard
  if (profile.is_onboarded) {
    redirect('/dashboard');
  }

  return profile;
}

export async function signOut() {
  const supabase = createClientBrowser();
  await supabase.auth.signOut();
}

export function hasPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function isDoctor(userRole: UserRole): boolean {
  return userRole === 'doctor';
}

export function isPatient(userRole: UserRole): boolean {
  return userRole === 'patient';
}

export function isStaff(userRole: UserRole): boolean {
  return userRole === 'staff';
} 