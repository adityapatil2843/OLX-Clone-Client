import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function LoginPage() {
  return (
    <PlaceholderPage
      title="User Sign In"
      description="Authentication portal for registered marketplace buyers, individual sellers, and businesses. Planned for Phone Number / OTP sign-in and email authentication."
      category="auth"
      routePath="/login"
      plannedFeatures={[
        'Indian mobile phone number + SMS OTP verification',
        'Email + Password fallback authentication',
        'Google OAuth social sign-in integration',
        'Remember device session management'
      ]}
      quickLinks={[
        { href: '/register', label: 'Go to Register' },
        { href: '/verify-otp', label: 'Verify OTP' },
        { href: '/sell', label: 'Test Direct Access to /sell' },
        { href: '/chats', label: 'Test Direct Access to /chats' }
      ]}
    />
  );
}
