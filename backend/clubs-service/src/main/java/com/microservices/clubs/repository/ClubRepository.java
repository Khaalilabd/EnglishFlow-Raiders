package com.microservices.clubs.repository;

import com.microservices.clubs.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByCategory(String category);

    List<Club> findByNameContainingIgnoreCase(String name);

    @Query("SELECT c FROM Club c WHERE " +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.category) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR c.category = :category)")
    List<Club> searchClubs(@Param("search") String search, @Param("category") String category);
}
