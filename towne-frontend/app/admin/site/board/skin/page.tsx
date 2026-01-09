'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';

interface BoardSkin {
  key: number;
  name: string;
  description: string;
  listHtml: string;
  listCss: string;
  viewHtml: string;
  viewCss: string;
  insertDate: string;
}

function BoardSkinManagement() {
  const [skins, setSkins] = useState<BoardSkin[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<BoardSkin | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'list' | 'view'>('list');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    listHtml: '',
    listCss: '',
    viewHtml: '',
    viewCss: '',
  });

  const handleCreate = () => {
    // TODO: API 호출하여 스킨 생성
    alert('게시판 스킨이 생성되었습니다.');
    setShowForm(false);
    resetForm();
  };

  const handleUpdate = () => {
    // TODO: API 호출하여 스킨 수정
    alert('게시판 스킨이 수정되었습니다.');
    setShowForm(false);
    setSelectedSkin(null);
  };

  const handleDelete = (skinKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 스킨 삭제
    alert('게시판 스킨이 삭제되었습니다.');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      listHtml: '',
      listCss: '',
      viewHtml: '',
      viewCss: '',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">게시판 스킨 관리</h1>
            <p className="text-gray-600 mt-1">게시판 목록 및 상세보기 스킨을 관리합니다.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/site/board"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              게시판 관리로
            </Link>
            <button
              onClick={() => {
                setSelectedSkin(null);
                setShowForm(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 스킨 추가
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 스킨 목록 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">스킨 목록</h2>
            {skins.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                등록된 스킨이 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {skins.map((skin) => (
                  <div
                    key={skin.key}
                    onClick={() => {
                      setSelectedSkin(skin);
                      setFormData({
                        name: skin.name,
                        description: skin.description,
                        listHtml: skin.listHtml,
                        listCss: skin.listCss,
                        viewHtml: skin.viewHtml,
                        viewCss: skin.viewCss,
                      });
                      setShowForm(true);
                    }}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedSkin?.key === skin.key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-sm">{skin.name}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {skin.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 스킨 편집 영역 */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            {showForm ? (
              <>
                {/* 탭 메뉴 */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    {[
                      { id: 'list' as const, name: '목록 스킨', icon: '📋' },
                      { id: 'view' as const, name: '상세보기 스킨', icon: '📄' },
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      스킨명 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedTab === 'list' ? '목록 HTML' : '상세보기 HTML'}
                      </label>
                      <textarea
                        value={
                          selectedTab === 'list' ? formData.listHtml : formData.viewHtml
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [selectedTab === 'list' ? 'listHtml' : 'viewHtml']: e.target.value,
                          })
                        }
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="HTML 코드를 입력하세요..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedTab === 'list' ? '목록 CSS' : '상세보기 CSS'}
                      </label>
                      <textarea
                        value={
                          selectedTab === 'list' ? formData.listCss : formData.viewCss
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [selectedTab === 'list' ? 'listCss' : 'viewCss']: e.target.value,
                          })
                        }
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="CSS 코드를 입력하세요..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={selectedSkin ? handleUpdate : handleCreate}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {selectedSkin ? '수정' : '저장'}
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setSelectedSkin(null);
                      }}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      취소
                    </button>
                    {selectedSkin && (
                      <button
                        onClick={() => handleDelete(selectedSkin.key)}
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
                    {selectedTab === 'list' ? (
                      <div>
                        <style dangerouslySetInnerHTML={{ __html: formData.listCss }} />
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              formData.listHtml ||
                              '<p class="text-gray-400">목록 스킨 미리보기</p>',
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <style dangerouslySetInnerHTML={{ __html: formData.viewCss }} />
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              formData.viewHtml ||
                              '<p class="text-gray-400">상세보기 스킨 미리보기</p>',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg mb-2">스킨을 선택하거나 추가하세요.</p>
                <p className="text-sm">
                  게시판 목록 및 상세보기 스킨을 HTML/CSS로 작성할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function BoardSkinPage() {
  return (
    <AdminProtectedRoute>
      <BoardSkinManagement />
    </AdminProtectedRoute>
  );
}
