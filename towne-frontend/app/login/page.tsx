'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 소셜 로그인 핸들러 (백엔드 API 구현 필요)
  const handleSocialLogin = async (provider: 'kakao' | 'naver' | 'apple') => {
    setLoading(true);
    setError('');

    try {
      // TODO: 백엔드 소셜 로그인 API 구현 필요
      // 현재는 백엔드에 소셜 로그인 API가 구현되어 있지 않습니다.
      // Sprint 4 이후에 구현 예정입니다.
      
      console.log(`${provider} 로그인 시도`);
      alert(`${provider} 소셜 로그인은 현재 개발 중입니다.\n백엔드 API 구현 후 연동 예정입니다.`);
      setLoading(false);
      
      // 실제 구현 시 예시:
      // const response = await authApi.socialLogin(provider, {
      //   code: '...', // OAuth 인증 코드
      //   state: '...'  // OAuth state
      // });
      // if (response.success && response.data) {
      //   const { user, accessToken, refreshToken } = response.data;
      //   setAuth(user, accessToken, refreshToken);
      //   router.push('/');
      // }
    } catch (err: any) {
      setError(`${provider} 로그인에 실패했습니다.`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
              <p className="text-gray-600">
                원하시는 로그인 유형을 선택 해주세요.
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* 카카오 로그인 */}
              <button
                onClick={() => handleSocialLogin('kakao')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오로 로그인
              </button>

              {/* 네이버 로그인 */}
              <button
                onClick={() => handleSocialLogin('naver')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                네이버로 로그인
              </button>

              {/* Apple 로그인 */}
              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-800 rounded-lg bg-white hover:bg-gray-50 text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.09 3.74-4.25.29 2.08-1.85 3.98-3.74 4.25z" />
                </svg>
                Apple로 로그인
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600 space-y-2">
                <div>
                  <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    회원가입방법
                  </Link>
                  {' '}
                  <span className="mx-2">|</span>
                  <Link
                    href="#"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    이용약관 및 개인정보처리방침
                  </Link>
                </div>
                <div className="text-gray-500">
                  관리자 로그인은{' '}
                  <Link
                    href="/admin/login"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    여기
                  </Link>
                  를 클릭하세요
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
