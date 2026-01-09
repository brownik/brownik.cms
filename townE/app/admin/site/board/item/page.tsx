'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';

interface BoardItem {
  key: number;
  boardKey: number;
  boardName: string;
  title: string;
  writer: string;
  hit: number;
  commentCount: number;
  notice: 'Y' | 'N';
  secret: 'Y' | 'N';
  status: 'U' | 'N' | 'D';
  insertDate: string;
  categoryKey?: number;
  categoryName?: string;
}

function BoardItemManagement() {
  const [selectedBoardKey, setSelectedBoardKey] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<BoardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formData, setFormData] = useState({
    boardKey: undefined as number | undefined,
    title: '',
    content: '',
    writer: '',
    notice: 'N' as 'Y' | 'N',
    secret: 'N' as 'Y' | 'N',
    passwd: '',
    categoryKey: undefined as number | undefined,
    openDate: '',
    closeDate: '',
  });

  const boards = [
    { key: 1, name: '공지사항' },
    { key: 2, name: '자유게시판' },
  ];

  const categories = [
    { key: 1, name: '일반' },
    { key: 2, name: '공지' },
  ];

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(0);
    // TODO: API 호출하여 검색
  };

  const handleCreate = () => {
    // TODO: API 호출하여 게시물 생성
    alert('게시물이 생성되었습니다.');
    setShowForm(false);
    resetForm();
  };

  const handleUpdate = () => {
    // TODO: API 호출하여 게시물 수정
    alert('게시물이 수정되었습니다.');
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDelete = (itemKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 게시물 삭제
    alert('게시물이 삭제되었습니다.');
  };

  const handleBulkDelete = () => {
    // TODO: 선택된 게시물 일괄 삭제
    alert('선택된 게시물이 삭제되었습니다.');
  };

  const resetForm = () => {
    setFormData({
      boardKey: selectedBoardKey,
      title: '',
      content: '',
      writer: '',
      notice: 'N',
      secret: 'N',
      passwd: '',
      categoryKey: undefined,
      openDate: '',
      closeDate: '',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">게시물 관리</h1>
            <p className="text-gray-600 mt-1">게시판별 게시글을 관리합니다.</p>
          </div>
          <Link
            href="/admin/site/board"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            게시판 관리로
          </Link>
        </div>

        {/* 게시판 선택 및 검색 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                게시판 선택
              </label>
              <select
                value={selectedBoardKey || ''}
                onChange={(e) => {
                  const boardKey = e.target.value ? parseInt(e.target.value) : undefined;
                  setSelectedBoardKey(boardKey);
                  setFormData({ ...formData, boardKey });
                  setPage(0);
                  // TODO: 게시판별 게시물 로드
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체 게시판</option>
                {boards.map((board) => (
                  <option key={board.key} value={board.key}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="제목, 내용, 작성자 검색..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  검색
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setShowForm(true);
                }}
                className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + 게시물 작성
              </button>
            </div>
          </div>
        </div>

        {/* 게시물 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                총 {items.length}건
              </span>
            </div>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              선택 삭제
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  게시판
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  조회수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  댓글수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    등록된 게시물이 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.notice === 'Y' && (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mr-2">
                          공지
                        </span>
                      )}
                      {item.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.boardName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="flex items-center gap-2">
                        {item.secret === 'Y' && <span>🔒</span>}
                        {item.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.writer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.hit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.commentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.insertDate).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          item.status === 'U'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'N'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status === 'U' ? '승인' : item.status === 'N' ? '미승인' : '삭제'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setFormData({
                              boardKey: item.boardKey,
                              title: item.title,
                              content: '',
                              writer: item.writer,
                              notice: item.notice,
                              secret: item.secret,
                              passwd: '',
                              categoryKey: item.categoryKey,
                              openDate: '',
                              closeDate: '',
                            });
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(item.key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                페이지 {page + 1} / 1
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 게시물 작성/수정 모달 */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedItem ? '게시물 수정' : '게시물 작성'}
                </h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  selectedItem ? handleUpdate() : handleCreate();
                }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      게시판 *
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
                      required
                    >
                      <option value="">게시판 선택</option>
                      {boards.map((board) => (
                        <option key={board.key} value={board.key}>
                          {board.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={formData.categoryKey || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryKey: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
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
                    내용 *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      작성자 *
                    </label>
                    <input
                      type="text"
                      value={formData.writer}
                      onChange={(e) =>
                        setFormData({ ...formData, writer: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호 (비밀글인 경우)
                    </label>
                    <input
                      type="password"
                      value={formData.passwd}
                      onChange={(e) =>
                        setFormData({ ...formData, passwd: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공개 시작일
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.openDate}
                      onChange={(e) =>
                        setFormData({ ...formData, openDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공개 종료일
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.closeDate}
                      onChange={(e) =>
                        setFormData({ ...formData, closeDate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notice === 'Y'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notice: e.target.checked ? 'Y' : 'N',
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">공지사항</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.secret === 'Y'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          secret: e.target.checked ? 'Y' : 'N',
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">비밀글</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedItem ? '수정' : '작성'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedItem(null);
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function BoardItemPage() {
  return (
    <AdminProtectedRoute>
      <BoardItemManagement />
    </AdminProtectedRoute>
  );
}
