package kr.co.nubiz.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentCreateRequest {

    @NotBlank(message = "댓글 내용은 필수입니다")
    @Size(max = 500, message = "댓글 내용은 500자 이하여야 합니다")
    private String comment;

    @NotBlank(message = "작성자는 필수입니다")
    @Size(max = 50, message = "작성자는 50자 이하여야 합니다")
    private String writer;

    @Size(max = 100, message = "비밀번호는 100자 이하여야 합니다")
    private String passwd; // 비밀 댓글 비밀번호

    private Long parentKey; // 대댓글인 경우 부모 댓글 키
}
