package kr.co.nubiz.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private String userId;
    private String name;
    private String nickName;
    private String memberType;
    private String email;
    private String phone;
    private String memberLevel;
    private String status;
}

