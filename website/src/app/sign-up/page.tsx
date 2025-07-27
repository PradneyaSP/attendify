'use client';
import React, { useState } from 'react';
import { registerUser } from '@/lib/signupServics';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { googleSignIn } from '@/lib/auth';
import { setUserCookie } from '@/lib/cookiesClient';
import { signInWithGoogle } from '@/lib/firebase/auth';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // For error handling
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await registerUser(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      if (result.message === 'User already exists. Please log in.') {
        router.push('/');
      } else {
        setError(result.message || 'Registration failed.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await googleSignIn();
      if (response.success) {
        console.log("I AM IN!"); // Debugging log

        if (response.token) { // Check if token is defined
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          setError('No token received.'); // Handle the case where token is undefined
        }
      } else {
        setError(response.message || 'Login failed. Please try again.'); // Ensure message is a string
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred with Google login.');
    }
  };

  return (
    <div className="sign-up-container">
      <Navbar />
      <div className="flex items-center justify-center min-h-[90vh] bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-md text-foreground z-10">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-border"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-border"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-border"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-background bg-foreground rounded-lg hover:bg-ring focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Sign Up
            </button>
            <button
              onClick={signInWithGoogle}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-background bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              SignUp with Google
            </button>
          </form>
          <p className="text-sm text-center">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-500">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;