package com.microservices.complaints.repository;

import com.microservices.complaints.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentId(Long studentId);
    List<Complaint> findByStatus(String status);
    List<Complaint> findByCategory(String category);
    List<Complaint> findByPriority(String priority);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:studentId IS NULL OR c.studentId = :studentId) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:category IS NULL OR c.category = :category)")
    List<Complaint> searchComplaints(
            @Param("studentId") Long studentId,
            @Param("search") String search,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("category") String category);
}
