'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';

interface Content {
  key: number;
  menuKey: number;
  menuTitle: string;
  html: string;
  js: string;
  css: string;
  updateDate?: string;
}

function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'html' | 'js' | 'css'>('html');
  const [formData, setFormData] = useState({
    menuKey: undefined as number | undefined,
    html: '',
    js: '',
    css: '',
  });

  const handleCreate = () => {
    // TODO: API 호출하여 컨텐츠 생성
    alert('컨텐츠가 생성되었습니다.');
    setShowForm(false);
    setFormData({ menuKey: undefined, html: '', js: '', css: '' });
  };

  const handleUpdate = () => {
    // TODO: API 호출하여 컨텐츠 수정
    alert('컨텐츠가 수정되었습니다.');
    setShowForm(false);
    setSelectedContent(null);
  };

  const handleDelete = (contentKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 컨텐츠 삭제
    alert('컨텐츠가 삭제되었습니다.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">컨텐츠 관리</h1>
          <button
            onClick={() => {
              setSelectedContent(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 컨텐츠 추가
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 컨텐츠 목록 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">컨텐츠 목록</h2>
            {contents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                등록된 컨텐츠가 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {contents.map((content) => (
                  <div
                    key={content.key}
                    onClick={() => {
                      setSelectedContent(content);
                      setFormData({
                        menuKey: content.menuKey,
                        html: content.html,
                        js: content.js,
                        css: content.css,
                      });
                      setShowForm(true);
                    }}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedContent?.key === content.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-sm">{content.menuTitle}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {content.updateDate
                        ? new Date(content.updateDate).toLocaleDateString('ko-KR')
                        : '미등록'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 컨텐츠 편집 영역 */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            {showForm ? (
              <>
                {/* 탭 메뉴 */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {[
                      { id: 'html' as const, name: 'HTML', icon: '📄' },
                      { id: 'js' as const, name: 'JavaScript', icon: '⚙️' },
                      { id: 'css' as const, name: 'CSS', icon: '🎨' },
                    ].map((tab) => (
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
                      메뉴 선택 *
                    </label>
                    <select
                      value={formData.menuKey || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          menuKey: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">메뉴 선택</option>
                      {/* TODO: 메뉴 목록 로드 */}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedTab === 'html' && 'HTML 소스 코드'}
                      {selectedTab === 'js' && 'JavaScript 소스 코드'}
                      {selectedTab === 'css' && 'CSS 스타일 코드'}
                    </label>
                    <textarea
                      value={formData[selectedTab]}
                      onChange={(e) =>
                        setFormData({ ...formData, [selectedTab]: e.target.value })
                      }
                      rows={20}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`${selectedTab.toUpperCase()} 코드를 입력하세요...`}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={selectedContent ? handleUpdate : handleCreate}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {selectedContent ? '수정' : '저장'}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setSelectedContent(null);
                      }}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      취소
                    </button>
                    {selectedContent && (
                      <button
                        onClick={() => handleDelete(selectedContent.key)}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>

                {/* 미리보기 영역 */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">미리보기</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[200px]">
                    {selectedTab === 'html' && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formData.html || '<p class="text-gray-400">HTML 미리보기</p>',
                        }}
                      />
                    )}
                    {selectedTab === 'js' && (
                      <div className="text-gray-400">
                        JavaScript 코드는 실행 후 확인 가능합니다.
                      </div>
                    )}
                    {selectedTab === 'css' && (
                      <div className="text-gray-400">
                        CSS 코드는 스타일 적용 후 확인 가능합니다.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg mb-2">컨텐츠를 선택하거나 추가하세요.</p>
                <p className="text-sm">
                  컨텐츠는 HTML, JavaScript, CSS 소스 코드를 관리합니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ContentPage() {
  return (
    <AdminProtectedRoute>
      <ContentManagement />
    </AdminProtectedRoute>
  );
}
