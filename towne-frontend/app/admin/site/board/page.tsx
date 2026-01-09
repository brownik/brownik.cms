'use client';

import AdminProtectedRoute from '@/components/common/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';

interface Board {
  key: number;
  name: string;
  type: string;
  skinKey?: number;
  useYn: 'Y' | 'N';
  commentYn: 'Y' | 'N';
  replyYn: 'Y' | 'N';
  secretYn: 'Y' | 'N';
  adminApprovalYn: 'Y' | 'N';
  insertDate: string;
}

function BoardManagement() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '일반',
    skinKey: undefined as number | undefined,
    useYn: 'Y' as 'Y' | 'N',
    commentYn: 'Y' as 'Y' | 'N',
    replyYn: 'Y' as 'Y' | 'N',
    secretYn: 'N' as 'Y' | 'N',
    adminApprovalYn: 'N' as 'Y' | 'N',
    headerHtml: '',
    footerHtml: '',
    formHtml: '',
  });

  const handleCreate = () => {
    // TODO: API 호출하여 게시판 생성
    alert('게시판이 생성되었습니다.');
    setShowForm(false);
    resetForm();
  };

  const handleUpdate = () => {
    // TODO: API 호출하여 게시판 수정
    alert('게시판이 수정되었습니다.');
    setShowForm(false);
    setSelectedBoard(null);
  };

  const handleDelete = (boardKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    // TODO: API 호출하여 게시판 삭제
    alert('게시판이 삭제되었습니다.');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '일반',
      skinKey: undefined,
      useYn: 'Y',
      commentYn: 'Y',
      replyYn: 'Y',
      secretYn: 'N',
      adminApprovalYn: 'N',
      headerHtml: '',
      footerHtml: '',
      formHtml: '',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">게시판 관리</h1>
          <div className="flex gap-2">
            <Link
              href="/admin/site/board/item"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              게시물 관리
            </Link>
            <button
              onClick={() => {
                setSelectedBoard(null);
                setShowForm(true);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 게시판 추가
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 게시판 목록 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">게시판 목록</h2>
            {boards.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>등록된 게시판이 없습니다.</p>
                <p className="text-sm mt-2">게시판을 추가하여 시작하세요.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {boards.map((board) => (
                  <div
                    key={board.key}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{board.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          타입: {board.type} | 등록일:{' '}
                          {new Date(board.insertDate).toLocaleDateString('ko-KR')}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              board.commentYn === 'Y'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            댓글 {board.commentYn === 'Y' ? '사용' : '미사용'}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              board.replyYn === 'Y'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            답글 {board.replyYn === 'Y' ? '사용' : '미사용'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedBoard(board);
                            setShowForm(true);
                          }}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(board.key)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
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

          {/* 게시판 설정 폼 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedBoard ? '게시판 수정' : '게시판 추가'}
            </h2>
            {showForm ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  selectedBoard ? handleUpdate() : handleCreate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    게시판명 *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    게시판 종류
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="일반">일반</option>
                    <option value="공지">공지</option>
                    <option value="갤러리">갤러리</option>
                    <option value="FAQ">FAQ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    스킨 선택
                  </label>
                  <select
                    value={formData.skinKey || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skinKey: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">기본 스킨</option>
                    {/* TODO: 스킨 목록 로드 */}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    기능 설정
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'commentYn', label: '댓글 사용' },
                      { key: 'replyYn', label: '답글 사용' },
                      { key: 'secretYn', label: '비밀글 사용' },
                      { key: 'adminApprovalYn', label: '관리자 승인' },
                    ].map((option) => (
                      <label key={option.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[option.key as keyof typeof formData] === 'Y'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [option.key]: e.target.checked ? 'Y' : 'N',
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedBoard ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedBoard(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>게시판을 선택하거나 추가 버튼을 클릭하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function BoardPage() {
  return (
    <AdminProtectedRoute>
      <BoardManagement />
    </AdminProtectedRoute>
  );
}
