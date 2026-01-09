package kr.co.nubiz.repository;

import kr.co.nubiz.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    // JPQL 사용 (Native Query 대신)
    @Query("SELECT m FROM Member m WHERE m.userId = :userId")
    Optional<Member> findByUserId(@Param("userId") String userId);
    
    @Query("SELECT m FROM Member m WHERE m.userId = :userId AND m.status = :status")
    Optional<Member> findByUserIdAndStatus(@Param("userId") String userId, @Param("status") String status);
    
    // existsByUserId를 사용하지 않고 checkUserIdExists만 사용
    // Spring Data JPA가 existsBy... 패턴을 자동 생성하지 않도록 함
    // 직접 쿼리로 존재 여부 확인 (엔티티 로드 없이)
    @Query(value = "SELECT 1 FROM NU_MEMBER WHERE USERID = :userId LIMIT 1", nativeQuery = true)
    Integer findUserIdExists(@Param("userId") String userId);
    
    default boolean checkUserIdExists(String userId) {
        return findUserIdExists(userId) != null;
    }
    
    // existsByEmail은 직접 구현 (EMAIL 컬럼 검색)
    @Query(value = "SELECT 1 FROM NU_MEMBER WHERE EMAIL = :email LIMIT 1", nativeQuery = true)
    Integer findEmailExists(@Param("email") String email);
    
    default boolean checkEmailExists(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return findEmailExists(email) != null;
    }
}

