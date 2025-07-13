import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-config";
import { createClient } from "@/utils/supabase/server";
import { UserRole, Profile } from "./types";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return null;
  }

  const supabase = await createClient();
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function requireAuth(requiredRole?: UserRole) {
  const profile = await getCurrentUserProfile();
  
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
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  // If already onboarded, redirect to dashboard
  if (profile.is_onboarded) {
    redirect('/dashboard');
  }

  return profile;
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