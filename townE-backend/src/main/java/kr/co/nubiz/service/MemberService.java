package kr.co.nubiz.service;

import kr.co.nubiz.dto.auth.SignupRequest;
import kr.co.nubiz.entity.Member;
import kr.co.nubiz.repository.MemberRepository;
import kr.co.nubiz.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Member signup(SignupRequest request) {
        // 중복 아이디 체크
        if (memberRepository.checkUserIdExists(request.getUserId())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다");
        }

        // 중복 이메일 체크 (이메일이 있는 경우)
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            if (memberRepository.checkEmailExists(request.getEmail())) {
                throw new RuntimeException("이미 사용 중인 이메일입니다");
            }
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getUserPw());

        // Member 엔티티 생성
        Member member = Member.builder()
                .memberType(request.getMemberType())
                .userId(request.getUserId())
                .userPw(encodedPassword)
                .name(request.getName())
                .nickName(request.getNickName())
                .businessNumber(request.getBusinessNumber())
                .companyName(request.getCompanyName())
                .tel(request.getTel())
                .phone(request.getPhone())
                .fax(request.getFax())
                .email(request.getEmail())
                .age(request.getAge())
                .gender(request.getGender())
                .zipCode(request.getZipCode())
                .address1(request.getAddress1())
                .address2(request.getAddress2())
                .birthday(request.getBirthday())
                .birthdayType(request.getBirthdayType())
                .emailAgree(request.getEmailAgree() != null ? request.getEmailAgree() : "N")
                .smsAgree(request.getSmsAgree() != null ? request.getSmsAgree() : "N")
                .agreementDate(LocalDateTime.now())
                .memberLevel("0") // 기본 등급
                .status("U") // 사용중
                .loginFailCount(0)
                .insertDate(LocalDateTime.now())
                .build();

        return memberRepository.save(member);
    }

    public Member findByUserId(String userId) {
        log.debug("사용자 조회 시도: userId={}", userId);
        Member member = memberRepository.findByUserIdAndStatus(userId, "U")
                .orElseThrow(() -> {
                    log.warn("사용자를 찾을 수 없음: userId={}", userId);
                    return new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다");
                });
        log.debug("사용자 조회 성공: userId={}, key={}, status={}", userId, member.getKey(), member.getStatus());
        return member;
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        // SHA-256 (기존 시스템) 또는 BCrypt (새 시스템) 모두 지원
        boolean result = PasswordUtil.matches(rawPassword, encodedPassword, passwordEncoder);
        
        // 디버깅 로그
        if (!result) {
            log.debug("비밀번호 검증 실패 - 저장된 비밀번호 길이: {}, SHA-256 형식: {}", 
                encodedPassword != null ? encodedPassword.length() : 0,
                encodedPassword != null ? PasswordUtil.isSha256Format(encodedPassword) : false);
        } else {
            log.debug("비밀번호 검증 성공 - SHA-256 형식: {}", 
                encodedPassword != null ? PasswordUtil.isSha256Format(encodedPassword) : false);
        }
        
        return result;
    }

    @Transactional
    public void updateLoginInfo(Long memberKey, String ip) {
        Member member = memberRepository.findById(memberKey)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        member.setLastLoginDate(LocalDateTime.now());
        member.setLastLoginIp(ip);
        member.setLoginFailCount(0); // 로그인 성공 시 실패 횟수 초기화
        
        memberRepository.save(member);
    }

    @Transactional
    public void incrementLoginFailCount(String userId) {
        memberRepository.findByUserId(userId).ifPresent(member -> {
            member.setLoginFailCount(member.getLoginFailCount() + 1);
            memberRepository.save(member);
        });
    }

    @Transactional
    public Member updateMember(Member member) {
        return memberRepository.save(member);
    }
}

