package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "NU_BOARD_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`KEY`")
    private Long key;

    @Column(name = "BOARDKEY", nullable = false)
    private Long boardKey;

    @Column(name = "CATEGORYKEY")
    private Long categoryKey;

    @Column(name = "TITLE", nullable = false, length = 50)
    private String title;

    @Column(name = "CONTENT", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "WRITER", nullable = false, length = 50)
    private String writer;

    @Column(name = "NOTICE", nullable = false, length = 1)
    private String notice; // Y=공지사항, N=일반

    @Column(name = "OPENDATE")
    private LocalDateTime openDate;

    @Column(name = "CLOSEDATE")
    private LocalDateTime closeDate;

    @Column(name = "PASSWD", length = 30)
    private String passwd;

    @Column(name = "SECRET", nullable = false, length = 1)
    private String secret; // Y=비밀글, N=일반

    @Column(name = "PARENTKEY")
    private Long parentKey;

    @Column(name = "PARENTTOPKEY")
    private Long parentTopKey;

    @Column(name = "PARENTALLKEY", length = 250)
    private String parentAllKey;

    @Column(name = "HIT", nullable = false)
    private Integer hit;

    @Column(name = "COMMENTCOUNT", nullable = false)
    private Integer commentCount;

    @Column(name = "DEPTH", nullable = false)
    private Integer depth;

    @Column(name = "`STATUS`", nullable = false, length = 1)
    private String status; // U=승인, N=미승인, D=삭제

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
        if (notice == null) {
            notice = "N";
        }
        if (secret == null) {
            secret = "N";
        }
        if (hit == null) {
            hit = 0;
        }
        if (commentCount == null) {
            commentCount = 0;
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
