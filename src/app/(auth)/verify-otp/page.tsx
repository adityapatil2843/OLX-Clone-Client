'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, ArrowLeft, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/features/auth/authService';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { ApiError } from '@/lib/api-error';

export default function VerifyOtpPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState<'request' | 'verify'>('request');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.requestOtp({ email, purpose: 'LOGIN' });
      setSuccessMsg(res.message || 'OTP sent successfully! Please check your email inbox.');
      setStep('verify');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to send OTP. Please verify your email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otp) {
      setErrorMsg('Please enter the verification OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose: 'LOGIN' });
      if (res.user) {
        setSession(res.user);
      }
      setSuccessMsg('Email verified successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Invalid or expired OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer size="narrow" className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8 pb-24 md:pb-12">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
            OTP Login
          </span>
        </div>

        <div className="text-center space-y-1.5">
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
            Verify with OTP
          </h1>
          <p className="text-xs text-zinc-500">
            {step === 'request'
              ? 'Enter your registered email address to receive a one-time verification code.'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

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

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              leftAccessory={<Mail className="w-4 h-4 text-zinc-400" />}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm mt-2"
            >
              {isLoading ? 'Sending Code...' : 'Send Verification OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              label="6-Digit OTP Code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 123456"
              maxLength={6}
              required
              leftAccessory={<KeyRound className="w-4 h-4 text-zinc-400" />}
            />

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <button
                type="button"
                onClick={() => setStep('request')}
                className="hover:underline text-orange-600"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isLoading}
                className="hover:underline flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm mt-2"
            >
              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>
          </form>
        )}
      </div>
    </PageContainer>
  );
}
