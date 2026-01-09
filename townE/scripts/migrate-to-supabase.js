/**
 * MariaDB에서 Supabase PostgreSQL로 데이터 마이그레이션
 * 사용법:
 * 1. Supabase 프로젝트 생성 후 연결 URL 설정
 * 2. .env.local에 SUPABASE_DATABASE_URL 추가
 * 3. npm run migrate-to-supabase 실행
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// 기존 MariaDB 연결
const sourcePrisma = new PrismaClient({
  datasourceUrl: "mysql://townE:townE@192.168.0.153:3306/townE"
});

// 새로운 Supabase PostgreSQL 연결 (환경 변수에서 가져옴)
const targetPrisma = new PrismaClient({
  datasourceUrl: process.env.SUPABASE_DATABASE_URL
});

async function migrateTable(tableName, sourceData, transformFn = (data) => data) {
  console.log(`📊 ${tableName} 테이블 마이그레이션 시작...`);

  try {
    const transformedData = transformFn(sourceData);
    const result = await targetPrisma[tableName].createMany({
      data: transformedData,
      skipDuplicates: true
    });

    console.log(`✅ ${tableName}: ${result.count}개 레코드 마이그레이션 완료`);
    return result.count;
  } catch (error) {
    console.error(`❌ ${tableName} 마이그레이션 실패:`, error.message);
    return 0;
  }
}

async function migrateData() {
  try {
    console.log('🚀 데이터 마이그레이션 시작...');

    // 1. Member 테이블 마이그레이션
    const members = await sourcePrisma.member.findMany();
    await migrateTable('member', members);

    // 2. Board 테이블 마이그레이션
    const boards = await sourcePrisma.board.findMany();
    await migrateTable('board', boards);

    // 3. BoardItem 테이블 마이그레이션
    const boardItems = await sourcePrisma.boardItem.findMany();
    await migrateTable('boardItem', boardItems);

    // 4. Comment 테이블 마이그레이션
    const comments = await sourcePrisma.comment.findMany();
    await migrateTable('comment', comments);

    console.log('🎉 데이터 마이그레이션 완료!');

  } catch (error) {
    console.error('❌ 마이그레이션 중 오류 발생:', error);
  } finally {
    await sourcePrisma.$disconnect();
    await targetPrisma.$disconnect();
  }
}

// 실행
if (!process.env.SUPABASE_DATABASE_URL) {
  console.error('❌ SUPABASE_DATABASE_URL 환경 변수를 설정해주세요');
  console.log('예: SUPABASE_DATABASE_URL="postgresql://..."');
  process.exit(1);
}

migrateData();