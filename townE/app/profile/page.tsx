'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { memberApi, MemberUpdateRequest } from '@/lib/api/member';
import { MemberResponse } from '@/lib/api/member';

function ProfileContent() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [memberInfo, setMemberInfo] = useState<MemberResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MemberUpdateRequest>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMemberInfo();
  }, []);

  const loadMemberInfo = async () => {
    try {
      const response = await memberApi.getMyInfo();
      if (response.success && response.data) {
        setMemberInfo(response.data);
        setFormData({
          name: response.data.name,
          nickName: response.data.nickName,
          email: response.data.email,
          phone: response.data.phone,
        });
      }
    } catch (err: any) {
      setError('회원 정보를 불러오는데 실패했습니다');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await memberApi.updateMyInfo(formData);
      if (response.success && response.data) {
        setMemberInfo(response.data);
        setIsEditing(false);
        setSuccess('회원 정보가 수정되었습니다');
      } else {
        setError(response.message || '수정에 실패했습니다');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || '회원 정보 수정에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (!memberInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">회원 정보</h2>
            <div className="flex gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  수정
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                로그아웃
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이름
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    닉네임
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.nickName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, nickName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    휴대폰
                  </label>
                  <input
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadMemberInfo();
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    아이디
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{memberInfo.userId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    이름
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{memberInfo.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    닉네임
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {memberInfo.nickName || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    회원 타입
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {memberInfo.memberType === 'P' ? '개인' : '법인'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    이메일
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {memberInfo.email || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    휴대폰
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {memberInfo.phone || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    회원 등급
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {memberInfo.memberLevel}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

