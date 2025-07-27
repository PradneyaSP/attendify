'use client';
import React, { useState } from 'react';
import { loginUser } from '@/lib/loginService';
import { googleSignIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { setUserCookie } from '@/lib/cookiesClient';
import { signInWithGoogle } from '@/lib/firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await loginUser(email, password);
      if (response.success) {
        if (response.token) {
          setUserCookie(response.token, 7); // Store the token in a cookie for 7 days
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          setError('No token received.');
        }
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.log(error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
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
    <div className="login-container">
      <Navbar />
      <div className="flex items-center justify-center h-[90vh] bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-md text-foreground z-10">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg bg-mute focus:ring-indigo-500 focus:border-indigo-500 border-border"
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
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-background bg-foreground rounded-lg hover:bg-ring focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </form>
          <button
            onClick={signInWithGoogle}
            className="w-full mt-4 px-4 py-2 text-sm font-medium text-background bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login with Google
          </button>
          <p className="text-sm text-center">
            Don&apos;t have an account? <Link href="/sign-up" className="text-indigo-600 hover:text-indigo-500">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;