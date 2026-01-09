'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      title: '사이트 관리',
      items: [
        { name: '레이아웃', href: '/admin/site/layout', icon: '📐' },
        { name: '메뉴', href: '/admin/site/menu', icon: '📋' },
        { name: '컨텐츠', href: '/admin/site/content', icon: '📄' },
        { name: '파일', href: '/admin/site/file', icon: '📁' },
      ],
    },
    {
      title: '게시판 관리',
      items: [
        { name: '게시판', href: '/admin/site/board', icon: '📝' },
        { name: '게시물', href: '/admin/site/board/item', icon: '📰' },
        { name: '게시판스킨', href: '/admin/site/board/skin', icon: '🎨' },
        { name: '게시판담당자', href: '/admin/site/board/manager', icon: '👤' },
      ],
    },
    {
      title: '프로그램 관리',
      items: [
        { name: '필드관리', href: '/admin/programs/fields', icon: '🔧' },
        { name: '데이터셋', href: '/admin/programs/dataset', icon: '📊' },
        { name: '마을관리', href: '/admin/programs/towninfo', icon: '🏘️' },
        { name: '마을자원지도', href: '/admin/programs/townmap', icon: '🗺️' },
        { name: '그래프 템플릿', href: '/admin/programs/graph', icon: '📈' },
        { name: '커뮤니티 맵핑', href: '/admin/programs/community', icon: '🔗' },
        { name: '공동체 관리', href: '/admin/programs/community/list', icon: '👥' },
        { name: '투표관리', href: '/admin/programs/vote', icon: '🗳️' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              townE 관리자
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{user.name}</span> ({user.userId})
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 사이드바 */}
        <aside
          className={`bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <nav className="p-4 space-y-6">
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? '' : ''}`}>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
