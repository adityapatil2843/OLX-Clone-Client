import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function VerifyOtpPage() {
  return (
    <PlaceholderPage
      title="Verify OTP (One-Time Password)"
      description="Verification step for validating phone numbers or email authentication tokens during registration and account recovery."
      category="auth"
      routePath="/verify-otp"
      plannedFeatures={[
        '6-digit numeric OTP input with automatic paste and auto-advance',
        'Countdown timer for resending OTP SMS',
        'Direct phone number edit link if number was mistyped',
        'WhatsApp verification fallback option'
      ]}
      quickLinks={[
        { href: '/login', label: 'Back to Sign In' },
        { href: '/register', label: 'Back to Register' },
        { href: '/sell', label: 'Skip to Sell (Dev Mode)' }
      ]}
    />
  );
}
