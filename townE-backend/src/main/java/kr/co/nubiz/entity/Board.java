package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "NU_BOARD")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`KEY`")
    private Long key;

    @Column(name = "SITEKEY", nullable = false)
    private Long siteKey;

    @Column(name = "TITLE", nullable = false, length = 50)
    private String title;

    @Column(name = "BOARDTYPE", nullable = false, length = 50)
    private String boardType;

    @Column(name = "SKINKEY", nullable = false)
    private Long skinKey;

    @Column(name = "LISTACCESSROLE", nullable = false, length = 50)
    private String listAccessRole;

    @Column(name = "READACCESSROLE", nullable = false, length = 50)
    private String readAccessRole;

    @Column(name = "CUDACCESSROLE", nullable = false, length = 50)
    private String cudAccessRole;

    @Column(name = "COMMENTACCESSROLE", nullable = false, length = 50)
    private String commentAccessRole;

    @Column(name = "REPLYACCESSROLE", nullable = false, length = 50)
    private String replyAccessRole;

    @Column(name = "COMMENTUSEYN", nullable = false, length = 1)
    private String commentUseYn; // Y=사용, N=미사용

    @Column(name = "REPLYUSEYN", nullable = false, length = 1)
    private String replyUseYn; // Y=사용, N=미사용

    @Column(name = "SECRETUSEYN", nullable = false, length = 1)
    private String secretUseYn; // Y=사용, N=미사용

    @Column(name = "OKEYUSEYN", nullable = false, length = 1)
    private String okeyUseYn; // Y=사용, N=미사용 (관리자 승인 여부)

    @Column(name = "RESERVATIONYN", nullable = false, length = 1)
    private String reservationYn; // Y=사용, N=미사용

    @Column(name = "UPLOADUSEYN", nullable = false, length = 1)
    private String uploadUseYn; // Y=사용, N=미사용

    @Column(name = "UPLOADCOUNT", nullable = false)
    private Integer uploadCount;

    @Column(name = "UPLOADSIZE", nullable = false)
    private Integer uploadSize;

    @Column(name = "UPLOADFILEEXTENSION", length = 100)
    private String uploadFileExtension;

    @Column(name = "HEADER", columnDefinition = "TEXT")
    private String header;

    @Column(name = "FOOTER", columnDefinition = "TEXT")
    private String footer;

    @Column(name = "WRITE", columnDefinition = "TEXT")
    private String write;

    @Column(name = "MODIFY", columnDefinition = "TEXT")
    private String modify;

    @Column(name = "`STATUS`", nullable = false, length = 1)
    private String status; // U=사용, N=미사용, D=삭제

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
        if (commentUseYn == null) {
            commentUseYn = "Y";
        }
        if (replyUseYn == null) {
            replyUseYn = "Y";
        }
        if (secretUseYn == null) {
            secretUseYn = "N";
        }
        if (okeyUseYn == null) {
            okeyUseYn = "N";
        }
        if (reservationYn == null) {
            reservationYn = "N";
        }
        if (uploadUseYn == null) {
            uploadUseYn = "N";
        }
        if (uploadCount == null) {
            uploadCount = 1;
        }
        if (uploadSize == null) {
            uploadSize = 10000000; // 10MB
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = LocalDateTime.now();
    }
}
