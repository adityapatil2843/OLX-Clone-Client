import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function RegisterPage() {
  return (
    <PlaceholderPage
      title="Create an Account"
      description="Onboarding registration flow for new users. Supports consumer buyer/seller profiles and verified business merchant profiles."
      category="auth"
      routePath="/register"
      plannedFeatures={[
        'Phone number verification with instantaneous SMS OTP',
        'Profile type selection (Individual Seller vs Business / Commercial)',
        'Basic profile setup (Full Name, City / State, Avatar)',
        'Terms of Service and Marketplace Safety Guidelines acknowledgment'
      ]}
      quickLinks={[
        { href: '/login', label: 'Already have an account? Sign In' },
        { href: '/verify-otp', label: 'Go to OTP Verification' },
        { href: '/profile/example-user', label: 'Preview Profile Screen' }
      ]}
    />
  );
}
