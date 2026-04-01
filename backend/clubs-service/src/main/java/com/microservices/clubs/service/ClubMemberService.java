package com.microservices.clubs.service;

import com.microservices.clubs.entity.Club;
import com.microservices.clubs.entity.ClubMember;
import com.microservices.clubs.repository.ClubMemberRepository;
import com.microservices.clubs.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClubMemberService {

    @Autowired
    private ClubMemberRepository clubMemberRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Transactional
    public ClubMember joinClub(Long clubId, Long studentId, String studentEmail, String studentName) {
        // Vérifier si le club existe
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));

        // Vérifier si l'étudiant est déjà membre
        if (clubMemberRepository.existsByClubIdAndStudentId(clubId, studentId)) {
            throw new RuntimeException("Student is already a member of this club");
        }

        // Vérifier si le club est plein
        long currentMembers = clubMemberRepository.countByClubIdAndStatus(clubId, "ACTIVE");
        if (club.getMaxMembers() != null && currentMembers >= club.getMaxMembers()) {
            throw new RuntimeException("Club is full");
        }

        // Créer le membre
        ClubMember member = new ClubMember();
        member.setClubId(clubId);
        member.setStudentId(studentId);
        member.setStudentEmail(studentEmail);
        member.setStudentName(studentName);
        member.setStatus("ACTIVE");

        ClubMember savedMember = clubMemberRepository.save(member);

        // Mettre à jour le nombre de membres du club
        club.setCurrentMembers((int) clubMemberRepository.countByClubIdAndStatus(clubId, "ACTIVE"));
        clubRepository.save(club);

        return savedMember;
    }

    @Transactional
    public void leaveClub(Long clubId, Long studentId) {
        ClubMember member = clubMemberRepository.findByClubIdAndStudentId(clubId, studentId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        clubMemberRepository.delete(member);

        // Mettre à jour le nombre de membres du club
        Club club = clubRepository.findById(clubId).orElse(null);
        if (club != null) {
            club.setCurrentMembers((int) clubMemberRepository.countByClubIdAndStatus(clubId, "ACTIVE"));
            clubRepository.save(club);
        }
    }

    public List<ClubMember> getClubMembers(Long clubId) {
        return clubMemberRepository.findByClubId(clubId);
    }

    public List<ClubMember> getStudentClubs(Long studentId) {
        return clubMemberRepository.findByStudentId(studentId);
    }

    public boolean isStudentMember(Long clubId, Long studentId) {
        return clubMemberRepository.existsByClubIdAndStudentId(clubId, studentId);
    }
}
