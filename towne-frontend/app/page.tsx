import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import LoginButton from '@/components/common/LoginButton';

export default function Home() {
  const mainMenus = [
    {
      name: '마을활동',
      href: '/activities',
      desc: '마을실천의제를 논의하고 진행과정을 기록하는 공간입니다.',
      icon: '🏘️',
    },
    {
      name: '마을의제',
      href: '/issues',
      desc: '마을의 문제를 발견하기 위해 주민들이 함께 의제를 이야기 합니다.',
      icon: '💬',
    },
    {
      name: '마을총회',
      href: '/meetings',
      desc: '주민들이 함께 마을 문제에 대해 토론하고 정보를 공유합니다.',
      icon: '👥',
    },
    {
      name: '동네한바퀴',
      href: '/map',
      desc: '주민들의 시각에서 제공하는 정보로 함께 만들어가는 참여형 지도입니다.',
      icon: '🗺️',
    },
    {
      name: '마을영상관',
      href: '/videos',
      desc: '마을 활동 및 총회등 진행시 기록영상을 공유하는 공간입니다.',
      icon: '🎬',
    },
    {
      name: '마을자원지도',
      href: '/resources',
      desc: '마을이 가지고 있는 자원을 확인하는 지도입니다.',
      icon: '📍',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* 메인 배너 영역 */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              마을e척척
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              주민이 스스로 해결하는 마을문제
            </p>
            <LoginButton />
          </div>
        </section>

        {/* 메인 메뉴 */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              메인 메뉴
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainMenus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.href}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="text-4xl mb-4">{menu.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {menu.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{menu.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 마을의제 섹션 */}
        <section className="bg-white py-12 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">마을의제</h2>
              <Link
                href="/issues"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                전체보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 샘플 데이터 - 추후 API 연동 */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-gray-500 mb-2">[진월동] 진월마을</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    마을의제 제목 예시 {item}
                  </h3>
                  <p className="text-sm text-gray-600">
                    2026년 진월동 주민총회 마을의제 상정
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 마을총회 섹션 */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">마을총회</h2>
              <Link
                href="/meetings"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                전체보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 샘플 데이터 - 추후 API 연동 */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-blue-600 mb-2">현장투표</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    2025 학운동 주민총회 {item}
                  </h3>
                  <p className="text-sm text-gray-500">
                    2025. 08. 12 ~ 08. 19
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 마을활동 섹션 */}
        <section className="bg-white py-12 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">마을활동</h2>
              <Link
                href="/activities"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                전체보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 샘플 데이터 - 추후 API 연동 */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-gray-500 mb-2">[운암1마을]</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    마을활동 제목 예시 {item}
                  </h3>
                  <p className="text-sm text-gray-500">
                    2025. 09. 24 ~ 12. 31
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
