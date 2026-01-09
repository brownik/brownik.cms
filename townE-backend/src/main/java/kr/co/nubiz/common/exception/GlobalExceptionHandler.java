package kr.co.nubiz.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .message("입력 데이터 검증 실패")
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        log.error("RuntimeException occurred: {}", ex.getMessage(), ex);
        log.error("Stack trace: ", ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage() != null ? ex.getMessage() : "요청 처리 중 오류가 발생했습니다")
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);
        log.error("Exception class: {}", ex.getClass().getName());
        log.error("Stack trace: ", ex);
        
        String errorMessage = "서버 오류가 발생했습니다";
        if (ex.getMessage() != null && !ex.getMessage().isEmpty()) {
            errorMessage = ex.getMessage();
        }
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .success(false)
                .message(errorMessage)
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

