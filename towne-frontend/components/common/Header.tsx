import Link from 'next/link';
import AuthSection from './AuthSection';

export default function Header() {
  const menuItems = [
    { name: '마을활동', href: '/activities', desc: '마을실천의제를 논의하고 진행과정을 기록하는 공간입니다.' },
    { name: '마을의제', href: '/issues', desc: '마을의 문제를 발견하기 위해 주민들이 함께 의제를 이야기 합니다.' },
    { name: '마을총회', href: '/meetings', desc: '주민들이 함께 마을 문제에 대해 토론하고 정보를 공유합니다.' },
    { name: '동네한바퀴', href: '/map', desc: '주민들의 시각에서 제공하는 정보로 함께 만들어가는 참여형 지도입니다.' },
    { name: '마을영상관', href: '/videos', desc: '마을 활동 및 총회등 진행시 기록영상을 공유하는 공간입니다.' },
    { name: '마을자원지도', href: '/resources', desc: '마을이 가지고 있는 자원을 확인하는 지도입니다.' },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              마을e척척
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 인증 섹션만 클라이언트 컴포넌트 */}
          <AuthSection />
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm border rounded hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
