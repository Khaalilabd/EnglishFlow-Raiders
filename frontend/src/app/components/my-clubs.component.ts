import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

interface Club {
  id: number;
  name: string;
  description: string;
  category: string;
  maxMembers: number;
  currentMembers: number;
  meetingSchedule: string;
  location: string;
}

interface ClubMember {
  id: number;
  clubId: number;
  studentId: number;
  studentEmail: string;
  studentName: string;
  joinedAt: string;
  status: string;
}

interface ClubWithMembership extends Club {
  isMember?: boolean;
  membershipId?: number;
}

@Component({
  selector: 'app-my-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Mes Clubs</h1>
        <p>Rejoignez des clubs et participez aux activités</p>
      </div>

      <!-- Clubs rejoints -->
      <div class="section">
        <h2>Clubs que j'ai rejoints</h2>
        @if (loading) {
          <div class="loading">Chargement...</div>
        } @else if (myClubs.length === 0) {
          <div class="empty-state">
            <p>Vous n'avez rejoint aucun club pour le moment</p>
          </div>
        } @else {
          <div class="clubs-grid">
            @for (club of myClubs; track club.id) {
              <div class="club-card joined">
                <div class="club-header">
                  <h3>{{club.name}}</h3>
                  <span class="badge badge-success">Membre</span>
                </div>
                <p class="club-description">{{club.description}}</p>
                <div class="club-details">
                  <div class="detail-item">
                    <span class="label">Catégorie:</span>
                    <span class="value">{{club.category}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Membres:</span>
                    <span class="value">{{club.currentMembers}}/{{club.maxMembers}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Horaire:</span>
                    <span class="value">{{club.meetingSchedule}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Lieu:</span>
                    <span class="value">{{club.location}}</span>
                  </div>
                </div>
                <button (click)="leaveClub(club.id)" class="btn btn-danger">
                  Quitter le club
                </button>
              </div>
            }
          </div>
        }
      </div>

      <!-- Clubs disponibles -->
      <div class="section">
        <h2>Clubs disponibles</h2>
        @if (loading) {
          <div class="loading">Chargement...</div>
        } @else if (availableClubs.length === 0) {
          <div class="empty-state">
            <p>Aucun club disponible pour le moment</p>
          </div>
        } @else {
          <div class="clubs-grid">
            @for (club of availableClubs; track club.id) {
              <div class="club-card">
                <div class="club-header">
                  <h3>{{club.name}}</h3>
                  @if (club.currentMembers >= club.maxMembers) {
                    <span class="badge badge-warning">Complet</span>
                  }
                </div>
                <p class="club-description">{{club.description}}</p>
                <div class="club-details">
                  <div class="detail-item">
                    <span class="label">Catégorie:</span>
                    <span class="value">{{club.category}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Membres:</span>
                    <span class="value">{{club.currentMembers}}/{{club.maxMembers}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Horaire:</span>
                    <span class="value">{{club.meetingSchedule}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Lieu:</span>
                    <span class="value">{{club.location}}</span>
                  </div>
                </div>
                <button 
                  (click)="joinClub(club.id)" 
                  class="btn btn-primary"
                  [disabled]="club.currentMembers >= club.maxMembers">
                  @if (club.currentMembers >= club.maxMembers) {
                    Club complet
                  } @else {
                    Rejoindre
                  }
                </button>
              </div>
            }
          </div>
        }
      </div>

      @if (error) {
        <div class="alert alert-error">{{error}}</div>
      }

      @if (successMessage) {
        <div class="alert alert-success">{{successMessage}}</div>
      }
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    .header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .header p {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .section {
      margin-bottom: 48px;
    }

    .section h2 {
      font-size: 24px;
      font-weight: 600;
      color: #334155;
      margin: 0 0 24px 0;
    }

    .clubs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .club-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
      border: 2px solid transparent;
    }

    .club-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
    }

    .club-card.joined {
      border-color: #10b981;
      background: linear-gradient(to bottom, #f0fdf4 0%, white 100%);
    }

    .club-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 16px;
    }

    .club-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      flex: 1;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-success {
      background: #10b981;
      color: white;
    }

    .badge-warning {
      background: #f59e0b;
      color: white;
    }

    .club-description {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .club-details {
      display: grid;
      gap: 12px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    .detail-item .label {
      color: #64748b;
      font-weight: 500;
    }

    .detail-item .value {
      color: #1e293b;
      font-weight: 600;
    }

    .btn {
      width: 100%;
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .loading {
      text-align: center;
      padding: 48px;
      color: #64748b;
      font-size: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      background: #f8fafc;
      border-radius: 16px;
      color: #64748b;
    }

    .alert {
      padding: 16px 20px;
      border-radius: 12px;
      margin-top: 24px;
      font-size: 14px;
      font-weight: 500;
    }

    .alert-error {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .alert-success {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    @media (max-width: 768px) {
      .clubs-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyClubsComponent implements OnInit {
  myClubs: ClubWithMembership[] = [];
  availableClubs: ClubWithMembership[] = [];
  loading = false;
  error = '';
  successMessage = '';
  studentId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('MyClubsComponent initialized');
    // Petit délai pour s'assurer que tout est prêt
    setTimeout(() => {
      this.loadStudentData();
    }, 100);
  }

  loadStudentData() {
    const email = localStorage.getItem('user_email');
    console.log('Loading student data for email:', email);
    
    if (!email) {
      this.error = 'Email utilisateur non trouvé';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    this.http.get<any[]>(`http://localhost:8080/api/students`).subscribe({
      next: (students) => {
        console.log('Students loaded:', students);
        const student = students.find(s => s.email === email);
        if (student) {
          this.studentId = student.id;
          console.log('Student ID found:', this.studentId);
          this.loadClubs();
        } else {
          console.warn('Student not found for email:', email);
          // Fallback: utiliser le premier étudiant si disponible
          if (students.length > 0) {
            this.studentId = students[0].id;
            console.log('Using first student ID as fallback:', this.studentId);
            this.loadClubs();
          } else {
            this.error = 'Profil étudiant non trouvé';
            this.loading = false;
            this.cdr.detectChanges();
          }
        }
      },
      error: (err) => {
        console.error('Error loading student:', err);
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadClubs() {
    if (!this.studentId) return;

    console.log('Loading clubs for student ID:', this.studentId);

    this.http.get<Club[]>('http://localhost:8080/api/clubs').subscribe({
      next: (clubs) => {
        console.log('Clubs loaded from API:', clubs);
        
        this.http.get<ClubMember[]>(`http://localhost:8080/api/clubs/student/${this.studentId}`).subscribe({
          next: (memberships) => {
            console.log('Memberships loaded:', memberships);
            const memberClubIds = memberships.map(m => m.clubId);
            
            this.myClubs = clubs.filter(club => memberClubIds.includes(club.id));
            this.availableClubs = clubs.filter(club => !memberClubIds.includes(club.id));
            
            console.log('My clubs:', this.myClubs);
            console.log('Available clubs:', this.availableClubs);
            
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading memberships:', err);
            // Si l'erreur est 404, c'est normal (pas encore de memberships)
            this.availableClubs = clubs;
            this.myClubs = [];
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading clubs:', err);
        this.error = 'Erreur lors du chargement des clubs';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  joinClub(clubId: number) {
    if (!this.studentId) {
      this.error = 'Profil étudiant non trouvé';
      return;
    }

    const email = localStorage.getItem('user_email') || '';
    const firstName = localStorage.getItem('user_firstname') || '';
    const lastName = localStorage.getItem('user_lastname') || '';
    const studentName = `${firstName} ${lastName}`.trim();

    this.http.post(`http://localhost:8080/api/clubs/${clubId}/join`, {
      studentId: this.studentId,
      studentEmail: email,
      studentName: studentName || email
    }).subscribe({
      next: () => {
        this.successMessage = 'Vous avez rejoint le club avec succès!';
        setTimeout(() => this.successMessage = '', 3000);
        this.loadClubs();
      },
      error: (err) => {
        console.error('Error joining club:', err);
        this.error = err.error?.error || 'Erreur lors de l\'adhésion au club';
        setTimeout(() => this.error = '', 5000);
        this.cdr.detectChanges();
      }
    });
  }

  leaveClub(clubId: number) {
    if (!this.studentId) return;

    if (!confirm('Êtes-vous sûr de vouloir quitter ce club?')) {
      return;
    }

    this.http.delete(`http://localhost:8080/api/clubs/${clubId}/leave/${this.studentId}`).subscribe({
      next: () => {
        this.successMessage = 'Vous avez quitté le club';
        setTimeout(() => this.successMessage = '', 3000);
        this.loadClubs();
      },
      error: (err) => {
        console.error('Error leaving club:', err);
        this.error = 'Erreur lors de la sortie du club';
        setTimeout(() => this.error = '', 5000);
        this.cdr.detectChanges();
      }
    });
  }
}
