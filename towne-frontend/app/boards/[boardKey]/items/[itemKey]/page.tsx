'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import {
  getBoardItemDetail,
  updateBoardItem,
  deleteBoardItem,
  type BoardItem,
  type BoardItemUpdateRequest,
} from '@/lib/api/board';

interface BoardItemDetailPageProps {
  params: Promise<{ boardKey: string; itemKey: string }>;
}

export default function BoardItemDetailPage({ params }: BoardItemDetailPageProps) {
  const { boardKey, itemKey } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<BoardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<BoardItemUpdateRequest>({});

  const boardKeyNum = parseInt(boardKey);
  const itemKeyNum = parseInt(itemKey);

  useEffect(() => {
    loadItem();
  }, [boardKeyNum, itemKeyNum]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoardItemDetail(boardKeyNum, itemKeyNum);
      setItem(data);
      setEditForm({
        title: data.title,
        content: data.content,
        writer: data.writer,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
      console.error('게시글 상세 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!editForm.title || !editForm.content || !editForm.writer) {
        alert('제목, 내용, 작성자를 모두 입력해주세요.');
        return;
      }
      await updateBoardItem(boardKeyNum, itemKeyNum, editForm);
      setIsEditing(false);
      loadItem();
      alert('게시글이 수정되었습니다.');
    } catch (err: any) {
      alert(err.response?.data?.message || '게시글 수정에 실패했습니다.');
      console.error('게시글 수정 실패:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    try {
      await deleteBoardItem(boardKeyNum, itemKeyNum);
      alert('게시글이 삭제되었습니다.');
      router.push(`/boards/${boardKey}`);
    } catch (err: any) {
      alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
      console.error('게시글 삭제 실패:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error || '게시글을 찾을 수 없습니다.'}
          </div>
          <div className="mt-6">
            <Link
              href={`/boards/${boardKey}`}
              className="text-blue-600 hover:text-blue-800"
            >
              ← 목록으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href={`/boards/${boardKey}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>

        {isEditing ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">게시글 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">작성자</label>
                <input
                  type="text"
                  value={editForm.writer || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, writer: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">제목</label>
                <input
                  type="text"
                  value={editForm.title || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  value={editForm.content || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  수정하기
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold">
                  {item.notice === 'Y' && (
                    <span className="inline-block px-2 py-1 text-sm bg-red-100 text-red-800 rounded mr-2">
                      공지
                    </span>
                  )}
                  {item.title}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="flex gap-6 text-sm text-gray-600">
                <span>작성자: {item.writer}</span>
                <span>조회수: {item.hit}</span>
                <span>댓글수: {item.commentCount}</span>
                <span>
                  등록일: {new Date(item.insertDate).toLocaleString('ko-KR')}
                </span>
                {item.updateDate && (
                  <span>
                    수정일: {new Date(item.updateDate).toLocaleString('ko-KR')}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {item.content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
