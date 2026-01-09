package kr.co.nubiz.repository;

import kr.co.nubiz.entity.BoardItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BoardItemRepository extends JpaRepository<BoardItem, Long> {

    // 게시판별 게시글 목록 조회 (공지사항 우선, 삭제되지 않은 것만)
    @Query("SELECT bi FROM BoardItem bi WHERE bi.boardKey = :boardKey AND bi.status = 'U' " +
           "AND (bi.openDate IS NULL OR bi.openDate <= :now) " +
           "AND (bi.closeDate IS NULL OR bi.closeDate >= :now) " +
           "ORDER BY bi.notice DESC, bi.insertDate DESC")
    Page<BoardItem> findByBoardKeyAndStatusActive(
            @Param("boardKey") Long boardKey,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    // 게시판별 공지사항 조회
    @Query("SELECT bi FROM BoardItem bi WHERE bi.boardKey = :boardKey AND bi.notice = 'Y' AND bi.status = 'U' " +
           "AND (bi.openDate IS NULL OR bi.openDate <= :now) " +
           "AND (bi.closeDate IS NULL OR bi.closeDate >= :now) " +
           "ORDER BY bi.insertDate DESC")
    List<BoardItem> findNoticesByBoardKey(
            @Param("boardKey") Long boardKey,
            @Param("now") LocalDateTime now
    );

    // 게시판별 일반 게시글 조회 (공지사항 제외)
    @Query("SELECT bi FROM BoardItem bi WHERE bi.boardKey = :boardKey AND bi.notice = 'N' AND bi.status = 'U' " +
           "AND (bi.openDate IS NULL OR bi.openDate <= :now) " +
           "AND (bi.closeDate IS NULL OR bi.closeDate >= :now) " +
           "ORDER BY bi.insertDate DESC")
    Page<BoardItem> findNormalItemsByBoardKey(
            @Param("boardKey") Long boardKey,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    // 검색 기능 (제목, 내용, 작성자)
    @Query("SELECT bi FROM BoardItem bi WHERE bi.boardKey = :boardKey AND bi.status = 'U' " +
           "AND (bi.openDate IS NULL OR bi.openDate <= :now) " +
           "AND (bi.closeDate IS NULL OR bi.closeDate >= :now) " +
           "AND (bi.title LIKE %:keyword% OR bi.content LIKE %:keyword% OR bi.writer LIKE %:keyword%) " +
           "ORDER BY bi.notice DESC, bi.insertDate DESC")
    Page<BoardItem> searchByBoardKey(
            @Param("boardKey") Long boardKey,
            @Param("keyword") String keyword,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );

    // 게시글 상세 조회 (삭제되지 않은 것만)
    @Query("SELECT bi FROM BoardItem bi WHERE bi.key = :key AND bi.boardKey = :boardKey AND bi.status = 'U'")
    Optional<BoardItem> findByKeyAndBoardKeyAndStatusActive(
            @Param("key") Long key,
            @Param("boardKey") Long boardKey
    );

    // 작성자별 게시글 조회
    @Query("SELECT bi FROM BoardItem bi WHERE bi.insertMemberKey = :memberKey AND bi.status = 'U'")
    List<BoardItem> findByInsertMemberKey(@Param("memberKey") Integer memberKey);
}
