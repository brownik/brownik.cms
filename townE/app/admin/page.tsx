'use client';

import { useRouter } from 'next/navigation';
import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import Link from 'next/link';

function AdminDashboard() {
  const { user } = useAdminAuthStore();
  const router = useRouter();

  const quickActions = [
    {
      title: '레이아웃 관리',
      description: '사이트 레이아웃 (HEADER, FOOTER, LEFT, JS, CSS, META) 관리',
      href: '/admin/site/layout',
      icon: '📐',
      color: 'bg-blue-500',
    },
    {
      title: '메뉴 관리',
      description: '사이트 메뉴 구조 및 메타 정보 관리',
      href: '/admin/site/menu',
      icon: '📋',
      color: 'bg-green-500',
    },
    {
      title: '컨텐츠 관리',
      description: 'HTML/JS/CSS 소스 코드 관리',
      href: '/admin/site/content',
      icon: '📄',
      color: 'bg-purple-500',
    },
    {
      title: '게시판 관리',
      description: '게시판 설정 및 스킨 관리',
      href: '/admin/site/board',
      icon: '📝',
      color: 'bg-orange-500',
    },
    {
      title: '게시물 관리',
      description: '게시글 작성/수정/삭제 관리',
      href: '/admin/site/board/item',
      icon: '📰',
      color: 'bg-indigo-500',
    },
    {
      title: '파일 관리',
      description: '사이트 파일 업로드 및 관리',
      href: '/admin/site/file',
      icon: '📁',
      color: 'bg-pink-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 환영 메시지 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            관리자 대시보드
          </h1>
          <p className="text-gray-600">
            {user?.name}님, 환영합니다. CMS/DMS 관리 시스템에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 관리자 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">관리자 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">아이디</span>
              <p className="font-semibold">{user?.userId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">이름</span>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">권한 레벨</span>
              <p className="font-semibold">{user?.memberLevel}</p>
            </div>
          </div>
        </div>

        {/* 빠른 작업 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`${action.color} text-white p-3 rounded-lg text-2xl group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 시스템 정보 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">시스템 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">CMS 버전</span>
              <p className="font-semibold">townE CMS v1.0</p>
            </div>
            <div>
              <span className="text-gray-500">마지막 업데이트</span>
              <p className="font-semibold">2026-01-08</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  );
}

