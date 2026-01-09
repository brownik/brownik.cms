'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

interface MenuItem {
  key: number;
  title: string;
  contentType: 'C' | 'B' | 'P' | 'L' | 'M';
  parentKey?: number;
  order: number;
  useYn: 'Y' | 'N';
  children?: MenuItem[];
}

function MenuManagement() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'C' as 'C' | 'B' | 'P' | 'L' | 'M',
    parentKey: undefined as number | undefined,
    order: 0,
    useYn: 'Y' as 'Y' | 'N',
    description: '',
    boardKey: undefined as number | undefined,
    layoutKey: undefined as number | undefined,
  });

  const contentTypeLabels = {
    C: '컨텐츠',
    B: '게시판',
    P: '프로그램',
    L: '링크',
    M: '메뉴',
  };

  const handleCreate = () => {
    // TODO: API 호출하여 메뉴 생성
    alert('메뉴가 생성되었습니다.');
    setShowForm(false);
    setFormData({
      title: '',
      contentType: 'C',
      parentKey: undefined,
      order: 0,
      useYn: 'Y',
      description: '',
      boardKey: undefined,
      layoutKey: undefined,
    });
  };

  const handleUpdate = () => {
    // TODO: API 호출하여 메뉴 수정
    alert('메뉴가 수정되었습니다.');
    setShowForm(false);
    setSelectedMenu(null);
  };

  const handleDelete = (menuKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 메뉴 삭제
    alert('메뉴가 삭제되었습니다.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">메뉴 관리</h1>
          <button
            onClick={() => {
              setSelectedMenu(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 메뉴 추가
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메뉴 목록 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">메뉴 목록</h2>
            {menus.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>등록된 메뉴가 없습니다.</p>
                <p className="text-sm mt-2">메뉴를 추가하여 시작하세요.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {menus.map((menu) => (
                  <div
                    key={menu.key}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedMenu(menu);
                      setFormData({
                        title: menu.title,
                        contentType: menu.contentType,
                        parentKey: menu.parentKey,
                        order: menu.order,
                        useYn: menu.useYn,
                        description: '',
                        boardKey: undefined,
                        layoutKey: undefined,
                      });
                      setShowForm(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{menu.title}</div>
                        <div className="text-sm text-gray-500">
                          타입: {contentTypeLabels[menu.contentType]} | 순서: {menu.order}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            menu.useYn === 'Y'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {menu.useYn === 'Y' ? '사용' : '미사용'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(menu.key);
                          }}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 메뉴 폼 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedMenu ? '메뉴 수정' : '메뉴 추가'}
            </h2>
            {showForm ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  selectedMenu ? handleUpdate() : handleCreate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    메뉴 제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    컨텐츠 타입 *
                  </label>
                  <select
                    value={formData.contentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contentType: e.target.value as 'C' | 'B' | 'P' | 'L' | 'M',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="C">컨텐츠 (C)</option>
                    <option value="B">게시판 (B)</option>
                    <option value="P">프로그램 (P)</option>
                    <option value="L">링크 (L)</option>
                    <option value="M">메뉴 (M)</option>
                  </select>
                </div>

                {formData.contentType === 'B' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      게시판 선택
                    </label>
                    <select
                      value={formData.boardKey || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          boardKey: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">게시판 선택</option>
                      {/* TODO: 게시판 목록 로드 */}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    순서
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사용 여부
                  </label>
                  <select
                    value={formData.useYn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        useYn: e.target.value as 'Y' | 'N',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedMenu ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedMenu(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>메뉴를 선택하거나 추가 버튼을 클릭하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function MenuPage() {
  return (
    <AdminProtectedRoute>
      <MenuManagement />
    </AdminProtectedRoute>
  );
}
