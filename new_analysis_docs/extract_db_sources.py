#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DB 저장형 소스 코드 추출 스크립트
- NU_CONTENTS: HTML, JS, CSS 소스 추출 (메뉴별 컨텐츠)
- NU_LAYOUT: HEADER, FOOTER, LEFT, JS, CSS, META 추출 (레이아웃)
- NU_BOARD: HEADER, FOOTER HTML 추출 (게시판)
- NU_BOARD_SKIN: LIST, VIEW 스킨 HTML/CSS 추출 (게시판 스킨)
- NU_MENU: 메뉴 구조 정보 추출
- NU_CONTENTS_HISTORY: 컨텐츠 변경 이력 추출
"""

import pymysql
import os
import json
from datetime import datetime

# DB 연결 정보
DB_CONFIG = {
    'host': '192.168.0.141',
    'port': 3306,
    'user': 'townE',
    'password': 'townE',
    'database': 'townE',
    'charset': 'utf8mb4'
}

# 출력 디렉토리
OUTPUT_DIR = 'new_analysis_docs/source_assets'

def ensure_dir(directory):
    """디렉토리가 없으면 생성"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def extract_nu_contents(conn):
    """NU_CONTENTS 테이블에서 소스 코드 추출"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    query = """
    SELECT 
        MENUKEY,
        HTML,
        JS,
        CSS,
        INSERTDATE,
        UPDATEDATE
    FROM NU_CONTENTS
    WHERE HTML IS NOT NULL 
       OR JS IS NOT NULL 
       OR CSS IS NOT NULL
    ORDER BY MENUKEY
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    print(f"[NU_CONTENTS] 총 {len(results)}개 레코드 발견")
    
    for idx, row in enumerate(results, 1):
        menu_key = row['MENUKEY']
        
        # HTML 파일 저장
        if row['HTML']:
            html_file = f"{OUTPUT_DIR}/NU_CONTENTS_MENUKEY_{menu_key}.html"
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: MENUKEY={menu_key}\n")
                f.write(f"용도: NU_CONTENTS 테이블의 HTML 컨텐츠\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['HTML'])
            print(f"  [{idx}] HTML 저장: {html_file}")
        
        # JS 파일 저장
        if row['JS']:
            js_file = f"{OUTPUT_DIR}/NU_CONTENTS_MENUKEY_{menu_key}.js"
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(f"/*\n")
                f.write(f"DB PK: MENUKEY={menu_key}\n")
                f.write(f"용도: NU_CONTENTS 테이블의 JavaScript 소스\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"*/\n\n")
                f.write(row['JS'])
            print(f"  [{idx}] JS 저장: {js_file}")
        
        # CSS 파일 저장
        if row['CSS']:
            css_file = f"{OUTPUT_DIR}/NU_CONTENTS_MENUKEY_{menu_key}.css"
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(f"/*\n")
                f.write(f"DB PK: MENUKEY={menu_key}\n")
                f.write(f"용도: NU_CONTENTS 테이블의 CSS 스타일\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"*/\n\n")
                f.write(row['CSS'])
            print(f"  [{idx}] CSS 저장: {css_file}")
    
    cursor.close()
    return len(results)

def extract_nu_menu(conn):
    """NU_MENU 테이블에서 메뉴 정보 추출"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    query = """
    SELECT 
        `KEY`,
        SITEKEY,
        TITLE,
        DESCRIPTION,
        CONTENTTYPE,
        URL,
        LAYOUTKEY,
        ACCESSROLE,
        BOARDKEY,
        STATUS,
        MENUCODE,
        STEPALL,
        PARENTKEY,
        DEPTH
    FROM NU_MENU
    WHERE STATUS != 'D'
    ORDER BY SITEKEY, STEPALL
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    print(f"\n[NU_MENU] 총 {len(results)}개 레코드 발견")
    
    # JSON으로 메뉴 구조 저장
    menu_file = f"{OUTPUT_DIR}/NU_MENU_structure.json"
    with open(menu_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2, default=str)
    print(f"  메뉴 구조 저장: {menu_file}")
    
    # 메뉴별 상세 정보를 텍스트로도 저장
    menu_detail_file = f"{OUTPUT_DIR}/NU_MENU_details.txt"
    with open(menu_detail_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("NU_MENU 테이블 상세 정보\n")
        f.write(f"생성일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 80 + "\n\n")
        
        for row in results:
            f.write(f"[메뉴 KEY: {row['KEY']}]\n")
            f.write(f"  사이트 KEY: {row['SITEKEY']}\n")
            f.write(f"  제목: {row['TITLE']}\n")
            f.write(f"  설명: {row['DESCRIPTION']}\n")
            f.write(f"  컨텐츠 타입: {row['CONTENTTYPE']}\n")
            f.write(f"  URL: {row['URL']}\n")
            f.write(f"  레이아웃 KEY: {row['LAYOUTKEY']}\n")
            f.write(f"  접근 권한: {row['ACCESSROLE']}\n")
            f.write(f"  게시판 KEY: {row['BOARDKEY']}\n")
            f.write(f"  상태: {row['STATUS']}\n")
            f.write(f"  메뉴 코드: {row['MENUCODE']}\n")
            f.write(f"  부모 KEY: {row['PARENTKEY']}\n")
            f.write(f"  깊이: {row['DEPTH']}\n")
            f.write(f"  정렬 순서: {row['STEPALL']}\n")
            f.write("-" * 80 + "\n\n")
    
    print(f"  메뉴 상세 정보 저장: {menu_detail_file}")
    
    cursor.close()
    return len(results)

def extract_nu_layout(conn):
    """NU_LAYOUT 테이블에서 레이아웃 소스 코드 추출"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    query = """
    SELECT 
        `KEY`,
        SITEKEY,
        TITLE,
        HEADER,
        FOOTER,
        `LEFT`,
        JS,
        CSS,
        META,
        INSERTDATE,
        UPDATEDATE
    FROM NU_LAYOUT
    WHERE `STATUS` != 'D'
    ORDER BY SITEKEY, `KEY`
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    print(f"\n[NU_LAYOUT] 총 {len(results)}개 레코드 발견")
    
    for idx, row in enumerate(results, 1):
        layout_key = row['KEY']
        site_key = row['SITEKEY']
        
        # HEADER 파일 저장
        if row['HEADER']:
            header_file = f"{OUTPUT_DIR}/NU_LAYOUT_KEY_{layout_key}_SITE_{site_key}_header.html"
            with open(header_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={layout_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_LAYOUT 테이블의 HEADER HTML\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['HEADER'])
            print(f"  [{idx}] HEADER 저장: {header_file}")
        
        # FOOTER 파일 저장
        if row['FOOTER']:
            footer_file = f"{OUTPUT_DIR}/NU_LAYOUT_KEY_{layout_key}_SITE_{site_key}_footer.html"
            with open(footer_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={layout_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_LAYOUT 테이블의 FOOTER HTML\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['FOOTER'])
            print(f"  [{idx}] FOOTER 저장: {footer_file}")
        
        # LEFT 파일 저장
        if row['LEFT']:
            left_file = f"{OUTPUT_DIR}/NU_LAYOUT_KEY_{layout_key}_SITE_{site_key}_left.html"
            with open(left_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={layout_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_LAYOUT 테이블의 LEFT 메뉴 HTML\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['LEFT'])
            print(f"  [{idx}] LEFT 저장: {left_file}")
        
        # JS 파일 저장
        if row['JS']:
            js_file = f"{OUTPUT_DIR}/NU_LAYOUT_KEY_{layout_key}_SITE_{site_key}.js"
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(f"/*\n")
                f.write(f"DB PK: KEY={layout_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_LAYOUT 테이블의 JavaScript 소스\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"*/\n\n")
                f.write(row['JS'])
            print(f"  [{idx}] JS 저장: {js_file}")
        
        # CSS 파일 저장
        if row['CSS']:
            css_file = f"{OUTPUT_DIR}/NU_LAYOUT_KEY_{layout_key}_SITE_{site_key}.css"
            with open(css_file, 'w', encoding='utf-8') as f:
                f.write(f"/*\n")
                f.write(f"DB PK: KEY={layout_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_LAYOUT 테이블의 CSS 스타일\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"*/\n\n")
                f.write(row['CSS'])
            print(f"  [{idx}] CSS 저장: {css_file}")
        
        # META 파일 저장
        if row['META']:
            meta_file = f"{OUTPUT_DIR}/NU_LAYOUT_KEY_{layout_key}_SITE_{site_key}_meta.html"
            with open(meta_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={layout_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_LAYOUT 테이블의 META 태그\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['META'])
            print(f"  [{idx}] META 저장: {meta_file}")
    
    cursor.close()
    return len(results)

def extract_nu_board(conn):
    """NU_BOARD 테이블에서 게시판 소스 코드 추출"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    query = """
    SELECT 
        `KEY`,
        SITEKEY,
        TITLE,
        HEADER,
        FOOTER,
        INSERTDATE,
        UPDATEDATE
    FROM NU_BOARD
    WHERE (`STATUS` IS NULL OR `STATUS` != 'D')
      AND (HEADER IS NOT NULL OR FOOTER IS NOT NULL)
    ORDER BY SITEKEY, `KEY`
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    print(f"\n[NU_BOARD] 총 {len(results)}개 레코드 발견")
    
    for idx, row in enumerate(results, 1):
        board_key = row['KEY']
        site_key = row['SITEKEY']
        
        # HEADER 파일 저장
        if row['HEADER']:
            header_file = f"{OUTPUT_DIR}/NU_BOARD_KEY_{board_key}_SITE_{site_key}_header.html"
            with open(header_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={board_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_BOARD 테이블의 HEADER HTML\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['HEADER'])
            print(f"  [{idx}] HEADER 저장: {header_file}")
        
        # FOOTER 파일 저장
        if row['FOOTER']:
            footer_file = f"{OUTPUT_DIR}/NU_BOARD_KEY_{board_key}_SITE_{site_key}_footer.html"
            with open(footer_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={board_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_BOARD 테이블의 FOOTER HTML\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['FOOTER'])
            print(f"  [{idx}] FOOTER 저장: {footer_file}")
    
    cursor.close()
    return len(results)

def extract_nu_board_skin(conn):
    """NU_BOARD_SKIN 테이블에서 게시판 스킨 소스 코드 추출"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    query = """
    SELECT 
        `KEY`,
        SITEKEY,
        TITLE,
        `LIST`,
        `READ`,
        `WRITE`,
        `MODIFY`,
        INSERTDATE,
        UPDATEDATE
    FROM NU_BOARD_SKIN
    WHERE (`STATUS` IS NULL OR `STATUS` != 'D')
      AND (`LIST` IS NOT NULL OR `READ` IS NOT NULL OR `WRITE` IS NOT NULL OR `MODIFY` IS NOT NULL)
    ORDER BY `KEY`
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    
    print(f"\n[NU_BOARD_SKIN] 총 {len(results)}개 레코드 발견")
    
    for idx, row in enumerate(results, 1):
        skin_key = row['KEY']
        site_key = row.get('SITEKEY', '')
        
        # LIST 스킨 파일 저장
        if row['LIST']:
            list_file = f"{OUTPUT_DIR}/NU_BOARD_SKIN_KEY_{skin_key}_SITE_{site_key}_list.html"
            with open(list_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={skin_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_BOARD_SKIN 테이블의 LIST 스킨 HTML/CSS\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['LIST'])
            print(f"  [{idx}] LIST 스킨 저장: {list_file}")
        
        # READ 스킨 파일 저장
        if row['READ']:
            read_file = f"{OUTPUT_DIR}/NU_BOARD_SKIN_KEY_{skin_key}_SITE_{site_key}_read.html"
            with open(read_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={skin_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_BOARD_SKIN 테이블의 READ(상세보기) 스킨 HTML/CSS\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['READ'])
            print(f"  [{idx}] READ 스킨 저장: {read_file}")
        
        # WRITE 스킨 파일 저장
        if row['WRITE']:
            write_file = f"{OUTPUT_DIR}/NU_BOARD_SKIN_KEY_{skin_key}_SITE_{site_key}_write.html"
            with open(write_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={skin_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_BOARD_SKIN 테이블의 WRITE(작성) 스킨 HTML/CSS\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['WRITE'])
            print(f"  [{idx}] WRITE 스킨 저장: {write_file}")
        
        # MODIFY 스킨 파일 저장
        if row['MODIFY']:
            modify_file = f"{OUTPUT_DIR}/NU_BOARD_SKIN_KEY_{skin_key}_SITE_{site_key}_modify.html"
            with open(modify_file, 'w', encoding='utf-8') as f:
                f.write(f"<!--\n")
                f.write(f"DB PK: KEY={skin_key}, SITEKEY={site_key}\n")
                f.write(f"용도: NU_BOARD_SKIN 테이블의 MODIFY(수정) 스킨 HTML/CSS\n")
                f.write(f"제목: {row['TITLE']}\n")
                f.write(f"생성일: {row['INSERTDATE']}\n")
                f.write(f"수정일: {row['UPDATEDATE']}\n")
                f.write(f"-->\n\n")
                f.write(row['MODIFY'])
            print(f"  [{idx}] MODIFY 스킨 저장: {modify_file}")
    
    cursor.close()
    return len(results)

def extract_table_schema(conn):
    """테이블 스키마 정보 추출"""
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    tables = ['NU_CONTENTS', 'NU_CONTENTS_HISTORY', 'NU_LAYOUT', 'NU_MENU', 'NU_BOARD', 'NU_BOARD_SKIN']
    
    schema_file = f"{OUTPUT_DIR}/table_schema_info.txt"
    with open(schema_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("테이블 스키마 정보\n")
        f.write(f"생성일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 80 + "\n\n")
        
        for table in tables:
            f.write(f"\n[테이블: {table}]\n")
            f.write("-" * 80 + "\n")
            
            try:
                query = f"DESCRIBE {table}"
                cursor.execute(query)
                columns = cursor.fetchall()
                
                for col in columns:
                    f.write(f"  {col['Field']:30} {col['Type']:20} {col['Null']:5} {col['Key']:5} {col.get('Default', '')}\n")
            except Exception as e:
                f.write(f"  오류: {str(e)}\n")
    
    print(f"\n[스키마] 테이블 구조 저장: {schema_file}")
    cursor.close()

def main():
    print("=" * 80)
    print("DB 저장형 소스 코드 추출 시작")
    print("=" * 80)
    
    ensure_dir(OUTPUT_DIR)
    
    try:
        conn = pymysql.connect(**DB_CONFIG)
        print(f"\n[연결 성공] DB: {DB_CONFIG['database']}@{DB_CONFIG['host']}")
        
        # 테이블 스키마 추출
        extract_table_schema(conn)
        
        # NU_CONTENTS 추출
        content_count = extract_nu_contents(conn)
        
        # NU_LAYOUT 추출
        layout_count = extract_nu_layout(conn)
        
        # NU_BOARD 추출
        board_count = extract_nu_board(conn)
        
        # NU_BOARD_SKIN 추출
        board_skin_count = extract_nu_board_skin(conn)
        
        # NU_MENU 추출
        menu_count = extract_nu_menu(conn)
        
        conn.close()
        
        print("\n" + "=" * 80)
        print("추출 완료!")
        print(f"  - NU_CONTENTS: {content_count}개 레코드")
        print(f"  - NU_LAYOUT: {layout_count}개 레코드")
        print(f"  - NU_BOARD: {board_count}개 레코드")
        print(f"  - NU_BOARD_SKIN: {board_skin_count}개 레코드")
        print(f"  - NU_MENU: {menu_count}개 레코드")
        print(f"  - 출력 디렉토리: {OUTPUT_DIR}")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n[오류 발생] {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()

