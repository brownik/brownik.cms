package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "NU_BOARD_COMMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`KEY`")
    private Long key;

    @Column(name = "BOARDITEMKEY", nullable = false)
    private Long boardItemKey;

    @Column(name = "PARENTKEY")
    private Long parentKey;

    @Column(name = "PARENTTOPKEY")
    private Long parentTopKey;

    @Column(name = "PARENTALLKEY", length = 250)
    private String parentAllKey;

    @Column(name = "COMMENT", nullable = false, length = 500)
    private String comment;

    @Column(name = "WRITER", nullable = false, length = 50)
    private String writer;

    @Column(name = "PASSWD", length = 100)
    private String passwd;

    @Column(name = "DEPTH", nullable = false)
    private Integer depth;

    @Column(name = "`STATUS`", nullable = false, length = 1)
    private String status; // U=사용, D=삭제

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

    @PrePersist
    protected void onCreate() {
        if (insertDate == null) {
            insertDate = LocalDateTime.now();
        }
        if (status == null) {
            status = "U";
        }
        if (depth == null) {
            depth = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = LocalDateTime.now();
    }
}
