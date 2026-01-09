'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';

export default function LoginButton() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/login"
      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
    >
      로그인하기
    </Link>
  );
}
