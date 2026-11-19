'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, MapPin, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/features/auth/authService';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { ApiError } from '@/lib/api-error';
import { sanitizeRedirectUrl } from '@/lib/security';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const targetRedirect = sanitizeRedirectUrl(rawRedirect, '/');
  const setSession = useAuthStore((s) => s.setSession);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [locationCity, setLocationCity] = React.useState('Mumbai');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.register({
        name,
        email,
        password,
        locationCity,
      });
      setSession(user);
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push(targetRedirect);
      }, 800);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Back & Brand Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
          New Account
        </span>
      </div>

      {/* Brand Logo & Title */}
      <div className="text-center space-y-2">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden mx-auto shadow-xs border border-orange-500/20">
          <Image
            src="/images/logo-1.png"
            alt="Bazarr 360"
            width={48}
            height={48}
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
          Join Bazarr 360
        </h1>
        <p className="text-xs text-zinc-500">
          India&apos;s free video-first classifieds and reels marketplace.
        </p>
      </div>

      {/* Error / Success Feedback */}
      {errorMsg && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-3 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-3 flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          required
          leftAccessory={<User className="w-4 h-4 text-zinc-400" />}
        />

        <Input
          label="Email Address *"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="rahul@example.com"
          required
          leftAccessory={<Mail className="w-4 h-4 text-zinc-400" />}
        />

        <Input
          label="Password *"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          leftAccessory={<Lock className="w-4 h-4 text-zinc-400" />}
        />

        <Input
          label="City *"
          value={locationCity}
          onChange={(e) => setLocationCity(e.target.value)}
          placeholder="e.g. Mumbai, Delhi, Bangalore"
          required
          leftAccessory={<MapPin className="w-4 h-4 text-zinc-400" />}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="pt-2 text-center text-xs text-zinc-500">
        <span>Already have an account? </span>
        <Link
          href={`/login${rawRedirect ? `?redirect=${encodeURIComponent(targetRedirect)}` : ''}`}
          className="font-bold text-orange-600 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PageContainer size="narrow" className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8 pb-24 md:pb-12">
      <React.Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading registration...</div>}>
        <RegisterForm />
      </React.Suspense>
    </PageContainer>
  );
}
