package com.microservices.clubs.repository;

import com.microservices.clubs.entity.ClubMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    List<ClubMember> findByClubId(Long clubId);
    List<ClubMember> findByStudentId(Long studentId);
    Optional<ClubMember> findByClubIdAndStudentId(Long clubId, Long studentId);
    long countByClubIdAndStatus(Long clubId, String status);
    boolean existsByClubIdAndStudentId(Long clubId, Long studentId);
}
