package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "NU_MEMBER")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`KEY`")
    private Long key;

    @Column(name = "MEMBERTYPE", nullable = false, length = 1)
    private String memberType; // P=개인, C=법인

    @Column(name = "USERID", length = 50)
    private String userId;

    @Column(name = "USERPW", length = 100)
    private String userPw;

    @Column(name = "NAME", length = 200)
    private String name;

    @Column(name = "NICKNAME", length = 20)
    private String nickName;

    @Column(name = "FCMTOKEN", length = 256)
    private String fcmToken;

    @Column(name = "VOLUNTEERID", length = 50)
    private String volunteerId;

    // 법인 회원 전용 필드
    @Column(name = "BUSINESSNUMBER", length = 12)
    private String businessNumber;

    @Column(name = "COMPANYNAME", length = 50)
    private String companyName;

    // 연락처 정보 (암호화)
    @Column(name = "TEL", length = 256)
    private String tel;

    @Column(name = "PHONE", length = 256)
    private String phone;

    @Column(name = "FAX", length = 256)
    private String fax;

    @Column(name = "EMAIL", length = 256)
    private String email;

    // 개인 정보
    @Column(name = "AGE")
    private Integer age;

    @Column(name = "GENDER", length = 1)
    private String gender; // M=남성, F=여성

    @Column(name = "ZIPCODE", length = 5)
    private String zipCode;

    @Column(name = "ADDRESS1", length = 100)
    private String address1;

    @Column(name = "ADDRESS2", length = 100)
    private String address2;

    @Column(name = "BIRTHDAY", length = 256)
    private String birthday;

    @Column(name = "BIRTHDAYTYPE", length = 1)
    private String birthdayType; // S=양력, L=음력

    // 동의 정보
    @Column(name = "EMAILAGREE", length = 1)
    private String emailAgree; // Y=동의, N=비동의

    @Column(name = "SMSAGREE", length = 1)
    private String smsAgree;

    @Column(name = "AGREEMENTDATE")
    private LocalDateTime agreementDate;

    // 회원 등급 및 상태
    @Column(name = "MEMBERLEVEL", length = 50)
    private String memberLevel; // 0=일반, 1-8=등급, 9=최고관리자

    @Column(name = "`STATUS`", nullable = false, length = 1)
    private String status; // U=사용중, D=삭제됨

    @Column(name = "DROPREASON", length = 500)
    private String dropReason;

    // 실명 인증 정보
    @Column(name = "CERTTYPE", length = 1)
    private String certType;

    @Column(name = "CERTKEY1", length = 200)
    private String certKey1;

    @Column(name = "CERTKEY2", length = 200)
    private String certKey2;

    // 로그인 관련
    @Column(name = "LASTLOGINDATE")
    private LocalDateTime lastLoginDate;

    @Column(name = "LASTLOGINIP", length = 15)
    private String lastLoginIp;

    @Column(name = "LOGINFAILCOUNT", nullable = false)
    private Integer loginFailCount;

    // 감사 정보
    @Column(name = "INSERTDATE", nullable = false, updatable = false)
    private LocalDateTime insertDate;

    @Column(name = "INSERTIP", length = 15)
    private String insertIp;

    @Column(name = "INSERTMEMBERKEY")
    private Integer insertMemberKey;

    @Column(name = "UPDATEDATE")
    private LocalDateTime updateDate;

    @Column(name = "UPDATEIP", length = 15)
    private String updateIp;

    @Column(name = "UPDATEMEMBERKEY")
    private Integer updateMemberKey;

    // 참고: 실제 DB에는 DELETEDATE, DELETEIP, DELETEMEMBERKEY 컬럼이 없음
    // 논리 삭제는 STATUS 컬럼으로 처리됨

    @PrePersist
    protected void onCreate() {
        if (insertDate == null) {
            insertDate = LocalDateTime.now();
        }
        if (memberType == null) {
            memberType = "P";
        }
        if (memberLevel == null) {
            memberLevel = "0";
        }
        if (status == null) {
            status = "U";
        }
        if (emailAgree == null) {
            emailAgree = "N";
        }
        if (smsAgree == null) {
            smsAgree = "N";
        }
        if (loginFailCount == null) {
            loginFailCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = LocalDateTime.now();
    }
}

