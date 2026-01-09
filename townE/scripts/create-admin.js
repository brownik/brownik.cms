/**
 * 관리자 계정 생성 스크립트
 */

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('관리자 계정 생성을 시작합니다...');

    // 기존 master 계정이 있는지 확인
    const existingMaster = await prisma.member.findFirst({
      where: {
        userId: 'master',
        status: 'U'
      }
    });

    if (existingMaster) {
      // memberLevel이 9가 아니면 업데이트
      if (existingMaster.memberLevel !== '9') {
        await prisma.member.update({
          where: { key: existingMaster.key },
          data: { memberLevel: '9' }
        });
        console.log('관리자 권한을 업데이트했습니다.');
      }

      // 비밀번호가 'master'가 맞는지 확인하고, 아니면 업데이트
      const isMasterPassword = await bcrypt.compare('master', existingMaster.userPw);
      if (!isMasterPassword) {
        console.log('비밀번호가 일치하지 않아 업데이트합니다...');
        const masterPassword = await bcrypt.hash('master', 12);
        await prisma.member.update({
          where: { key: existingMaster.key },
          data: { userPw: masterPassword }
        });
        console.log('비밀번호를 업데이트했습니다.');
      }

      console.log('master 계정이 존재합니다.');
      console.log('아이디: master');
      console.log('비밀번호: master');
      console.log('회원 키:', existingMaster.key);
      console.log('회원 등급:', existingMaster.memberLevel);
      console.log('상태:', existingMaster.status);
      return;
    }

    // master 계정이 없으면 생성
    console.log('master 계정이 없어 새로 생성합니다...');

    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash('admin1234', 12);

    // 관리자 계정 생성
    const masterPassword = await bcrypt.hash('master', 12);
    const adminUser = await prisma.member.create({
      data: {
        memberType: 'P',
        userId: 'master',
        userPw: masterPassword,
        name: '마스터관리자',
        nickName: '마스터',
        email: 'master@townE.com',
        memberLevel: '9', // 최고관리자
        status: 'U',
        emailAgree: 'Y',
        smsAgree: 'Y',
        insertDate: new Date(),
      }
    });

    console.log('관리자 계정이 성공적으로 생성되었습니다!');
    console.log('아이디: master');
    console.log('비밀번호: master');
    console.log('회원 키:', adminUser.key);

  } catch (error) {
    console.error('관리자 계정 생성 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
createAdminUser();