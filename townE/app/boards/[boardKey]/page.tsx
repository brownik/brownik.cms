'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  getBoardItemList,
  createBoardItem,
  deleteBoardItem,
  type BoardItem,
  type BoardItemCreateRequest,
} from '@/lib/api/board';

interface BoardListPageProps {
  params: Promise<{ boardKey: string }>;
}

export default function BoardListPage({ params }: BoardListPageProps) {
  const { boardKey } = use(params);
  const router = useRouter();
  const [items, setItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<BoardItemCreateRequest>({
    title: '',
    content: '',
    writer: '',
  });

  const boardKeyNum = parseInt(boardKey);

  useEffect(() => {
    loadItems();
  }, [boardKeyNum, page, searchKeyword]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBoardItemList(
        boardKeyNum,
        page,
        10,
        searchKeyword || undefined
      );
      setItems(response.items);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글 목록을 불러오는데 실패했습니다.');
      console.error('게시글 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(0);
  };

  const handleCreate = async () => {
    try {
      if (!createForm.title || !createForm.content || !createForm.writer) {
        alert('제목, 내용, 작성자를 모두 입력해주세요.');
        return;
      }
      await createBoardItem(boardKeyNum, createForm);
      setShowCreateForm(false);
      setCreateForm({ title: '', content: '', writer: '' });
      loadItems();
      alert('게시글이 작성되었습니다.');
    } catch (err: any) {
      alert(err.response?.data?.message || '게시글 작성에 실패했습니다.');
      console.error('게시글 작성 실패:', err);
    }
  };

  const handleDelete = async (itemKey: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    try {
      await deleteBoardItem(boardKeyNum, itemKey);
      loadItems();
      alert('게시글이 삭제되었습니다.');
    } catch (err: any) {
      alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
      console.error('게시글 삭제 실패:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">게시판 (Board Key: {boardKey})</h1>
          <p className="text-gray-600">Sprint 4 테스트 페이지</p>
        </div>

        {/* 검색 및 작성 버튼 */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="검색어 입력..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              검색
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {showCreateForm ? '취소' : '글쓰기'}
          </button>
        </div>

        {/* 게시글 작성 폼 */}
        {showCreateForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">게시글 작성</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">작성자</label>
                <input
                  type="text"
                  value={createForm.writer}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, writer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="작성자 이름"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="게시글 제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  value={createForm.content}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, content: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="게시글 내용"
                />
              </div>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                작성하기
              </button>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 게시글 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      번호
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
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.notice === 'Y' && (
                          <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mr-2">
                            공지
                          </span>
                        )}
                        {item.key}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Link
                          href={`/boards/${boardKey}/items/${item.key}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.title}
                        </Link>
                        {item.secret === 'Y' && (
                          <span className="ml-2 text-gray-400">🔒</span>
                        )}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(item.key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  이전
                </button>
                <span className="px-4 py-2">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
