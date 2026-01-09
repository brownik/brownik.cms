'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';

export default function AuthSection() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-gray-600">{user?.name}님</span>
          <Link
            href="/profile"
            className="text-sm text-gray-700 hover:text-blue-600"
          >
            내 정보
          </Link>
          <button
            onClick={logout}
            className="text-sm text-gray-700 hover:text-blue-600"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm text-gray-700 hover:text-blue-600 font-medium"
          >
            로그인
          </Link>
          <Link
            href="/admin/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            관리자
          </Link>
        </>
      )}
    </div>
  );
}
