'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (provider?: string, credentials?: { email: string; password: string }) => {
    if (provider && provider !== 'credentials') {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } else if (credentials) {
      await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        callbackUrl: '/dashboard',
      });
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
} 