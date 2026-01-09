package kr.co.nubiz.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MemberUpdateRequest {

    @Size(max = 100, message = "이름은 100자 이하여야 합니다")
    private String name;

    @Size(max = 100, message = "닉네임은 100자 이하여야 합니다")
    private String nickName;

    @Size(max = 100)
    private String tel;

    @Size(max = 100)
    private String phone;

    @Size(max = 100)
    private String fax;

    @Email(message = "이메일 형식이 올바르지 않습니다")
    @Size(max = 200, message = "이메일은 200자 이하여야 합니다")
    private String email;

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

    @Pattern(regexp = "^[YN]?$", message = "이메일 수신 동의는 Y 또는 N만 가능합니다")
    private String emailAgree;

    @Pattern(regexp = "^[YN]?$", message = "SMS 수신 동의는 Y 또는 N만 가능합니다")
    private String smsAgree;
}

