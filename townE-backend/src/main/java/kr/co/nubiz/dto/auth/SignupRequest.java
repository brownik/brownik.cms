package kr.co.nubiz.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "회원 타입은 필수입니다")
    @Pattern(regexp = "^[PC]$", message = "회원 타입은 P(개인) 또는 C(법인)만 가능합니다")
    private String memberType; // P=개인, C=법인

    @NotBlank(message = "아이디는 필수입니다")
    @Size(min = 4, max = 50, message = "아이디는 4자 이상 50자 이하여야 합니다")
    private String userId;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다")
    private String userPw;

    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 100, message = "이름은 100자 이하여야 합니다")
    private String name;

    @Size(max = 100, message = "닉네임은 100자 이하여야 합니다")
    private String nickName;

    // 법인 회원 전용
    @Size(max = 20, message = "사업자번호는 20자 이하여야 합니다")
    private String businessNumber;

    @Size(max = 200, message = "회사명은 200자 이하여야 합니다")
    private String companyName;

    // 연락처
    @Size(max = 100)
    private String tel;

    @Size(max = 100)
    private String phone;

    @Size(max = 100)
    private String fax;

    @Email(message = "이메일 형식이 올바르지 않습니다")
    @Size(max = 200, message = "이메일은 200자 이하여야 합니다")
    private String email;

    // 개인 정보
    private Integer age;

    @Pattern(regexp = "^[MF]?$", message = "성별은 M(남성) 또는 F(여성)만 가능합니다")
    private String gender;

    @Size(max = 10)
    private String zipCode;

    @Size(max = 200)
    private String address1;

    @Size(max = 200)
    private String address2;

    @Size(max = 100)
    private String birthday;

    @Pattern(regexp = "^[SL]?$", message = "생년월일 타입은 S(양력) 또는 L(음력)만 가능합니다")
    private String birthdayType;

    // 동의 정보
    @Pattern(regexp = "^[YN]?$", message = "이메일 수신 동의는 Y 또는 N만 가능합니다")
    private String emailAgree;

    @Pattern(regexp = "^[YN]?$", message = "SMS 수신 동의는 Y 또는 N만 가능합니다")
    private String smsAgree;
}

