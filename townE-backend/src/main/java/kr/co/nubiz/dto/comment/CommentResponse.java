package kr.co.nubiz.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long key;
    private Long boardItemKey;
    private Long parentKey;
    private Long parentTopKey;
    private String parentAllKey;
    private String comment;
    private String writer;
    private Integer depth;
    private LocalDateTime insertDate;
    private Integer insertMemberKey;
}
