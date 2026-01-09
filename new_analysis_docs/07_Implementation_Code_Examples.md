# 핵심 기능 구현 코드 예시

## 개요

이 문서는 townE 시스템의 핵심 기능을 구현하기 위한 실제 코드 예시를 제공합니다. Controller, Service, Mapper 패턴을 따라 작성되었습니다.

## 1. 회원 관리 구현

### 1.1 MemberVO (Value Object)

```java
package kr.co.nubiz.admin.member.service;

import lombok.Data;
import java.util.Date;

@Data
public class MemberVO {
    private int key;                    // 회원 키
    private String memberType;          // 회원 타입: P=개인, C=법인
    private String userId;               // 사용자 ID
    private String userPw;              // 비밀번호 (SHA-256 암호화)
    private String name;                 // 이름
    private String nickName;            // 닉네임 (개인 회원)
    
    // 법인 회원 전용
    private String businessNumber;      // 사업자번호
    private String companyName;         // 회사명
    
    // 연락처 (DES 암호화)
    private String tel;                 // 전화번호
    private String tel1, tel2, tel3;    // 전화번호 분리
    private String phone;               // 휴대폰
    private String phone1, phone2, phone3;
    private String fax;                 // 팩스
    private String fax1, fax2, fax3;
    private String email;               // 이메일
    private String email1, email2;
    
    // 개인 정보
    private int age;                    // 나이
    private String gender;               // 성별: M=남성, F=여성
    private String zipCode;             // 우편번호
    private String address1;            // 주소1
    private String address2;            // 주소2
    private String birthDay;            // 생년월일 (암호화)
    private String birthDayType;        // 생년월일 타입: S=양력, L=음력
    
    // 동의 정보
    private String emailAgree;          // 이메일 수신 동의: Y=동의, N=비동의
    private String smsAgree;            // SMS 수신 동의
    private Date agreementDate;         // 약관 동의일
    
    // 회원 등급 및 상태
    private String memberLevel;         // 회원 등급: 0=일반, 1-8=등급, 9=최고관리자
    private String status;               // 상태: U=사용중, D=삭제됨
    
    // 실명 인증
    private String certType;            // 인증 타입
    private String certKey1;            // 인증 키1
    private String certKey2;            // 인증 키2
    
    // 로그인 관련
    private Date lastLoginDate;         // 마지막 로그인 일시
    private String lastLoginIp;         // 마지막 로그인 IP
    private int loginFailCount;         // 로그인 실패 횟수
    
    // 감사 정보
    private Date insertDate;            // 등록일
    private String insertIp;            // 등록 IP
    private int insertMemberKey;        // 등록한 회원 키
    private Date updateDate;            // 수정일
    private String updateIp;            // 수정 IP
    private int updateMemberKey;        // 수정한 회원 키
}
```

### 1.2 IMemberService (Service Interface)

```java
package kr.co.nubiz.admin.member.service;

import java.util.HashMap;
import java.util.List;

public interface IMemberService {
    // 회원 등록
    void insert(MemberVO memberVO);
    
    // 회원 수정
    void update(MemberVO memberVO);
    
    // 회원 삭제 (논리 삭제)
    void delete(MemberVO memberVO);
    
    // 회원 조회
    MemberVO getData(MemberVO memberVO);
    
    // 아이디 중복 체크
    int overlapCheck(MemberVO memberVO);
    
    // 회원 목록 조회
    List<MemberVO> getList(HashMap<String, Object> map);
    
    // 전체 레코드 수
    int getTotalRow(HashMap<String, Object> map);
    
    // Spring Security용 회원 조회
    MemberVO getSecurityMember(MemberVO memberVO);
    
    // SNS 회원 조회
    MemberVO getDataBySns(String snsType, String snsCertKey);
}
```

### 1.3 MemberServiceImpl (Service Implementation)

```java
package kr.co.nubiz.admin.member.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.nubiz.admin.member.service.IMemberService;
import kr.co.nubiz.admin.member.service.IMemberMapper;
import kr.co.nubiz.admin.member.service.MemberVO;

@Service("memberService")
public class MemberServiceImpl implements IMemberService {
    
    @Resource(name="memberMapper")
    private IMemberMapper memberMapper;
    
    @Override
    public void insert(MemberVO memberVO) {
        memberMapper.insert(memberVO);
    }
    
    @Override
    public void update(MemberVO memberVO) {
        memberMapper.update(memberVO);
    }
    
    @Override
    public void delete(MemberVO memberVO) {
        memberMapper.delete(memberVO);
    }
    
    @Override
    public MemberVO getData(MemberVO memberVO) {
        return memberMapper.getData(memberVO);
    }
    
    @Override
    public int overlapCheck(MemberVO memberVO) {
        return memberMapper.overlapCheck(memberVO);
    }
    
    @Override
    public List<MemberVO> getList(HashMap<String, Object> map) {
        return memberMapper.getList(map);
    }
    
    @Override
    public int getTotalRow(HashMap<String, Object> map) {
        return memberMapper.getTotalRow(map);
    }
    
    @Override
    public MemberVO getSecurityMember(MemberVO memberVO) {
        return memberMapper.getSecurityMember(memberVO);
    }
    
    @Override
    public MemberVO getDataBySns(String snsType, String snsCertKey) {
        MemberVO mvo = new MemberVO();
        mvo.setSnsType(snsType);
        mvo.setSnsCertKey(snsCertKey);
        return memberMapper.getDataBySns(mvo);
    }
}
```

### 1.4 IMemberMapper (Mapper Interface)

```java
package kr.co.nubiz.admin.member.service.impl;

import java.util.HashMap;
import java.util.List;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.co.nubiz.admin.member.service.MemberVO;

@Mapper("memberMapper")
public interface IMemberMapper {
    void insert(MemberVO memberVO);
    void update(MemberVO memberVO);
    void delete(MemberVO memberVO);
    MemberVO getData(MemberVO memberVO);
    int overlapCheck(MemberVO memberVO);
    List<MemberVO> getList(HashMap<String, Object> map);
    int getTotalRow(HashMap<String, Object> map);
    MemberVO getSecurityMember(MemberVO memberVO);
    MemberVO getDataBySns(MemberVO memberVO);
}
```

### 1.5 MemberController (Controller)

```java
package kr.co.nubiz.admin.member.web;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.co.nubiz.admin.code.service.CodeVO;
import kr.co.nubiz.admin.code.service.ICodeService;
import kr.co.nubiz.admin.member.service.IMemberService;
import kr.co.nubiz.admin.member.service.MemberVO;
import kr.co.nubiz.common.utils.CommonUtil;
import kr.co.nubiz.common.utils.EncryptionUtil;
import kr.co.nubiz.common.utils.SessionUtil;

@Controller("memberController")
@RequestMapping(value="/admin/member")
public class MemberController {
    
    public final String MENU_CODE = "MEMBER";
    
    @Resource(name="memberService")
    private IMemberService memberService;
    
    @Resource(name="codeService")
    private ICodeService codeService;
    
    // 회원 목록 조회
    @RequestMapping(value="/list.do")
    public String getListA(HttpServletRequest req, Model model) {
        SessionUtil.setCurrentMenuCode(MENU_CODE);
        SessionUtil.setCurrentMenuSubTitle("목록");
        
        int currentPage = Integer.parseInt(
            req.getParameter("currentPage") != null ? req.getParameter("currentPage") : "1"
        );
        
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("searchType", req.getParameter("searchType"));
        map.put("searchKeyword", req.getParameter("searchKeyword"));
        map.put("siteKey", SessionUtil.getCurrentSite().getKey());
        
        PaginationInfo paging = new PaginationInfo();
        paging.setTotalRecordCount(memberService.getTotalRow(map));
        paging.setCurrentPageNo(currentPage);
        paging.setPageSize(10);
        paging.setRecordCountPerPage(20);
        
        map.put("endLimit", paging.getRecordCountPerPage());
        map.put("startLimit", paging.getFirstRecordIndex());
        
        List<MemberVO> list = memberService.getList(map);
        
        SessionUtil.setSearchQuery(CommonUtil.getUrlParameter(req));
        
        model.addAttribute("searchType", map.get("searchType"));
        model.addAttribute("searchKeyword", map.get("searchKeyword"));
        model.addAttribute("getMemberListValue", list);
        model.addAttribute("paging", paging);
        
        return "/admin/member/list";
    }
    
    // 회원 등록 페이지
    @RequestMapping(value="/insert.do", method=RequestMethod.GET)
    public String insertV(Model model, HttpServletRequest req) {
        SessionUtil.setCurrentMenuCode(MENU_CODE);
        SessionUtil.setCurrentMenuSubTitle("등록");
        
        String returnURL = "";
        if(req.getParameter("gubun").toString().equals("P")) {
            returnURL = "/admin/member/insertPerson";
        } else {
            returnURL = "/admin/member/insertCompany";
        }
        
        // 공통코드 조회
        CodeVO cvo = new CodeVO();
        cvo.setCode("TEL");
        List<CodeVO> list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getTelValue", list);
        
        cvo.setCode("PHONE");
        list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getPhoneValue", list);
        
        cvo.setCode("EMAIL");
        list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getEmailValue", list);
        
        cvo.setCode("MEMBERLEVEL");
        list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getLevelValue", list);
        
        return returnURL;
    }
    
    // 회원 등록
    @RequestMapping(value="/insert.do", method=RequestMethod.POST)
    public String insertA(@ModelAttribute("mvo") MemberVO mvo, HttpServletRequest req) {
        MemberVO my = (MemberVO) req.getSession().getAttribute("getDataLogin");
        
        mvo.setUserId(mvo.getUserId().toLowerCase());
        
        // 암호화
        mvo.setUserPw(EncryptionUtil.ENC_SHA256(mvo.getUserPw()));
        mvo.setEmail(EncryptionUtil.ENC_DES(mvo.getEmail1() + "@" + mvo.getEmail2()));
        mvo.setTel(EncryptionUtil.ENC_DES(mvo.getTel1() + "" + mvo.getTel2() + "" + mvo.getTel3()));
        mvo.setPhone(EncryptionUtil.ENC_DES(mvo.getPhone1() + "" + mvo.getPhone2() + "" + mvo.getPhone3()));
        mvo.setBirthDay(EncryptionUtil.ENC_DES(mvo.getBirthDay()));
        
        mvo.setInsertIp(req.getRemoteAddr());
        mvo.setInsertMemberKey(my.getKey());
        
        memberService.insert(mvo);
        
        return "redirect:/admin/member/list.do" + SessionUtil.getSearchQuery();
    }
    
    // 아이디 중복 체크
    @RequestMapping(value="/overlapCheck.do", method=RequestMethod.POST)
    @ResponseBody
    public boolean overlapCheckA(@ModelAttribute("mvo") MemberVO mvo) {
        mvo.setUserId(mvo.getUserId().toLowerCase());
        
        if(memberService.overlapCheck(mvo) > 0) {
            return false;
        } else {
            return true;
        }
    }
    
    // 회원 상세 조회
    @RequestMapping(value="/getData.do")
    public String readA(@ModelAttribute("mvo") MemberVO mvo, HttpServletRequest req, Model model) {
        SessionUtil.setCurrentMenuCode(MENU_CODE);
        SessionUtil.setCurrentMenuSubTitle("상세 보기");
        
        // 공통코드 조회
        CodeVO cvo = new CodeVO();
        cvo.setCode("TEL");
        List<CodeVO> list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getTelValue", list);
        
        cvo.setCode("PHONE");
        list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getPhoneValue", list);
        
        cvo.setCode("EMAIL");
        list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getEmailValue", list);
        
        cvo.setCode("MEMBERLEVEL");
        list = codeService.getListSelectedGroup(cvo);
        model.addAttribute("getLevelValue", list);
        
        mvo = memberService.getData(mvo);
        
        // 복호화
        mvo.setTel(EncryptionUtil.DEC_DES(mvo.getTel()));
        mvo.setPhone(EncryptionUtil.DEC_DES(mvo.getPhone()));
        mvo.setEmail(EncryptionUtil.DEC_DES(mvo.getEmail()));
        mvo.setBirthDay(EncryptionUtil.DEC_DES(mvo.getBirthDay()));
        
        // 분리
        if(mvo.getTel() != null && mvo.getTel().length() > 10) {
            mvo.setTel1(mvo.getTel().substring(0, 3));
            mvo.setTel2(mvo.getTel().substring(3, 7));
            mvo.setTel3(mvo.getTel().substring(7));
        }
        
        if(mvo.getPhone() != null && mvo.getPhone().length() > 10) {
            mvo.setPhone1(mvo.getPhone().substring(0, 3));
            mvo.setPhone2(mvo.getPhone().substring(3, 7));
            mvo.setPhone3(mvo.getPhone().substring(7));
        }
        
        if(mvo.getEmail() != null) {
            mvo.setEmail1(mvo.getEmail().substring(0, mvo.getEmail().indexOf("@")));
            mvo.setEmail2(mvo.getEmail().substring(mvo.getEmail().indexOf("@") + 1));
        }
        
        model.addAttribute("getDataValue", mvo);
        return "/admin/member/read";
    }
    
    // 회원 수정
    @RequestMapping(value="/update.do", method=RequestMethod.POST)
    public String updateA(@ModelAttribute("mvo") MemberVO mvo, HttpServletRequest req) {
        MemberVO my = (MemberVO) req.getSession().getAttribute("getDataLogin");
        
        // 암호화
        if(mvo.getUserPw() != null && !mvo.getUserPw().equals("")) {
            mvo.setUserPw(EncryptionUtil.ENC_SHA256(mvo.getUserPw()));
        }
        mvo.setEmail(EncryptionUtil.ENC_DES(mvo.getEmail1() + "@" + mvo.getEmail2()));
        mvo.setTel(EncryptionUtil.ENC_DES(mvo.getTel1() + "" + mvo.getTel2() + "" + mvo.getTel3()));
        mvo.setPhone(EncryptionUtil.ENC_DES(mvo.getPhone1() + "" + mvo.getPhone2() + "" + mvo.getPhone3()));
        mvo.setBirthDay(EncryptionUtil.ENC_DES(mvo.getBirthDay()));
        
        mvo.setUpdateIp(req.getRemoteAddr());
        mvo.setUpdateMemberKey(my.getKey());
        
        memberService.update(mvo);
        
        return "redirect:/admin/member/list.do?" + SessionUtil.getSearchQuery();
    }
    
    // 회원 삭제
    @RequestMapping(value="/delete.do")
    public String deleteA(@ModelAttribute("mvo") MemberVO mvo, HttpServletRequest req) {
        memberService.delete(mvo);
        return "redirect:/admin/member/list.do?" + SessionUtil.getSearchQuery();
    }
}
```

### 1.6 memberMapper_SQL.xml (MyBatis Mapper)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="kr.co.nubiz.admin.member.service.impl.IMemberMapper">
    
    <!-- 회원 등록 -->
    <insert id="insert" parameterType="memberVO">
        INSERT INTO NU_MEMBER
        (
            <choose>
                <when test="memberType != null and memberType.equals('P')">
                    MEMBERTYPE, USERID, USERPW, NAME, NICKNAME,
                    TEL, PHONE, FAX, EMAIL, AGE, GENDER,
                    ZIPCODE, ADDRESS1, ADDRESS2,
                    BIRTHDAY, BIRTHDAYTYPE,
                    EMAILAGREE, SMSAGREE,
                    MEMBERLEVEL, `STATUS`, AGREEMENTDATE,
                    INSERTDATE, INSERTIP, INSERTMEMBERKEY
                </when>
                <otherwise>
                    MEMBERTYPE, BUSINESSNUMBER, COMPANYNAME,
                    USERID, USERPW, NAME,
                    TEL, PHONE, FAX, EMAIL, AGE, GENDER,
                    ZIPCODE, ADDRESS1, ADDRESS2,
                    BIRTHDAY, BIRTHDAYTYPE,
                    EMAILAGREE, SMSAGREE,
                    MEMBERLEVEL, `STATUS`, AGREEMENTDATE,
                    INSERTDATE, INSERTIP, INSERTMEMBERKEY
                </otherwise>
            </choose>
            <if test="certType != null and certType != ''">
                , CERTTYPE, CERTKEY1, CERTKEY2
            </if>
        )
        VALUES
        (
            <choose>
                <when test="memberType != null and memberType.equals('P')">
                    #{memberType}, #{userId}, #{userPw}, #{name}, #{nickName},
                    #{tel}, #{phone}, #{fax}, #{email}, #{age}, #{gender},
                    #{zipCode}, #{address1}, #{address2},
                    #{birthDay}, #{birthDayType},
                    #{emailAgree}, #{smsAgree},
                    #{memberLevel}, #{status}, NOW(),
                    NOW(), #{insertIp}, #{insertMemberKey}
                </when>
                <otherwise>
                    #{memberType}, #{businessNumber}, #{companyName},
                    #{userId}, #{userPw}, #{name},
                    #{tel}, #{phone}, #{fax}, #{email}, #{age}, #{gender},
                    #{zipCode}, #{address1}, #{address2},
                    #{birthDay}, #{birthDayType},
                    #{emailAgree}, #{smsAgree},
                    #{memberLevel}, #{status}, NOW(),
                    NOW(), #{insertIp}, #{insertMemberKey}
                </otherwise>
            </choose>
            <if test="certType != null and certType != ''">
                , #{certType}, #{certKey1}, #{certKey2}
            </if>
        )
        <selectKey keyProperty="key" resultType="int" order="AFTER">
            SELECT LAST_INSERT_ID();
        </selectKey>
    </insert>
    
    <!-- 아이디 중복 체크 -->
    <select id="overlapCheck" parameterType="memberVO" resultType="int">
        SELECT COUNT(1) AS COUNT 
        FROM NU_MEMBER 
        WHERE USERID = #{userId}
    </select>
    
    <!-- 회원 조회 -->
    <select id="getData" parameterType="memberVO" resultType="memberVO">
        SELECT * 
        FROM NU_MEMBER
        WHERE `KEY` = #{key}
        AND `STATUS` != 'D'
    </select>
    
    <!-- 회원 수정 -->
    <update id="update" parameterType="memberVO">
        UPDATE NU_MEMBER
        SET UPDATEDATE = NOW(),
            UPDATEIP = #{updateIp},
            UPDATEMEMBERKEY = #{updateMemberKey}
            <if test="userPw != null and userPw != ''">
                , USERPW = #{userPw}
            </if>
            <if test="name != null and name != ''">
                , NAME = #{name}
            </if>
            <if test="nickName != null and nickName != ''">
                , NICKNAME = #{nickName}
            </if>
            <if test="email != null and email != ''">
                , EMAIL = #{email}
            </if>
            <if test="phone != null and phone != ''">
                , PHONE = #{phone}
            </if>
            <if test="memberLevel != null and memberLevel != ''">
                , MEMBERLEVEL = #{memberLevel}
            </if>
            <if test="status != null and status != ''">
                , `STATUS` = #{status}
            </if>
        WHERE `KEY` = #{key}
    </update>
    
    <!-- 회원 삭제 (논리 삭제) -->
    <update id="delete" parameterType="memberVO">
        UPDATE NU_MEMBER
        SET `STATUS` = 'D',
            USERID = NULL,
            NAME = '삭제된 회원',
            NICKNAME = '삭제된 회원',
            TEL = NULL,
            PHONE = NULL,
            EMAIL = NULL,
            UPDATEDATE = NOW(),
            UPDATEIP = #{updateIp},
            UPDATEMEMBERKEY = #{key}
        WHERE `KEY` = #{key}
    </update>
    
    <!-- 회원 목록 조회 -->
    <select id="getList" parameterType="java.util.HashMap" resultType="memberVO">
        SELECT M.*
        FROM NU_MEMBER AS M
        INNER JOIN NU_MEMBER_SITE MS ON (M.`KEY` = MS.MEMBERKEY)
        WHERE M.`STATUS` != 'D'
        AND MS.`SITEKEY` = #{siteKey}
        <if test="searchType != null and searchType != '' and searchKeyword != null and searchKeyword != ''">
            AND M.${searchType} LIKE CONCAT('%', #{searchKeyword}, '%')
        </if>
        ORDER BY M.insertDate DESC
        LIMIT #{startLimit}, #{endLimit}
    </select>
    
    <!-- 전체 레코드 수 -->
    <select id="getTotalRow" parameterType="java.util.HashMap" resultType="int">
        SELECT COUNT(1) AS COUNT
        FROM NU_MEMBER AS M
        INNER JOIN NU_MEMBER_SITE MS ON (M.`KEY` = MS.MEMBERKEY)
        WHERE M.`STATUS` != 'D'
        AND MS.`SITEKEY` = #{siteKey}
        <if test="searchType != null and searchType != '' and searchKeyword != null and searchKeyword != ''">
            AND M.${searchType} LIKE CONCAT('%', #{searchKeyword}, '%')
        </if>
    </select>
    
    <!-- Spring Security용 회원 조회 -->
    <select id="getSecurityMember" parameterType="memberVO" resultType="memberVO">
        SELECT * 
        FROM NU_MEMBER
        WHERE STATUS != 'D'
        AND USERID = #{userId}
    </select>
    
    <!-- SNS 회원 조회 -->
    <select id="getDataBySns" parameterType="memberVO" resultType="memberVO">
        SELECT m.`KEY`, m.USERID, m.MEMBERLEVEL, m.PHONE, m.EMAIL, 
               s.SNSCERTKEY AS userPw, s.SNSTYPE, s.SNSCERTKEY
        FROM NU_MEMBER_SNS s
        JOIN NU_MEMBER m ON s.MEMBERKEY = m.`KEY`
        WHERE s.SNSTYPE = #{snsType} 
        AND s.SNSCERTKEY = #{snsCertKey}
        AND s.`STATUS` = 'U'
    </select>
</mapper>
```

## 2. 암호화 유틸리티

### 2.1 EncryptionUtil

```java
package kr.co.nubiz.common.utils;

import java.security.MessageDigest;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {
    
    private static final String DES_KEY = "YourSecretKey"; // 실제로는 환경 변수나 설정 파일에서 가져와야 함
    
    /**
     * SHA-256 암호화 (비밀번호용)
     */
    public static String ENC_SHA256(String str) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(str.getBytes("UTF-8"));
            byte[] bytes = md.digest();
            StringBuilder sb = new StringBuilder();
            for(byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * DES 암호화 (개인정보용)
     */
    public static String ENC_DES(String str) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(DES_KEY.getBytes("UTF-8"), "DES");
            Cipher cipher = Cipher.getInstance("DES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(str.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * DES 복호화
     */
    public static String DEC_DES(String str) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(DES_KEY.getBytes("UTF-8"), "DES");
            Cipher cipher = Cipher.getInstance("DES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(str));
            return new String(decrypted, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

## 3. 세션 유틸리티

### 3.1 SessionUtil

```java
package kr.co.nubiz.common.utils;

import javax.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import kr.co.nubiz.admin.adm.site.service.SiteVO;
import kr.co.nubiz.admin.member.service.MemberVO;
import kr.co.nubiz.home.member.service.MemberHomeVO;
import kr.co.nubiz.home.site.layout.service.LayoutVO;
import kr.co.nubiz.home.site.menu.service.MenuHomeVO;
import java.util.List;

public class SessionUtil {
    
    /**
     * 현재 사이트 정보 가져오기
     */
    public static SiteVO getCurrentSite() {
        HttpServletRequest request = getRequest();
        return (SiteVO) request.getSession().getAttribute("currentSite");
    }
    
    /**
     * 현재 사이트 정보 설정
     */
    public static void setCurrentSite(SiteVO site) {
        HttpServletRequest request = getRequest();
        request.getSession().setAttribute("currentSite", site);
    }
    
    /**
     * 현재 홈 사이트 정보 가져오기
     */
    public static SiteVO getCurrentHomeSite() {
        HttpServletRequest request = getRequest();
        return (SiteVO) request.getSession().getAttribute("currentHomeSite");
    }
    
    /**
     * 현재 관리자 회원 정보 가져오기
     */
    public static MemberVO getCurrentMember() {
        HttpServletRequest request = getRequest();
        return (MemberVO) request.getSession().getAttribute("getDataLogin");
    }
    
    /**
     * 현재 홈 회원 정보 가져오기
     */
    public static MemberHomeVO getCurrentHomeMember() {
        HttpServletRequest request = getRequest();
        return (MemberHomeVO) request.getSession().getAttribute("getCurrentHomeMember");
    }
    
    /**
     * 현재 메뉴 정보 가져오기
     */
    public static MenuHomeVO getCurrentMenu() {
        HttpServletRequest request = getRequest();
        return (MenuHomeVO) request.getSession().getAttribute("currentMenu");
    }
    
    /**
     * 현재 메뉴 정보 설정
     */
    public static void setCurrentMenu(MenuHomeVO menu) {
        HttpServletRequest request = getRequest();
        request.getSession().setAttribute("currentMenu", menu);
    }
    
    /**
     * 현재 레이아웃 정보 가져오기
     */
    public static LayoutVO getCurrentHomeLayout() {
        HttpServletRequest request = getRequest();
        return (LayoutVO) request.getSession().getAttribute("currentHomeLayout");
    }
    
    /**
     * 현재 레이아웃 정보 설정
     */
    public static void setCurrentHomeLayout(LayoutVO layout) {
        HttpServletRequest request = getRequest();
        request.getSession().setAttribute("currentHomeLayout", layout);
    }
    
    /**
     * 검색 쿼리 설정
     */
    public static void setSearchQuery(String query) {
        HttpServletRequest request = getRequest();
        request.getSession().setAttribute("searchQuery", query);
    }
    
    /**
     * 검색 쿼리 가져오기
     */
    public static String getSearchQuery() {
        HttpServletRequest request = getRequest();
        String query = (String) request.getSession().getAttribute("searchQuery");
        return query != null ? query : "";
    }
    
    /**
     * 현재 메뉴 코드 설정
     */
    public static void setCurrentMenuCode(String menuCode) {
        HttpServletRequest request = getRequest();
        request.getSession().setAttribute("currentMenuCode", menuCode);
    }
    
    /**
     * 현재 메뉴 서브타이틀 설정
     */
    public static void setCurrentMenuSubTitle(String subTitle) {
        HttpServletRequest request = getRequest();
        request.getSession().setAttribute("currentMenuSubTitle", subTitle);
    }
    
    /**
     * HttpServletRequest 가져오기
     */
    private static HttpServletRequest getRequest() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return attr.getRequest();
    }
}
```

## 4. 다음 단계

이제 다음 문서를 참고하여 배포를 진행하세요:
- `08_Deployment_Guide.md` - 배포 가이드

