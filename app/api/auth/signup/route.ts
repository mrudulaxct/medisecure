import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (authData.user) {
      // Create profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
          role: 'patient', // Default role
          is_onboarded: false,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't fail the signup if profile creation fails
        // The user can still sign in and complete onboarding
      }

      return NextResponse.json({
        message: 'User created successfully. Please check your email for verification.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 