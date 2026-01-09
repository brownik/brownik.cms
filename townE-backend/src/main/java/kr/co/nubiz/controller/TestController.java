package kr.co.nubiz.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import kr.co.nubiz.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/test")
public class TestController {

    @PersistenceContext
    private EntityManager entityManager;

    private final DataSource dataSource;

    public TestController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/db")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testDatabase() {
        Map<String, Object> data = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            data.put("connected", true);
            data.put("databaseProductName", metaData.getDatabaseProductName());
            data.put("databaseProductVersion", metaData.getDatabaseProductVersion());
            data.put("driverName", metaData.getDriverName());
            data.put("driverVersion", metaData.getDriverVersion());
            data.put("url", metaData.getURL());
            data.put("username", metaData.getUserName());
            
            // 테이블 목록 조회
            try (var tables = metaData.getTables(null, null, "NU_%", new String[]{"TABLE"})) {
                int tableCount = 0;
                while (tables.next()) {
                    tableCount++;
                }
                data.put("tableCount", tableCount);
            }
            
            return ResponseEntity.ok(ApiResponse.success("데이터베이스 연결 성공", data));
        } catch (Exception e) {
            data.put("connected", false);
            data.put("error", e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("데이터베이스 연결 실패", data));
        }
    }
}

