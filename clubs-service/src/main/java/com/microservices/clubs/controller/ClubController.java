package com.microservices.clubs.controller;

import com.microservices.clubs.entity.Club;
import com.microservices.clubs.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubRepository clubRepository;

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
}
