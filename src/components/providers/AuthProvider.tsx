'use client';

import * as React from 'react';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initAuth = useAuthStore((s) => s.initAuth);

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
};
