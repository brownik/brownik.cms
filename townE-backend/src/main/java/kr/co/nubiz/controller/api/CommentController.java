package kr.co.nubiz.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import kr.co.nubiz.common.dto.ApiResponse;
import kr.co.nubiz.dto.comment.CommentCreateRequest;
import kr.co.nubiz.dto.comment.CommentListResponse;
import kr.co.nubiz.dto.comment.CommentResponse;
import kr.co.nubiz.dto.comment.CommentUpdateRequest;
import kr.co.nubiz.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/boards/{boardKey}/items/{boardItemKey}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 목록 조회
     * GET /api/v1/boards/{boardKey}/items/{boardItemKey}/comments
     * 
     * @param boardKey 게시판 키
     * @param boardItemKey 게시글 키
     * @return 댓글 목록 (계층 구조 순서로 정렬됨)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CommentListResponse>> getCommentList(
            @PathVariable Long boardKey,
            @PathVariable Long boardItemKey) {
        
        log.info("댓글 목록 조회 API 호출: boardKey={}, boardItemKey={}", boardKey, boardItemKey);
        
        CommentListResponse response = commentService.getCommentList(boardKey, boardItemKey);
        
        return ResponseEntity.ok(ApiResponse.success("댓글 목록 조회 성공", response));
    }

    /**
     * 댓글 작성
     * POST /api/v1/boards/{boardKey}/items/{boardItemKey}/comments
     * 
     * @param boardKey 게시판 키
     * @param boardItemKey 게시글 키
     * @param request 댓글 작성 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param authentication 인증 정보 (선택적)
     * @return 생성된 댓글 정보
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long boardKey,
            @PathVariable Long boardItemKey,
            @Valid @RequestBody CommentCreateRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        log.info("댓글 작성 API 호출: boardKey={}, boardItemKey={}", boardKey, boardItemKey);
        
        // 인증 정보에서 회원 키 추출 (선택적)
        Integer memberKey = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // JWT에서 memberKey를 추출하는 로직은 JwtUtil에서 처리하므로
            // 여기서는 일단 null로 처리 (나중에 JWT에서 memberKey 추출하도록 개선 필요)
        }
        
        CommentResponse response = commentService.createComment(boardKey, boardItemKey, request, httpRequest, memberKey);
        
        return ResponseEntity.ok(ApiResponse.success("댓글이 작성되었습니다", response));
    }

    /**
     * 댓글 수정
     * PUT /api/v1/boards/{boardKey}/items/{boardItemKey}/comments/{commentKey}
     * 
     * @param boardKey 게시판 키
     * @param boardItemKey 게시글 키
     * @param commentKey 댓글 키
     * @param request 댓글 수정 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param authentication 인증 정보 (선택적)
     * @return 수정된 댓글 정보
     */
    @PutMapping("/{commentKey}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable Long boardKey,
            @PathVariable Long boardItemKey,
            @PathVariable Long commentKey,
            @Valid @RequestBody CommentUpdateRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        log.info("댓글 수정 API 호출: boardKey={}, boardItemKey={}, commentKey={}", boardKey, boardItemKey, commentKey);
        
        // 인증 정보에서 회원 키 추출 (선택적)
        Integer memberKey = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // JWT에서 memberKey를 추출하는 로직은 JwtUtil에서 처리하므로
            // 여기서는 일단 null로 처리 (나중에 JWT에서 memberKey 추출하도록 개선 필요)
        }
        
        CommentResponse response = commentService.updateComment(commentKey, request, httpRequest, memberKey);
        
        return ResponseEntity.ok(ApiResponse.success("댓글이 수정되었습니다", response));
    }

    /**
     * 댓글 삭제
     * DELETE /api/v1/boards/{boardKey}/items/{boardItemKey}/comments/{commentKey}
     * 
     * @param boardKey 게시판 키
     * @param boardItemKey 게시글 키
     * @param commentKey 댓글 키
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param authentication 인증 정보 (선택적)
     * @return 삭제 성공 응답
     */
    @DeleteMapping("/{commentKey}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long boardKey,
            @PathVariable Long boardItemKey,
            @PathVariable Long commentKey,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        log.info("댓글 삭제 API 호출: boardKey={}, boardItemKey={}, commentKey={}", boardKey, boardItemKey, commentKey);
        
        // 인증 정보에서 회원 키 추출 (선택적)
        Integer memberKey = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // JWT에서 memberKey를 추출하는 로직은 JwtUtil에서 처리하므로
            // 여기서는 일단 null로 처리 (나중에 JWT에서 memberKey 추출하도록 개선 필요)
        }
        
        commentService.deleteComment(commentKey, httpRequest, memberKey);
        
        return ResponseEntity.ok(ApiResponse.success("댓글이 삭제되었습니다", null));
    }
}
