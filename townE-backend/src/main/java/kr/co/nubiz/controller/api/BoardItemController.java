package kr.co.nubiz.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import kr.co.nubiz.common.dto.ApiResponse;
import kr.co.nubiz.dto.board.BoardItemCreateRequest;
import kr.co.nubiz.dto.board.BoardItemListResponse;
import kr.co.nubiz.dto.board.BoardItemResponse;
import kr.co.nubiz.dto.board.BoardItemUpdateRequest;
import kr.co.nubiz.service.BoardItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/boards/{boardKey}/items")
@RequiredArgsConstructor
public class BoardItemController {

    private final BoardItemService boardItemService;

    /**
     * 게시글 목록 조회
     * GET /api/v1/boards/{boardKey}/items
     * 
     * @param boardKey 게시판 키
     * @param page 페이지 번호 (기본값: 0)
     * @param size 페이지 크기 (기본값: 10)
     * @param keyword 검색 키워드 (선택적)
     * @return 게시글 목록 및 페이지네이션 정보
     */
    @GetMapping
    public ResponseEntity<ApiResponse<BoardItemListResponse>> getBoardItemList(
            @PathVariable Long boardKey,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        
        log.info("게시글 목록 조회 API 호출: boardKey={}, page={}, size={}, keyword={}", 
                boardKey, page, size, keyword);
        
        BoardItemListResponse response = boardItemService.getBoardItemList(boardKey, page, size, keyword);
        
        return ResponseEntity.ok(ApiResponse.success("게시글 목록 조회 성공", response));
    }

    /**
     * 게시글 상세 조회
     * GET /api/v1/boards/{boardKey}/items/{itemKey}
     * 
     * @param boardKey 게시판 키
     * @param itemKey 게시글 키
     * @return 게시글 상세 정보
     */
    @GetMapping("/{itemKey}")
    public ResponseEntity<ApiResponse<BoardItemResponse>> getBoardItemDetail(
            @PathVariable Long boardKey,
            @PathVariable Long itemKey) {
        
        log.info("게시글 상세 조회 API 호출: boardKey={}, itemKey={}", boardKey, itemKey);
        
        BoardItemResponse response = boardItemService.getBoardItemDetail(boardKey, itemKey);
        
        return ResponseEntity.ok(ApiResponse.success("게시글 상세 조회 성공", response));
    }

    /**
     * 게시글 작성
     * POST /api/v1/boards/{boardKey}/items
     * 
     * @param boardKey 게시판 키
     * @param request 게시글 작성 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param authentication 인증 정보 (선택적)
     * @return 생성된 게시글 정보
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BoardItemResponse>> createBoardItem(
            @PathVariable Long boardKey,
            @Valid @RequestBody BoardItemCreateRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        log.info("게시글 작성 API 호출: boardKey={}, title={}", boardKey, request.getTitle());
        
        // 인증 정보에서 회원 키 추출 (선택적)
        Integer memberKey = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // JWT에서 memberKey를 추출하는 로직은 JwtUtil에서 처리하므로
            // 여기서는 일단 null로 처리 (나중에 JWT에서 memberKey 추출하도록 개선 필요)
        }
        
        BoardItemResponse response = boardItemService.createBoardItem(boardKey, request, httpRequest, memberKey);
        
        return ResponseEntity.ok(ApiResponse.success("게시글이 작성되었습니다", response));
    }

    /**
     * 게시글 수정
     * PUT /api/v1/boards/{boardKey}/items/{itemKey}
     * 
     * @param boardKey 게시판 키
     * @param itemKey 게시글 키
     * @param request 게시글 수정 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param authentication 인증 정보 (선택적)
     * @return 수정된 게시글 정보
     */
    @PutMapping("/{itemKey}")
    public ResponseEntity<ApiResponse<BoardItemResponse>> updateBoardItem(
            @PathVariable Long boardKey,
            @PathVariable Long itemKey,
            @Valid @RequestBody BoardItemUpdateRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        log.info("게시글 수정 API 호출: boardKey={}, itemKey={}", boardKey, itemKey);
        
        // 인증 정보에서 회원 키 추출 (선택적)
        Integer memberKey = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // JWT에서 memberKey를 추출하는 로직은 JwtUtil에서 처리하므로
            // 여기서는 일단 null로 처리 (나중에 JWT에서 memberKey 추출하도록 개선 필요)
        }
        
        BoardItemResponse response = boardItemService.updateBoardItem(boardKey, itemKey, request, httpRequest, memberKey);
        
        return ResponseEntity.ok(ApiResponse.success("게시글이 수정되었습니다", response));
    }

    /**
     * 게시글 삭제 (논리 삭제)
     * DELETE /api/v1/boards/{boardKey}/items/{itemKey}
     * 
     * @param boardKey 게시판 키
     * @param itemKey 게시글 키
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param authentication 인증 정보 (선택적)
     * @return 성공 메시지
     */
    @DeleteMapping("/{itemKey}")
    public ResponseEntity<ApiResponse<Void>> deleteBoardItem(
            @PathVariable Long boardKey,
            @PathVariable Long itemKey,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        log.info("게시글 삭제 API 호출: boardKey={}, itemKey={}", boardKey, itemKey);
        
        // 인증 정보에서 회원 키 추출 (선택적)
        Integer memberKey = null;
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // JWT에서 memberKey를 추출하는 로직은 JwtUtil에서 처리하므로
            // 여기서는 일단 null로 처리 (나중에 JWT에서 memberKey 추출하도록 개선 필요)
        }
        
        boardItemService.deleteBoardItem(boardKey, itemKey, httpRequest, memberKey);
        
        return ResponseEntity.ok(ApiResponse.success("게시글이 삭제되었습니다", null));
    }
}
