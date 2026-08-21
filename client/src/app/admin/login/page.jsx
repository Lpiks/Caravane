'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/useAuthStore';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const router = useRouter();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If already logged in, redirect directly to admin dashboard
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      router.push('/admin');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-terracotta-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Kouini Caravane Admin</h1>
          <p className="text-slate-400 text-sm">Sign in to manage the fleet, chassis & 3D studio</p>
        </div>

        {displayError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kouinicaravane.dz"
                required
                className="w-full bg-[#0B0C10]/60 border border-slate-700/50 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0B0C10]/60 border border-slate-700/50 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit" 
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl px-4 py-3 transition-colors duration-200 shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              'Sign In to Admin Portal'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            &larr; Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
