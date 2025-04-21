// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerUser, signIn, resetPassword } from '@/lib/auth/firebase-auth';

// POST - Register a new user
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Register the user
    const user = await registerUser(email, password, firstName, lastName);

    return NextResponse.json({ 
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      success: true 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    // Handle Firebase auth specific errors
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    } else if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'Password is too weak' },
        { status: 400 }
      );
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

// PUT - Sign in a user
export async function PUT(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in the user
    const userCredential = await signIn(email, password);
    const user = userCredential.user;

    return NextResponse.json({ 
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      success: true 
    });
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    // Handle Firebase auth specific errors
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    } else if (error.code === 'auth/too-many-requests') {
      return NextResponse.json(
        { error: 'Too many unsuccessful login attempts, please try again later' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}

// PATCH - Reset password
export async function PATCH(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send password reset email
    await resetPassword(email);

    return NextResponse.json({ 
      success: true,
      message: 'Password reset email sent' 
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    
    // Handle Firebase auth specific errors
    if (error.code === 'auth/user-not-found') {
      // For security reasons, still return success even if user not found
      return NextResponse.json({ 
        success: true,
        message: 'Password reset email sent' 
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    );
  }
}