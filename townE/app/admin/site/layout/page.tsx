'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

function LayoutManagement() {
  const [selectedTab, setSelectedTab] = useState<'header' | 'footer' | 'left' | 'js' | 'css' | 'meta'>('header');
  const [layoutData, setLayoutData] = useState({
    header: '',
    footer: '',
    left: '',
    js: '',
    css: '',
    meta: '',
  });

  const tabs = [
    { id: 'header' as const, name: 'HEADER', icon: '📄' },
    { id: 'footer' as const, name: 'FOOTER', icon: '📄' },
    { id: 'left' as const, name: 'LEFT 메뉴', icon: '📋' },
    { id: 'js' as const, name: 'JavaScript', icon: '⚙️' },
    { id: 'css' as const, name: 'CSS', icon: '🎨' },
    { id: 'meta' as const, name: 'META 태그', icon: '🏷️' },
  ];

  const handleSave = () => {
    // TODO: API 호출하여 레이아웃 저장
    alert('레이아웃이 저장되었습니다.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">레이아웃 관리</h1>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            저장하기
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* 에디터 영역 */}
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tabs.find((t) => t.id === selectedTab)?.name} 소스 코드
              </label>
              <textarea
                value={layoutData[selectedTab]}
                onChange={(e) =>
                  setLayoutData({ ...layoutData, [selectedTab]: e.target.value })
                }
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`${tabs.find((t) => t.id === selectedTab)?.name} HTML/CSS/JS 코드를 입력하세요...`}
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>• HTML, CSS, JavaScript 코드를 직접 편집할 수 있습니다.</p>
              <p>• 저장 시 사이트에 즉시 반영됩니다.</p>
            </div>
          </div>
        </div>

        {/* 미리보기 영역 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">미리보기</h2>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px]">
            {selectedTab === 'header' && (
              <div dangerouslySetInnerHTML={{ __html: layoutData.header || '<p class="text-gray-400">HEADER 미리보기</p>' }} />
            )}
            {selectedTab === 'footer' && (
              <div dangerouslySetInnerHTML={{ __html: layoutData.footer || '<p class="text-gray-400">FOOTER 미리보기</p>' }} />
            )}
            {selectedTab === 'left' && (
              <div dangerouslySetInnerHTML={{ __html: layoutData.left || '<p class="text-gray-400">LEFT 메뉴 미리보기</p>' }} />
            )}
            {(selectedTab === 'js' || selectedTab === 'css' || selectedTab === 'meta') && (
              <div className="text-gray-400">
                {selectedTab === 'js' && 'JavaScript 코드는 실행 후 확인 가능합니다.'}
                {selectedTab === 'css' && 'CSS 코드는 스타일 적용 후 확인 가능합니다.'}
                {selectedTab === 'meta' && 'META 태그는 페이지 소스에서 확인 가능합니다.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function LayoutPage() {
  return (
    <AdminProtectedRoute>
      <LayoutManagement />
    </AdminProtectedRoute>
  );
}
