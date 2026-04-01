package com.microservices.clubs.controller;

import com.microservices.clubs.entity.Club;
import com.microservices.clubs.entity.ClubMember;
import com.microservices.clubs.dto.JoinClubRequest;
import com.microservices.clubs.repository.ClubRepository;
import com.microservices.clubs.service.ClubMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private ClubMemberService clubMemberService;

    @GetMapping
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> getClubById(@PathVariable Long id) {
        return clubRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Club createClub(@RequestBody Club club) {
        return clubRepository.save(club);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club clubDetails) {
        return clubRepository.findById(id)
                .map(club -> {
                    club.setName(clubDetails.getName());
                    club.setDescription(clubDetails.getDescription());
                    club.setCategory(clubDetails.getCategory());
                    club.setMaxMembers(clubDetails.getMaxMembers());
                    club.setCurrentMembers(clubDetails.getCurrentMembers());
                    club.setMeetingSchedule(clubDetails.getMeetingSchedule());
                    club.setLocation(clubDetails.getLocation());
                    return ResponseEntity.ok(clubRepository.save(club));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        return clubRepository.findById(id)
                .map(club -> {
                    clubRepository.delete(club);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoints pour les membres
    @PostMapping("/{clubId}/join")
    public ResponseEntity<?> joinClub(
            @PathVariable Long clubId,
            @RequestBody JoinClubRequest request) {
        try {
            ClubMember member = clubMemberService.joinClub(
                    clubId,
                    request.getStudentId(),
                    request.getStudentEmail(),
                    request.getStudentName()
            );
            return ResponseEntity.ok(member);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{clubId}/leave/{studentId}")
    public ResponseEntity<?> leaveClub(@PathVariable Long clubId, @PathVariable Long studentId) {
        try {
            clubMemberService.leaveClub(clubId, studentId);
            return ResponseEntity.ok(Map.of("message", "Left club successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{clubId}/members")
    public List<ClubMember> getClubMembers(@PathVariable Long clubId) {
        return clubMemberService.getClubMembers(clubId);
    }

    @GetMapping("/student/{studentId}")
    public List<ClubMember> getStudentClubs(@PathVariable Long studentId) {
        return clubMemberService.getStudentClubs(studentId);
    }

    @GetMapping("/{clubId}/is-member/{studentId}")
    public ResponseEntity<Map<String, Boolean>> isStudentMember(
            @PathVariable Long clubId,
            @PathVariable Long studentId) {
        boolean isMember = clubMemberService.isStudentMember(clubId, studentId);
        return ResponseEntity.ok(Map.of("isMember", isMember));
    }
}