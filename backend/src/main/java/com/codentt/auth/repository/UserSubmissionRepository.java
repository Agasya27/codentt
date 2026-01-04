package com.codentt.auth.repository;

import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSubmissionRepository extends JpaRepository<UserSubmission, Long> {
    List<UserSubmission> findByUserOrderBySubmittedAtDesc(User user);
    Page<UserSubmission> findByUserOrderBySubmittedAtDesc(User user, Pageable pageable);
}

