package kr.co.nubiz.repository;

import kr.co.nubiz.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 게시글별 댓글 목록 조회 (계층 구조)
    @Query("SELECT c FROM Comment c WHERE c.boardItemKey = :boardItemKey AND c.status = 'U' " +
           "ORDER BY c.parentTopKey ASC NULLS FIRST, c.parentAllKey ASC, c.insertDate ASC")
    List<Comment> findByBoardItemKeyAndStatusActive(@Param("boardItemKey") Long boardItemKey);

    // 게시글별 댓글 개수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.boardItemKey = :boardItemKey AND c.status = 'U'")
    Long countByBoardItemKey(@Param("boardItemKey") Long boardItemKey);

    // 작성자별 댓글 조회
    @Query("SELECT c FROM Comment c WHERE c.insertMemberKey = :memberKey AND c.status = 'U'")
    List<Comment> findByInsertMemberKey(@Param("memberKey") Integer memberKey);

    // 댓글 상세 조회
    @Query("SELECT c FROM Comment c WHERE c.key = :key AND c.status = 'U'")
    Optional<Comment> findByKeyAndStatusActive(@Param("key") Long key);

    // 대댓글 존재 여부 확인 (삭제되지 않은 것만)
    @Query("SELECT COUNT(c) > 0 FROM Comment c WHERE c.parentKey = :parentKey AND c.status = 'U'")
    boolean existsByParentKeyAndStatusActive(@Param("parentKey") Long parentKey);
}
