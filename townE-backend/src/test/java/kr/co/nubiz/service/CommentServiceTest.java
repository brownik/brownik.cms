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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
@DisplayName("댓글 Service 테스트")
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private BoardItemRepository boardItemRepository;

    @Mock
    private HttpServletRequest httpRequest;

    @InjectMocks
    private CommentService commentService;

    private static final Long BOARD_KEY = 1L;
    private static final Long BOARD_ITEM_KEY = 123L;
    private static final Long COMMENT_KEY = 456L;

    @Test
    @DisplayName("댓글 목록 조회 성공")
    void getCommentList_Success() {
        // given
        given(boardItemRepository.existsById(BOARD_ITEM_KEY)).willReturn(true);

        Comment comment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .comment("댓글 내용")
                .writer("작성자")
                .depth(0)
                .build();

        List<Comment> comments = new ArrayList<>();
        comments.add(comment);

        given(commentRepository.findByBoardItemKeyAndStatusActive(BOARD_ITEM_KEY)).willReturn(comments);
        given(commentRepository.countByBoardItemKey(BOARD_ITEM_KEY)).willReturn(1L);

        // when
        CommentListResponse response = commentService.getCommentList(BOARD_KEY, BOARD_ITEM_KEY);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getComments()).hasSize(1);
        assertThat(response.getTotalCount()).isEqualTo(1);
        assertThat(response.getComments().get(0).getComment()).isEqualTo("댓글 내용");
    }

    @Test
    @DisplayName("댓글 목록 조회 실패 - 존재하지 않는 게시글")
    void getCommentList_Fail_BoardItemNotFound() {
        // given
        given(boardItemRepository.existsById(BOARD_ITEM_KEY)).willReturn(false);

        // when & then
        assertThatThrownBy(() -> commentService.getCommentList(BOARD_KEY, BOARD_ITEM_KEY))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 게시글");
    }

    @Test
    @DisplayName("댓글 작성 성공")
    void createComment_Success() {
        // given
        BoardItem boardItem = BoardItem.builder()
                .key(BOARD_ITEM_KEY)
                .boardKey(BOARD_KEY)
                .status("U")
                .commentCount(0)
                .build();

        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(BOARD_ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.of(boardItem));
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        CommentCreateRequest request = new CommentCreateRequest();
        request.setComment("새 댓글");
        request.setWriter("작성자");

        Comment savedComment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .comment(request.getComment())
                .writer(request.getWriter())
                .depth(0)
                .build();

        given(commentRepository.save(any(Comment.class))).willReturn(savedComment);
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(boardItem);

        // when
        CommentResponse response = commentService.createComment(BOARD_KEY, BOARD_ITEM_KEY, request, httpRequest, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getComment()).isEqualTo("새 댓글");
        assertThat(response.getWriter()).isEqualTo("작성자");
        verify(commentRepository).save(any(Comment.class));
        verify(boardItemRepository).save(any(BoardItem.class));
        assertThat(boardItem.getCommentCount()).isEqualTo(1); // 댓글 수 증가 확인
    }

    @Test
    @DisplayName("댓글 작성 - 대댓글")
    void createComment_Reply() {
        // given
        BoardItem boardItem = BoardItem.builder()
                .key(BOARD_ITEM_KEY)
                .boardKey(BOARD_KEY)
                .status("U")
                .commentCount(0)
                .build();

        Long parentKey = 789L;
        Comment parentComment = Comment.builder()
                .key(parentKey)
                .boardItemKey(BOARD_ITEM_KEY)
                .depth(0)
                .build();

        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(BOARD_ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.of(boardItem));
        given(commentRepository.findByKeyAndStatusActive(parentKey))
                .willReturn(Optional.of(parentComment));
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        CommentCreateRequest request = new CommentCreateRequest();
        request.setComment("대댓글");
        request.setWriter("작성자2");
        request.setParentKey(parentKey);

        Comment savedComment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .parentKey(parentKey)
                .comment(request.getComment())
                .writer(request.getWriter())
                .depth(1)
                .build();

        given(commentRepository.save(any(Comment.class))).willReturn(savedComment);
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(boardItem);

        // when
        CommentResponse response = commentService.createComment(BOARD_KEY, BOARD_ITEM_KEY, request, httpRequest, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getParentKey()).isEqualTo(parentKey);
        assertThat(response.getDepth()).isEqualTo(1); // depth 증가 확인
    }

    @Test
    @DisplayName("댓글 작성 실패 - 존재하지 않는 게시글")
    void createComment_Fail_BoardItemNotFound() {
        // given
        given(boardItemRepository.findByKeyAndBoardKeyAndStatusActive(BOARD_ITEM_KEY, BOARD_KEY))
                .willReturn(Optional.empty());

        CommentCreateRequest request = new CommentCreateRequest();
        request.setComment("댓글");
        request.setWriter("작성자");

        // when & then
        assertThatThrownBy(() -> commentService.createComment(BOARD_KEY, BOARD_ITEM_KEY, request, httpRequest, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 게시글");
    }

    @Test
    @DisplayName("댓글 수정 성공")
    void updateComment_Success() {
        // given
        Comment comment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .comment("기존 댓글")
                .writer("작성자")
                .insertMemberKey(1)
                .build();

        given(commentRepository.findByKeyAndStatusActive(COMMENT_KEY))
                .willReturn(Optional.of(comment));
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setComment("수정된 댓글");
        request.setWriter("수정자");

        Comment updatedComment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .comment(request.getComment())
                .writer(request.getWriter())
                .build();

        given(commentRepository.save(any(Comment.class))).willReturn(updatedComment);

        // when
        CommentResponse response = commentService.updateComment(COMMENT_KEY, request, httpRequest, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getComment()).isEqualTo("수정된 댓글");
        assertThat(response.getWriter()).isEqualTo("수정자");
        verify(commentRepository).save(any(Comment.class));
        verify(httpRequest, atLeastOnce()).getHeader(anyString());
    }

    @Test
    @DisplayName("댓글 수정 실패 - 존재하지 않는 댓글")
    void updateComment_Fail_CommentNotFound() {
        // given
        given(commentRepository.findByKeyAndStatusActive(COMMENT_KEY))
                .willReturn(Optional.empty());

        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setComment("수정된 댓글");

        // when & then
        assertThatThrownBy(() -> commentService.updateComment(COMMENT_KEY, request, httpRequest, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 댓글");
    }

    @Test
    @DisplayName("댓글 수정 - 부분 업데이트")
    void updateComment_PartialUpdate() {
        // given
        Comment comment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .comment("기존 댓글")
                .writer("작성자")
                .build();

        given(commentRepository.findByKeyAndStatusActive(COMMENT_KEY))
                .willReturn(Optional.of(comment));
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");

        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setComment("수정된 댓글만");
        // writer는 null로 두어 부분 업데이트 테스트

        Comment updatedComment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .comment(request.getComment())
                .writer("작성자") // 기존 값 유지
                .build();

        given(commentRepository.save(any(Comment.class))).willReturn(updatedComment);

        // when
        CommentResponse response = commentService.updateComment(COMMENT_KEY, request, httpRequest, null);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getComment()).isEqualTo("수정된 댓글만");
        assertThat(response.getWriter()).isEqualTo("작성자"); // 기존 값 유지 확인
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    @DisplayName("댓글 삭제 성공")
    void deleteComment_Success() {
        // given
        Comment comment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .status("U")
                .build();

        BoardItem boardItem = BoardItem.builder()
                .key(BOARD_ITEM_KEY)
                .commentCount(5)
                .build();

        given(commentRepository.findByKeyAndStatusActive(COMMENT_KEY))
                .willReturn(Optional.of(comment));
        given(commentRepository.existsByParentKeyAndStatusActive(COMMENT_KEY))
                .willReturn(false); // 대댓글 없음
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");
        given(boardItemRepository.findById(BOARD_ITEM_KEY))
                .willReturn(Optional.of(boardItem));
        given(commentRepository.save(any(Comment.class))).willReturn(comment);
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(boardItem);

        // when
        commentService.deleteComment(COMMENT_KEY, httpRequest, null);

        // then
        assertThat(comment.getStatus()).isEqualTo("D"); // 논리 삭제 확인
        assertThat(boardItem.getCommentCount()).isEqualTo(4); // 댓글 수 감소 확인
        verify(commentRepository).save(any(Comment.class));
        verify(boardItemRepository).save(any(BoardItem.class));
    }

    @Test
    @DisplayName("댓글 삭제 실패 - 존재하지 않는 댓글")
    void deleteComment_Fail_CommentNotFound() {
        // given
        given(commentRepository.findByKeyAndStatusActive(COMMENT_KEY))
                .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> commentService.deleteComment(COMMENT_KEY, httpRequest, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("존재하지 않는 댓글");
    }

    @Test
    @DisplayName("댓글 삭제 - 대댓글이 있는 경우")
    void deleteComment_WithReplies() {
        // given
        Comment comment = Comment.builder()
                .key(COMMENT_KEY)
                .boardItemKey(BOARD_ITEM_KEY)
                .status("U")
                .build();

        BoardItem boardItem = BoardItem.builder()
                .key(BOARD_ITEM_KEY)
                .commentCount(5)
                .build();

        given(commentRepository.findByKeyAndStatusActive(COMMENT_KEY))
                .willReturn(Optional.of(comment));
        given(commentRepository.existsByParentKeyAndStatusActive(COMMENT_KEY))
                .willReturn(true); // 대댓글 있음
        given(httpRequest.getHeader(anyString())).willReturn(null);
        given(httpRequest.getRemoteAddr()).willReturn("127.0.0.1");
        given(boardItemRepository.findById(BOARD_ITEM_KEY))
                .willReturn(Optional.of(boardItem));
        given(commentRepository.save(any(Comment.class))).willReturn(comment);
        given(boardItemRepository.save(any(BoardItem.class))).willReturn(boardItem);

        // when
        commentService.deleteComment(COMMENT_KEY, httpRequest, null);

        // then
        assertThat(comment.getStatus()).isEqualTo("D"); // 논리 삭제 확인
        // 대댓글이 있어도 부모 댓글은 삭제됨 (대댓글은 유지)
        verify(commentRepository).save(any(Comment.class));
    }
}
