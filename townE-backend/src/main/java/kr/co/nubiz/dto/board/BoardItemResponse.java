package kr.co.nubiz.dto.board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardItemResponse {
    private Long key;
    private Long boardKey;
    private Long categoryKey;
    private String title;
    private String content;
    private String writer;
    private String notice; // Y=공지사항, N=일반
    private LocalDateTime openDate;
    private LocalDateTime closeDate;
    private String secret; // Y=비밀글, N=일반
    private Long parentKey;
    private Integer hit;
    private Integer commentCount;
    private Integer depth;
    private LocalDateTime insertDate;
    private Integer insertMemberKey;
}
