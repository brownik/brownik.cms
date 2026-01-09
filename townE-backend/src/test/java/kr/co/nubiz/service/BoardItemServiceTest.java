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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("게시글 Service 테스트")
class BoardItemServiceTest {

    @Mock
    private BoardItemRepository boardItemRepository;

    @Mock
    private BoardRepository boardRepository;

    @Mock
    private HttpServletRequest httpRequest;

    @InjectMocks
    private BoardItemService boardItemService;

    private static final Long BOARD_KEY = 1L;
    private static final Long ITEM_KEY = 123L;

    @Test
    @DisplayName("게시글 목록 조회 성공 - 빈 목록")
    void getBoardItemList_Success_EmptyList() {
        // given
        given(boardRepository.existsById(BOARD_KEY)).willReturn(true);

        Page<BoardItem> emptyPage = new PageImpl<>(new ArrayList<>(), PageRequest.of(0, 10), 0);
        given(boardItemRepository.findByBoardKeyAndStatusActive(eq(BOARD_KEY), any(LocalDateTime.class), any(Pageable.class)))
                .willReturn(emptyPage);

        // when
        BoardItemListResponse response = boardItemService.getBoardItemList(BOARD_KEY, 0, 10, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getItems()).isEmpty();
        assertThat(response.getTotalElements()).isEqualTo(0);
        assertThat(response.getTotalPages()).isEqualTo(0);
    }

    @Test
    @DisplayName("게시글 목록 조회 실패 - 존재하지 않는 게시판")
    void getBoardItemList_Fail_BoardNotFound() {
        // given
        given(boardRepository.existsById(BOARD_KEY)).willReturn(false);

        // when & then
        assertThatThrownBy(() -> boardItemService.getBoardItemList(BOARD_KEY, 0, 10, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 게시판");
    }

    @Test
    @DisplayName("게시글 상세 조회 성공")
    void getBoardItemDetail_Success() {
        // given
        given(boardRepository.existsById(BOARD_KEY)).willReturn(true);

        BoardItem item = BoardItem.builder()
                .key(ITEM_KEY)
                .boardKey(BOARD_KEY)
                .title("게시글 제목")
                .content("게시글 내용")
                .writer("작성자")
                .hit(10)
                .commentCount(5)
                .build();

        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.of(item));
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(item);

        // when
        BoardItemResponse response = boardItemService.getBoardItemDetail(BOARD_KEY, ITEM_KEY);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getKey()).isEqualTo(ITEM_KEY);
        assertThat(response.getTitle()).isEqualTo("게시글 제목");
        assertThat(response.getHit()).isEqualTo(11); // 조회수 증가 확인
        verify(boardItemRepository).save(any(BoardItem.class));
    }

    @Test
    @DisplayName("게시글 상세 조회 실패 - 존재하지 않는 게시글")
    void getBoardItemDetail_Fail_ItemNotFound() {
        // given
        given(boardRepository.existsById(BOARD_KEY)).willReturn(true);
        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> boardItemService.getBoardItemDetail(BOARD_KEY, ITEM_KEY))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 게시글");
    }

    @Test
    @DisplayName("게시글 작성 성공")
    void createBoardItem_Success() {
        // given
        Board board = Board.builder()
                .key(BOARD_KEY)
                .status("U")
                .build();

        given(boardRepository.findByKeyAndStatusActive(BOARD_KEY)).willReturn(Optional.of(board));
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        BoardItemCreateRequest request = new BoardItemCreateRequest();
        request.setTitle("새 게시글");
        request.setContent("내용");
        request.setWriter("작성자");

        BoardItem savedItem = BoardItem.builder()
                .key(ITEM_KEY)
                .boardKey(BOARD_KEY)
                .title(request.getTitle())
                .content(request.getContent())
                .writer(request.getWriter())
                .build();

        given(boardItemRepository.save(any(BoardItem.class))).willReturn(savedItem);

        // when
        BoardItemResponse response = boardItemService.createBoardItem(BOARD_KEY, request, httpRequest, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("새 게시글");
        verify(boardItemRepository).save(any(BoardItem.class));
        verify(httpRequest, atLeastOnce()).getHeader(anyString());
    }

    @Test
    @DisplayName("게시글 작성 실패 - 존재하지 않는 게시판")
    void createBoardItem_Fail_BoardNotFound() {
        // given
        given(boardRepository.findByKeyAndStatusActive(BOARD_KEY)).willReturn(Optional.empty());

        BoardItemCreateRequest request = new BoardItemCreateRequest();
        request.setTitle("제목");
        request.setContent("내용");
        request.setWriter("작성자");

        // when & then
        assertThatThrownBy(() -> boardItemService.createBoardItem(BOARD_KEY, request, httpRequest, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 게시판");
    }

    @Test
    @DisplayName("게시글 수정 성공")
    void updateBoardItem_Success() {
        // given
        given(boardRepository.existsById(BOARD_KEY)).willReturn(true);
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        BoardItem item = BoardItem.builder()
                .key(ITEM_KEY)
                .boardKey(BOARD_KEY)
                .title("기존 제목")
                .content("기존 내용")
                .writer("작성자")
                .build();

        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.of(item));
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(item);

        BoardItemUpdateRequest request = new BoardItemUpdateRequest();
        request.setTitle("수정된 제목");
        request.setContent("수정된 내용");

        // when
        BoardItemResponse response = boardItemService.updateBoardItem(BOARD_KEY, ITEM_KEY, request, httpRequest, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("수정된 제목");
        verify(boardItemRepository).save(any(BoardItem.class));
        verify(httpRequest, atLeastOnce()).getHeader(anyString());
    }

    @Test
    @DisplayName("게시글 삭제 성공")
    void deleteBoardItem_Success() {
        // given
        given(boardRepository.existsById(BOARD_KEY)).willReturn(true);
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        BoardItem item = BoardItem.builder()
                .key(ITEM_KEY)
                .boardKey(BOARD_KEY)
                .status("U")
                .build();

        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.of(item));
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(item);

        // when
        boardItemService.deleteBoardItem(BOARD_KEY, ITEM_KEY, httpRequest, null);

        // then
        verify(boardItemRepository).save(any(BoardItem.class));
        assertThat(item.getStatus()).isEqualTo("D"); // 논리 삭제 확인
        verify(httpRequest, atLeastOnce()).getHeader(anyString());
    }
}
