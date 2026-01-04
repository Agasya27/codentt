package com.codentt.auth.repository;

import com.codentt.auth.entity.ExternalProfile;
import com.codentt.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExternalProfileRepository extends JpaRepository<ExternalProfile, Long> {
    List<ExternalProfile> findByUser(User user);
    Optional<ExternalProfile> findByUserAndPlatform(User user, ExternalProfile.Platform platform);
}

