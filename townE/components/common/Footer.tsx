export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">마을e척척</h3>
            <p className="text-gray-400 text-sm">
              주민이 스스로 해결하는 마을문제
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">안내</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">이용약관 및 개인정보처리방침</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">회원가입방법</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">연락처</h4>
            <p className="text-gray-400 text-sm">
              (61226) 광주광역시 북구 독립로375번길 80 푸른이음센터<br />
              Tel. 062-515-2800 FAX: 062-515-2808
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            마을e척척은 행정안전부가 주최하고, 한국정보화 진흥원이 주관하는 
            '2019년 디지털 사회혁신 프로젝트'의 지원을 받아 개발하였습니다.
          </p>
          <p className="mt-2">
            COPYRIGHT (C) 2019 GURCC. ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
