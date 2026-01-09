'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth, user } = useAdminAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else if (user) {
      // 관리자 권한 확인 (MEMBERLEVEL 8 이상)
      const memberLevel = parseInt(user.memberLevel);
      if (memberLevel < 8) {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">관리자 로그인이 필요합니다.</p>
          <p className="text-sm text-gray-400 mt-2">로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  if (user) {
    const memberLevel = parseInt(user.memberLevel);
    if (memberLevel < 8) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600">관리자 권한이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-2">홈으로 이동합니다...</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
