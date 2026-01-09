package kr.co.nubiz.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.nubiz.dto.board.BoardItemCreateRequest;
import kr.co.nubiz.dto.board.BoardItemListResponse;
import kr.co.nubiz.dto.board.BoardItemResponse;
import kr.co.nubiz.dto.board.BoardItemUpdateRequest;
import kr.co.nubiz.entity.Board;
import kr.co.nubiz.entity.BoardItem;
import kr.co.nubiz.repository.BoardItemRepository;
import kr.co.nubiz.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardItemService {

    private final BoardItemRepository boardItemRepository;
    private final BoardRepository boardRepository;

    /**
     * 게시글 목록 조회
     * @param boardKey 게시판 키
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @param keyword 검색 키워드 (선택적)
     * @return 게시글 목록 및 페이지네이션 정보
     */
    @Transactional(readOnly = true)
    public BoardItemListResponse getBoardItemList(Long boardKey, int page, int size, String keyword) {
        log.info("게시글 목록 조회 요청: boardKey={}, page={}, size={}, keyword={}", boardKey, page, size, keyword);

        // 게시판 존재 여부 확인
        if (!boardRepository.existsById(boardKey)) {
            throw new RuntimeException("존재하지 않는 게시판입니다");
        }

        LocalDateTime now = LocalDateTime.now();
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardItem> itemPage;

        if (keyword != null && !keyword.trim().isEmpty()) {
            // 검색 기능 사용
            itemPage = boardItemRepository.searchByBoardKey(boardKey, keyword.trim(), now, pageable);
        } else {
            // 일반 목록 조회 (공지사항 우선, 삭제되지 않은 것만)
            itemPage = boardItemRepository.findByBoardKeyAndStatusActive(boardKey, now, pageable);
        }

        // Repository에서 이미 공지사항 우선 정렬되어 있음 (ORDER BY bi.notice DESC, bi.insertDate DESC)
        List<BoardItemResponse> allItems = itemPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return BoardItemListResponse.builder()
                .items(allItems)
                .totalElements(itemPage.getTotalElements())
                .totalPages(itemPage.getTotalPages())
                .currentPage(itemPage.getNumber())
                .pageSize(itemPage.getSize())
                .hasNext(itemPage.hasNext())
                .hasPrevious(itemPage.hasPrevious())
                .build();
    }

    /**
     * 게시글 상세 조회
     * @param boardKey 게시판 키
     * @param itemKey 게시글 키
     * @return 게시글 상세 정보
     */
    @Transactional
    public BoardItemResponse getBoardItemDetail(Long boardKey, Long itemKey) {
        log.info("게시글 상세 조회 요청: boardKey={}, itemKey={}", boardKey, itemKey);

        // 게시판 존재 여부 확인
        if (!boardRepository.existsById(boardKey)) {
            throw new RuntimeException("존재하지 않는 게시판입니다");
        }

        // 게시글 조회 (삭제되지 않은 것만)
        BoardItem item = boardItemRepository.findByKeyAndBoardKeyAndStatusActive(itemKey, boardKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다"));

        // 공개 기간 확인
        LocalDateTime now = LocalDateTime.now();
        if (item.getOpenDate() != null && item.getOpenDate().isAfter(now)) {
            throw new RuntimeException("아직 공개되지 않은 게시글입니다");
        }
        if (item.getCloseDate() != null && item.getCloseDate().isBefore(now)) {
            throw new RuntimeException("공개 기간이 만료된 게시글입니다");
        }

        // 조회수 증가
        item.setHit(item.getHit() + 1);
        boardItemRepository.save(item);

        return convertToResponse(item);
    }

    /**
     * 게시글 작성
     * @param boardKey 게시판 키
     * @param request 게시글 작성 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param memberKey 작성자 회원 키 (선택적, 인증 정보에서 가져옴)
     * @return 생성된 게시글 정보
     */
    @Transactional
    public BoardItemResponse createBoardItem(Long boardKey, BoardItemCreateRequest request, 
                                             HttpServletRequest httpRequest, Integer memberKey) {
        log.info("게시글 작성 요청: boardKey={}, title={}, writer={}", boardKey, request.getTitle(), request.getWriter());

        // 게시판 존재 여부 확인
        Board board = boardRepository.findByKeyAndStatusActive(boardKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시판입니다"));

        // 답글인 경우 부모 게시글 확인 및 depth 설정
        Integer depth = 0;
        Long parentTopKey = null;
        String parentAllKey = null;
        
        if (request.getParentKey() != null) {
            BoardItem parentItem = boardItemRepository.findById(request.getParentKey())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 부모 게시글입니다"));
            
            if (!parentItem.getBoardKey().equals(boardKey)) {
                throw new RuntimeException("부모 게시글이 해당 게시판에 속하지 않습니다");
            }
            
            depth = parentItem.getDepth() + 1;
            parentTopKey = parentItem.getParentTopKey() != null ? parentItem.getParentTopKey() : parentItem.getKey();
            parentAllKey = parentItem.getParentAllKey() != null 
                    ? parentItem.getParentAllKey() + "," + parentItem.getKey()
                    : String.valueOf(parentItem.getKey());
        }

        // IP 주소 추출
        String clientIp = getClientIpAddress(httpRequest);

        // BoardItem 엔티티 생성
        BoardItem item = BoardItem.builder()
                .boardKey(boardKey)
                .categoryKey(request.getCategoryKey())
                .title(request.getTitle())
                .content(request.getContent())
                .writer(request.getWriter())
                .notice(request.getNotice() != null ? request.getNotice() : "N")
                .secret(request.getSecret() != null ? request.getSecret() : "N")
                .passwd(request.getPasswd())
                .openDate(request.getOpenDate())
                .closeDate(request.getCloseDate())
                .parentKey(request.getParentKey())
                .parentTopKey(parentTopKey)
                .parentAllKey(parentAllKey)
                .depth(depth)
                .insertIp(clientIp)
                .insertMemberKey(memberKey)
                .build();

        BoardItem savedItem = boardItemRepository.save(item);

        // 부모 게시글의 댓글 수 증가는 Comment 작성 시 처리하므로 여기서는 생략

        return convertToResponse(savedItem);
    }

    /**
     * 게시글 수정
     * @param boardKey 게시판 키
     * @param itemKey 게시글 키
     * @param request 게시글 수정 요청 DTO
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param memberKey 수정자 회원 키 (선택적, 인증 정보에서 가져옴)
     * @return 수정된 게시글 정보
     */
    @Transactional
    public BoardItemResponse updateBoardItem(Long boardKey, Long itemKey, BoardItemUpdateRequest request,
                                             HttpServletRequest httpRequest, Integer memberKey) {
        log.info("게시글 수정 요청: boardKey={}, itemKey={}", boardKey, itemKey);

        // 게시판 존재 여부 확인
        if (!boardRepository.existsById(boardKey)) {
            throw new RuntimeException("존재하지 않는 게시판입니다");
        }

        // 게시글 조회 (삭제되지 않은 것만)
        BoardItem item = boardItemRepository.findByKeyAndBoardKeyAndStatusActive(itemKey, boardKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다"));

        // 권한 확인 (작성자 또는 관리자만 수정 가능)
        // TODO: 인증 정보에서 memberKey를 추출하여 권한 체크 구현 필요
        // if (memberKey != null && !item.getInsertMemberKey().equals(memberKey)) {
        //     throw new RuntimeException("게시글 수정 권한이 없습니다");
        // }

        // 수정 가능한 필드 업데이트
        if (request.getTitle() != null) {
            item.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            item.setContent(request.getContent());
        }
        if (request.getWriter() != null) {
            item.setWriter(request.getWriter());
        }
        if (request.getCategoryKey() != null) {
            item.setCategoryKey(request.getCategoryKey());
        }
        if (request.getNotice() != null) {
            item.setNotice(request.getNotice());
        }
        if (request.getSecret() != null) {
            item.setSecret(request.getSecret());
        }
        if (request.getPasswd() != null) {
            item.setPasswd(request.getPasswd());
        }
        if (request.getOpenDate() != null) {
            item.setOpenDate(request.getOpenDate());
        }
        if (request.getCloseDate() != null) {
            item.setCloseDate(request.getCloseDate());
        }

        // IP 주소 및 수정자 정보 업데이트
        String clientIp = getClientIpAddress(httpRequest);
        item.setUpdateIp(clientIp);
        if (memberKey != null) {
            item.setUpdateMemberKey(memberKey);
        }

        BoardItem updatedItem = boardItemRepository.save(item);

        return convertToResponse(updatedItem);
    }

    /**
     * 게시글 삭제 (논리 삭제)
     * @param boardKey 게시판 키
     * @param itemKey 게시글 키
     * @param httpRequest HTTP 요청 (IP 주소 추출용)
     * @param memberKey 삭제자 회원 키 (선택적, 인증 정보에서 가져옴)
     */
    @Transactional
    public void deleteBoardItem(Long boardKey, Long itemKey, HttpServletRequest httpRequest, Integer memberKey) {
        log.info("게시글 삭제 요청: boardKey={}, itemKey={}", boardKey, itemKey);

        // 게시판 존재 여부 확인
        if (!boardRepository.existsById(boardKey)) {
            throw new RuntimeException("존재하지 않는 게시판입니다");
        }

        // 게시글 조회 (삭제되지 않은 것만)
        BoardItem item = boardItemRepository.findByKeyAndBoardKeyAndStatusActive(itemKey, boardKey)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다"));

        // 권한 확인 (작성자 또는 관리자만 삭제 가능)
        // TODO: 인증 정보에서 memberKey를 추출하여 권한 체크 구현 필요
        // if (memberKey != null && !item.getInsertMemberKey().equals(memberKey)) {
        //     throw new RuntimeException("게시글 삭제 권한이 없습니다");
        // }

        // 논리 삭제 (STATUS를 'D'로 변경)
        item.setStatus("D");

        // IP 주소 및 삭제자 정보 업데이트
        String clientIp = getClientIpAddress(httpRequest);
        item.setUpdateIp(clientIp);
        if (memberKey != null) {
            item.setUpdateMemberKey(memberKey);
        }

        boardItemRepository.save(item);
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
     * BoardItem 엔티티를 BoardItemResponse DTO로 변환
     */
    private BoardItemResponse convertToResponse(BoardItem item) {
        return BoardItemResponse.builder()
                .key(item.getKey())
                .boardKey(item.getBoardKey())
                .categoryKey(item.getCategoryKey())
                .title(item.getTitle())
                .content(item.getContent())
                .writer(item.getWriter())
                .notice(item.getNotice())
                .openDate(item.getOpenDate())
                .closeDate(item.getCloseDate())
                .secret(item.getSecret())
                .parentKey(item.getParentKey())
                .hit(item.getHit())
                .commentCount(item.getCommentCount())
                .depth(item.getDepth())
                .insertDate(item.getInsertDate())
                .insertMemberKey(item.getInsertMemberKey())
                .build();
    }
}
