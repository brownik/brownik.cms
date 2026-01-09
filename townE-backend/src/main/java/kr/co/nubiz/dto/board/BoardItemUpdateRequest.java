package kr.co.nubiz.dto.board;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardItemUpdateRequest {

    @Size(max = 50, message = "제목은 50자 이하여야 합니다")
    private String title;

    private String content;

    @Size(max = 50, message = "작성자는 50자 이하여야 합니다")
    private String writer;

    private Long categoryKey;

    @Pattern(regexp = "^[YN]?$", message = "공지사항 여부는 Y 또는 N만 가능합니다")
    private String notice; // Y=공지사항, N=일반

    @Pattern(regexp = "^[YN]?$", message = "비밀글 여부는 Y 또는 N만 가능합니다")
    private String secret; // Y=비밀글, N=일반

    @Size(max = 30, message = "비밀번호는 30자 이하여야 합니다")
    private String passwd; // 비밀글 비밀번호

    private LocalDateTime openDate; // 예약 게시 시작일

    private LocalDateTime closeDate; // 예약 게시 종료일
}
