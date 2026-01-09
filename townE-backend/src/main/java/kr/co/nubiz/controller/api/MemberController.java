package kr.co.nubiz.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import kr.co.nubiz.common.dto.ApiResponse;
import kr.co.nubiz.dto.member.MemberResponse;
import kr.co.nubiz.dto.member.MemberUpdateRequest;
import kr.co.nubiz.entity.Member;
import kr.co.nubiz.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberResponse>> getMyInfo(Authentication authentication) {
        String userId = authentication.getName();
        log.info("회원 정보 조회 요청: userId={}", userId);

        Member member = memberService.findByUserId(userId);

        MemberResponse response = MemberResponse.builder()
                .id(member.getKey())
                .userId(member.getUserId())
                .name(member.getName())
                .nickName(member.getNickName())
                .memberType(member.getMemberType())
                .email(member.getEmail())
                .phone(member.getPhone())
                .memberLevel(member.getMemberLevel())
                .status(member.getStatus())
                .build();

        return ResponseEntity.ok(ApiResponse.success("회원 정보 조회 성공", response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<MemberResponse>> updateMyInfo(
            @Valid @RequestBody MemberUpdateRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String userId = authentication.getName();
        log.info("회원 정보 수정 요청: userId={}", userId);

        Member member = memberService.findByUserId(userId);

        // 정보 업데이트
        if (request.getName() != null) member.setName(request.getName());
        if (request.getNickName() != null) member.setNickName(request.getNickName());
        if (request.getTel() != null) member.setTel(request.getTel());
        if (request.getPhone() != null) member.setPhone(request.getPhone());
        if (request.getFax() != null) member.setFax(request.getFax());
        if (request.getEmail() != null) member.setEmail(request.getEmail());
        if (request.getAge() != null) member.setAge(request.getAge());
        if (request.getGender() != null) member.setGender(request.getGender());
        if (request.getZipCode() != null) member.setZipCode(request.getZipCode());
        if (request.getAddress1() != null) member.setAddress1(request.getAddress1());
        if (request.getAddress2() != null) member.setAddress2(request.getAddress2());
        if (request.getBirthday() != null) member.setBirthday(request.getBirthday());
        if (request.getBirthdayType() != null) member.setBirthdayType(request.getBirthdayType());
        if (request.getEmailAgree() != null) member.setEmailAgree(request.getEmailAgree());
        if (request.getSmsAgree() != null) member.setSmsAgree(request.getSmsAgree());

        // IP 주소 설정
        String clientIp = getClientIp(httpRequest);
        member.setUpdateIp(clientIp);

        Member updatedMember = memberService.updateMember(member);

        MemberResponse response = MemberResponse.builder()
                .id(updatedMember.getKey())
                .userId(updatedMember.getUserId())
                .name(updatedMember.getName())
                .nickName(updatedMember.getNickName())
                .memberType(updatedMember.getMemberType())
                .email(updatedMember.getEmail())
                .phone(updatedMember.getPhone())
                .memberLevel(updatedMember.getMemberLevel())
                .status(updatedMember.getStatus())
                .build();

        return ResponseEntity.ok(ApiResponse.success("회원 정보가 수정되었습니다", response));
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}

