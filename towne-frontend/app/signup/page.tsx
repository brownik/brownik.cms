'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    memberType: 'P' as 'P' | 'C',
    userId: '',
    userPw: '',
    userPwConfirm: '',
    name: '',
    nickName: '',
    email: '',
    phone: '',
    businessNumber: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.userPw !== formData.userPwConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.userPw.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        memberType: formData.memberType,
        userId: formData.userId,
        userPw: formData.userPw,
        name: formData.name,
        nickName: formData.nickName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        businessNumber:
          formData.memberType === 'C'
            ? formData.businessNumber || undefined
            : undefined,
        companyName:
          formData.memberType === 'C'
            ? formData.companyName || undefined
            : undefined,
      };

      const response = await authApi.signup(signupData);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;
        setAuth(user, accessToken, refreshToken);
        router.push('/');
      } else {
        setError(response.message || '회원가입에 실패했습니다');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.userId ||
          '회원가입에 실패했습니다'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              회원가입
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                로그인
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 회원 타입 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회원 타입
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="memberType"
                    value="P"
                    checked={formData.memberType === 'P'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        memberType: e.target.value as 'P' | 'C',
                      })
                    }
                    className="mr-2"
                  />
                  개인
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="memberType"
                    value="C"
                    checked={formData.memberType === 'C'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        memberType: e.target.value as 'P' | 'C',
                      })
                    }
                    className="mr-2"
                  />
                  법인
                </label>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  아이디 <span className="text-red-500">*</span>
                </label>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  minLength={4}
                  maxLength={50}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="userPw" className="block text-sm font-medium text-gray-700">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  id="userPw"
                  name="userPw"
                  type="password"
                  required
                  minLength={8}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.userPw}
                  onChange={(e) =>
                    setFormData({ ...formData, userPw: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="userPwConfirm" className="block text-sm font-medium text-gray-700">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <input
                  id="userPwConfirm"
                  name="userPwConfirm"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.userPwConfirm}
                  onChange={(e) =>
                    setFormData({ ...formData, userPwConfirm: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="nickName" className="block text-sm font-medium text-gray-700">
                  닉네임
                </label>
                <input
                  id="nickName"
                  name="nickName"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.nickName}
                  onChange={(e) =>
                    setFormData({ ...formData, nickName: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  휴대폰
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            {/* 법인 회원 전용 필드 */}
            {formData.memberType === 'C' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="businessNumber" className="block text-sm font-medium text-gray-700">
                    사업자번호
                  </label>
                  <input
                    id="businessNumber"
                    name="businessNumber"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.businessNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, businessNumber: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    회사명
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

