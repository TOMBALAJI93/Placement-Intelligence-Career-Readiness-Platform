package com.antigravity.snowflake.repository;

import com.antigravity.snowflake.model.UploadHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadHistoryRepository extends JpaRepository<UploadHistory, Long> {
    List<UploadHistory> findAllByOrderByUploadDateDesc();
}
