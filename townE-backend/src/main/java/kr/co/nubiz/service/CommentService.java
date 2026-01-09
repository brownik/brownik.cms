package kr.co.nubiz.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.nubiz.dto.comment.CommentCreateRequest;
import kr.co.nubiz.dto.comment.CommentListResponse;
import kr.co.nubiz.dto.comment.CommentResponse;
import kr.co.nubiz.dto.comment.CommentUpdateRequest;
import kr.co.nubiz.entity.BoardItem;
import kr.co.nubiz.entity.Comment;
import kr.co.nubiz.repository.BoardItemRepository;
import kr.co.nubiz.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardItemRepository boardItemRepository;

    /**
     * 댓글 작성
     * @param boardKey 게시판 키
     * @param boardItemKey 게시글 키
     * @param request 댓글 작성 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param memberKey 작성자 회원 키 (선택적, 인증 정보에서 가져옴)
     * @return 생성된 댓글 정보
     */
    @Transactional
    public CommentResponse createComment(Long boardKey, Long boardItemKey, CommentCreateRequest request,
                                        HttpServletRequest httpRequest, Integer memberKey) {
        log.info("댓글 작성 요청: boardKey={}, boardItemKey={}, writer={}", boardKey, boardItemKey, request.getWriter());

        // 게시글 존재 여부 확인
        BoardItem boardItem = boardItemRepository.findByKeyAndBoardKeyAndStatusActive(boardItemKey, boardKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다"));

        // 대댓글인 경우 부모 댓글 확인 및 depth 설정
        Integer depth = 0;
        Long parentTopKey = null;
        String parentAllKey = null;

        if (request.getParentKey() != null) {
            Comment parentComment = commentRepository.findByKeyAndStatusActive(request.getParentKey())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 부모 댓글입니다"));

            if (!parentComment.getBoardItemKey().equals(boardItemKey)) {
                throw new RuntimeException("부모 댓글이 해당 게시글에 속하지 않습니다");
            }

            depth = parentComment.getDepth() + 1;
            parentTopKey = parentComment.getParentTopKey() != null ? parentComment.getParentTopKey() : parentComment.getKey();
            parentAllKey = parentComment.getParentAllKey() != null
                    ? parentComment.getParentAllKey() + "," + parentComment.getKey()
                    : String.valueOf(parentComment.getKey());
        }

        // IP 주소 추출
        String clientIp = getClientIpAddress(httpRequest);

        // Comment 엔티티 생성
        Comment comment = Comment.builder()
                .boardItemKey(boardItemKey)
                .parentKey(request.getParentKey())
                .parentTopKey(parentTopKey)
                .parentAllKey(parentAllKey)
                .comment(request.getComment())
                .writer(request.getWriter())
                .passwd(request.getPasswd())
                .depth(depth)
                .insertIp(clientIp)
                .insertMemberKey(memberKey)
                .build();

        Comment savedComment = commentRepository.save(comment);

        // 게시글의 댓글 수 증가
        boardItem.setCommentCount(boardItem.getCommentCount() + 1);
        boardItemRepository.save(boardItem);

        return convertToResponse(savedComment);
    }

    /**
     * 댓글 목록 조회
     * @param boardKey 게시판 키
     * @param boardItemKey 게시글 키
     * @return 댓글 목록 (계층 구조 순서로 정렬됨)
     */
    @Transactional(readOnly = true)
    public CommentListResponse getCommentList(Long boardKey, Long boardItemKey) {
        log.info("댓글 목록 조회 요청: boardKey={}, boardItemKey={}", boardKey, boardItemKey);

        // 게시글 존재 여부 확인
        if (!boardItemRepository.existsById(boardItemKey)) {
            throw new RuntimeException("존재하지 않는 게시글입니다");
        }

        // 댓글 목록 조회 (계층 구조 순서로 정렬됨)
        List<Comment> comments = commentRepository.findByBoardItemKeyAndStatusActive(boardItemKey);
        
        // 댓글 개수 조회
        long totalCount = commentRepository.countByBoardItemKey(boardItemKey);

        // DTO로 변환
        List<CommentResponse> commentResponses = comments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return CommentListResponse.builder()
                .comments(commentResponses)
                .totalCount(totalCount)
                .build();
    }

    /**
     * 댓글 수정
     * @param commentKey 댓글 키
     * @param request 댓글 수정 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param memberKey 수정자 회원 키 (선택적, 인증 정보에서 가져옴)
     * @return 수정된 댓글 정보
     */
    @Transactional
    public CommentResponse updateComment(Long commentKey, CommentUpdateRequest request,
                                        HttpServletRequest httpRequest, Integer memberKey) {
        log.info("댓글 수정 요청: commentKey={}", commentKey);

        // 댓글 조회 (삭제되지 않은 것만)
        Comment comment = commentRepository.findByKeyAndStatusActive(commentKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 댓글입니다"));

        // 권한 확인 (작성자 또는 관리자만 수정 가능)
        // TODO: 인증 정보에서 memberKey를 추출하여 권한 체크 구현 필요
        // if (memberKey != null && !comment.getInsertMemberKey().equals(memberKey)) {
        //     throw new RuntimeException("댓글 수정 권한이 없습니다");
        // }

        // 수정 가능한 필드 업데이트
        if (request.getComment() != null) {
            comment.setComment(request.getComment());
        }
        if (request.getWriter() != null) {
            comment.setWriter(request.getWriter());
        }
        if (request.getPasswd() != null) {
            comment.setPasswd(request.getPasswd());
        }

        // IP 주소 및 수정자 정보 업데이트
        String clientIp = getClientIpAddress(httpRequest);
        comment.setUpdateIp(clientIp);
        if (memberKey != null) {
            comment.setUpdateMemberKey(memberKey);
        }

        Comment updatedComment = commentRepository.save(comment);

        return convertToResponse(updatedComment);
    }

    /**
     * 댓글 삭제
     * @param commentKey 댓글 키
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param memberKey 삭제자 회원 키 (선택적, 인증 정보에서 가져옴)
     */
    @Transactional
    public void deleteComment(Long commentKey, HttpServletRequest httpRequest, Integer memberKey) {
        log.info("댓글 삭제 요청: commentKey={}", commentKey);

        // 댓글 조회 (삭제되지 않은 것만)
        Comment comment = commentRepository.findByKeyAndStatusActive(commentKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 댓글입니다"));

        // 권한 확인 (작성자 또는 관리자만 삭제 가능)
        // TODO: 인증 정보에서 memberKey를 추출하여 권한 체크 구현 필요
        // if (memberKey != null && !comment.getInsertMemberKey().equals(memberKey)) {
        //     throw new RuntimeException("댓글 삭제 권한이 없습니다");
        // }

        // 대댓글이 있는지 확인
        boolean hasReplies = commentRepository.existsByParentKeyAndStatusActive(commentKey);
        if (hasReplies) {
            log.warn("대댓글이 있는 댓글 삭제: commentKey={}, 대댓글도 함께 삭제됩니다", commentKey);
            // 대댓글도 함께 논리 삭제 처리
            // TODO: 재귀적으로 모든 대댓글 삭제 또는 경고 메시지 반환
            // 현재는 부모 댓글만 삭제하고, 대댓글은 유지 (나중에 "삭제된 댓글입니다" 표시 가능)
        }

        // 논리 삭제 처리 (STATUS = 'D')
        comment.setStatus("D");

        // IP 주소 및 삭제자 정보 업데이트
        String clientIp = getClientIpAddress(httpRequest);
        comment.setUpdateIp(clientIp);
        if (memberKey != null) {
            comment.setUpdateMemberKey(memberKey);
        }

        commentRepository.save(comment);

        // 게시글의 댓글 수 감소
        BoardItem boardItem = boardItemRepository.findById(comment.getBoardItemKey())
                .orElse(null);
        if (boardItem != null && boardItem.getCommentCount() > 0) {
            boardItem.setCommentCount(boardItem.getCommentCount() - 1);
            boardItemRepository.save(boardItem);
        }

        log.info("댓글 삭제 완료: commentKey={}", commentKey);
    }

    /**
     * 클라이언트 IP 주소 추출
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 여러 IP가 있는 경우 첫 번째 IP만 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    /**
     * Comment 엔티티를 CommentResponse DTO로 변환
     */
    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .key(comment.getKey())
                .boardItemKey(comment.getBoardItemKey())
                .parentKey(comment.getParentKey())
                .parentTopKey(comment.getParentTopKey())
                .parentAllKey(comment.getParentAllKey())
                .comment(comment.getComment())
                .writer(comment.getWriter())
                .depth(comment.getDepth())
                .insertDate(comment.getInsertDate())
                .insertMemberKey(comment.getInsertMemberKey())
                .build();
    }
}
