package kr.co.nubiz.repository;

import kr.co.nubiz.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b FROM Board b WHERE b.key = :key AND b.status = 'U'")
    Optional<Board> findByKeyAndStatusActive(@Param("key") Long key);
}
