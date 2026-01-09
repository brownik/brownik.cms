'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';

interface BoardManager {
  key: number;
  boardKey: number;
  boardName: string;
  memberKey: number;
  memberName: string;
  memberId: string;
  insertDate: string;
}

function BoardManagerManagement() {
  const [selectedBoardKey, setSelectedBoardKey] = useState<number | undefined>(undefined);
  const [managers, setManagers] = useState<BoardManager[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    boardKey: undefined as number | undefined,
    memberKey: undefined as number | undefined,
    memberId: '',
  });

  const boards = [
    { key: 1, name: '공지사항' },
    { key: 2, name: '자유게시판' },
  ];

  const handleCreate = () => {
    // TODO: API 호출하여 담당자 추가
    alert('게시판 담당자가 추가되었습니다.');
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (managerKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 담당자 삭제
    alert('게시판 담당자가 삭제되었습니다.');
  };

  const resetForm = () => {
    setFormData({
      boardKey: selectedBoardKey,
      memberKey: undefined,
      memberId: '',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">게시판 담당자 관리</h1>
            <p className="text-gray-600 mt-1">게시판별 담당자를 지정합니다.</p>
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
                setShowForm(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 담당자 추가
            </button>
          </div>
        </div>

        {/* 게시판 선택 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  // TODO: 게시판별 담당자 로드
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
          </div>
        </div>

        {/* 담당자 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  게시판
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  담당자 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  담당자명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지정일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {managers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    등록된 담당자가 없습니다.
                  </td>
                </tr>
              ) : (
                managers.map((manager) => (
                  <tr key={manager.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {manager.boardName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manager.memberId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {manager.memberName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(manager.insertDate).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(manager.key)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 담당자 추가 모달 */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">담당자 추가</h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreate();
                }}
                className="p-6 space-y-4"
              >
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
                    회원 ID *
                  </label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) =>
                      setFormData({ ...formData, memberId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="회원 ID를 입력하세요"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    담당자로 지정할 회원의 ID를 입력하세요.
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
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

export default function BoardManagerPage() {
  return (
    <AdminProtectedRoute>
      <BoardManagerManagement />
    </AdminProtectedRoute>
  );
}
