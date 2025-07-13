'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Chrome, Building2 } from "lucide-react";

interface OAuthProvidersProps {
  className?: string;
}

export function OAuthProviders({ className }: OAuthProvidersProps) {
  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-2 text-white/60 backdrop-blur-sm">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuthSignIn('google')}
          className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuthSignIn('github')}
          className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuthSignIn('azure-ad')}
          className="glass-button bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
        >
          <Building2 className="mr-2 h-4 w-4" />
          Continue with Microsoft
        </Button>
      </div>
    </div>
  );
} 