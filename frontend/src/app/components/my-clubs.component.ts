import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

function smartCompare(a: any, b: any): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'string' && /^\d{4}-\d{2}-\d{2}/.test(a)) return new Date(a).getTime() - new Date(b).getTime();
  if (typeof a === 'number' || !isNaN(Number(a))) return Number(a) - Number(b);
  return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase(), 'fr');
}

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
        <h2>Clubs que j'ai rejoints
          <span class="count-badge" *ngIf="filteredMy.length !== myClubs.length">{{ filteredMy.length }}/{{ myClubs.length }}</span>
        </h2>

        <!-- Toolbar my clubs -->
        <div class="toolbar" *ngIf="myClubs.length > 0">
          <div class="search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher dans mes clubs…" [(ngModel)]="searchMy" (ngModelChange)="applyMyFilters()" />
            <button *ngIf="searchMy" class="clear-btn" (click)="searchMy=''; applyMyFilters()">✕</button>
          </div>
          <div class="filters">
            <select [(ngModel)]="filterMyCategory" (ngModelChange)="applyMyFilters()" class="filter-select">
              <option value="">Toutes catégories</option>
              <option *ngFor="let cat of allCategories()" [value]="cat">{{ cat }}</option>
            </select>
            <select [(ngModel)]="sortMyField" (ngModelChange)="applyMyFilters()" class="filter-select">
              <option value="">Trier par…</option>
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
              <option value="currentMembers">Membres</option>
            </select>
            <button class="sort-dir-btn" (click)="toggleMyDir()">{{ sortMyDir === 'asc' ? '↑' : '↓' }}</button>
            <button class="reset-btn" *ngIf="hasMyFilters()" (click)="resetMyFilters()">↺ Réinitialiser</button>
          </div>
        </div>

        @if (loading) {
          <div class="loading">Chargement...</div>
        } @else if (myClubs.length === 0) {
          <div class="empty-state">
            <p>Vous n'avez rejoint aucun club pour le moment</p>
          </div>
        } @else if (filteredMy.length === 0) {
          <div class="empty-state"><p>Aucun club ne correspond à votre recherche</p></div>
        } @else {
          <div class="clubs-grid">
            @for (club of filteredMy; track club.id) {
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
        <h2>Clubs disponibles
          <span class="count-badge" *ngIf="filteredAvail.length !== availableClubs.length">{{ filteredAvail.length }}/{{ availableClubs.length }}</span>
        </h2>

        <!-- Toolbar available clubs -->
        <div class="toolbar" *ngIf="availableClubs.length > 0">
          <div class="search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher un club…" [(ngModel)]="searchAvail" (ngModelChange)="applyAvailFilters()" />
            <button *ngIf="searchAvail" class="clear-btn" (click)="searchAvail=''; applyAvailFilters()">✕</button>
          </div>
          <div class="filters">
            <select [(ngModel)]="filterAvailCategory" (ngModelChange)="applyAvailFilters()" class="filter-select">
              <option value="">Toutes catégories</option>
              <option *ngFor="let cat of allCategories()" [value]="cat">{{ cat }}</option>
            </select>
            <select [(ngModel)]="filterAvailFull" (ngModelChange)="applyAvailFilters()" class="filter-select">
              <option value="">Tous</option>
              <option value="available">Places disponibles</option>
              <option value="full">Complet</option>
            </select>
            <select [(ngModel)]="sortAvailField" (ngModelChange)="applyAvailFilters()" class="filter-select">
              <option value="">Trier par…</option>
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
              <option value="currentMembers">Membres</option>
            </select>
            <button class="sort-dir-btn" (click)="toggleAvailDir()">{{ sortAvailDir === 'asc' ? '↑' : '↓' }}</button>
            <button class="reset-btn" *ngIf="hasAvailFilters()" (click)="resetAvailFilters()">↺ Réinitialiser</button>
          </div>
        </div>

        @if (loading) {
          <div class="loading">Chargement...</div>
        } @else if (availableClubs.length === 0) {
          <div class="empty-state">
            <p>Aucun club disponible pour le moment</p>
          </div>
        } @else if (filteredAvail.length === 0) {
          <div class="empty-state"><p>Aucun club ne correspond à votre recherche</p></div>
        } @else {
          <div class="clubs-grid">
            @for (club of filteredAvail; track club.id) {
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
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .count-badge { background: #e5e7eb; color: #6b7280; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 500; }

    .toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .search-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 220px; background: white; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 0 12px; gap: 8px; }
    .search-wrap:focus-within { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
    .search-wrap svg { color: #9ca3af; flex-shrink: 0; }
    .search-wrap input { flex: 1; border: none; outline: none; padding: 9px 0; font-size: 13.5px; background: transparent; color: #111827; }
    .clear-btn { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 14px; }
    .filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .filter-select { padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; background: white; color: #374151; cursor: pointer; outline: none; }
    .filter-select:focus { border-color: #10b981; }
    .sort-dir-btn { width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 16px; }
    .reset-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1.5px solid #fca5a5; border-radius: 8px; background: #fef2f2; color: #dc2626; font-size: 13px; font-weight: 600; cursor: pointer; }

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
  filteredMy: ClubWithMembership[] = [];
  availableClubs: ClubWithMembership[] = [];
  filteredAvail: ClubWithMembership[] = [];
  loading = false;
  error = '';
  successMessage = '';
  studentId: number | null = null;

  // Filters for my clubs
  searchMy = '';
  filterMyCategory = '';
  sortMyField = '';
  sortMyDir: 'asc' | 'desc' = 'asc';

  // Filters for available clubs
  searchAvail = '';
  filterAvailCategory = '';
  filterAvailFull = '';
  sortAvailField = '';
  sortAvailDir: 'asc' | 'desc' = 'asc';

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
    
    this.http.get<any[]>(`http://localhost:8080/students-service/students`).subscribe({
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

    this.http.get<Club[]>('http://localhost:8080/clubs-service/api/clubs').subscribe({
      next: (clubs) => {
        console.log('Clubs loaded from API:', clubs);
        
        this.http.get<ClubMember[]>(`http://localhost:8080/clubs-service/api/clubs/student/${this.studentId}`).subscribe({
          next: (memberships) => {
            console.log('Memberships loaded:', memberships);
            const memberClubIds = memberships.map(m => m.clubId);
            
            this.myClubs = clubs.filter(club => memberClubIds.includes(club.id));
            this.availableClubs = clubs.filter(club => !memberClubIds.includes(club.id));
            
            console.log('My clubs:', this.myClubs);
            console.log('Available clubs:', this.availableClubs);
            
            this.applyMyFilters();
            this.applyAvailFilters();
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading memberships:', err);
            this.availableClubs = clubs;
            this.myClubs = [];
            this.applyMyFilters();
            this.applyAvailFilters();
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

  // --- Filter helpers ---
  allCategories(): string[] {
    const all = [...this.myClubs, ...this.availableClubs];
    return [...new Set(all.map(c => c.category).filter(Boolean))];
  }

  applyMyFilters() {
    let list = [...this.myClubs];
    if (this.searchMy.trim()) {
      const t = this.searchMy.toLowerCase();
      list = list.filter(c => c.name?.toLowerCase().includes(t) || c.category?.toLowerCase().includes(t) || c.description?.toLowerCase().includes(t));
    }
    if (this.filterMyCategory) list = list.filter(c => c.category === this.filterMyCategory);
    if (this.sortMyField) {
      list.sort((a: any, b: any) => {
        const cmp = smartCompare(a[this.sortMyField], b[this.sortMyField]);
        return this.sortMyDir === 'asc' ? cmp : -cmp;
      });
    }
    this.filteredMy = list;
    this.cdr.detectChanges();
  }

  toggleMyDir() { this.sortMyDir = this.sortMyDir === 'asc' ? 'desc' : 'asc'; this.applyMyFilters(); }
  hasMyFilters() { return !!(this.searchMy || this.filterMyCategory || this.sortMyField); }
  resetMyFilters() { this.searchMy = ''; this.filterMyCategory = ''; this.sortMyField = ''; this.sortMyDir = 'asc'; this.applyMyFilters(); }

  applyAvailFilters() {
    let list = [...this.availableClubs];
    if (this.searchAvail.trim()) {
      const t = this.searchAvail.toLowerCase();
      list = list.filter(c => c.name?.toLowerCase().includes(t) || c.category?.toLowerCase().includes(t) || c.description?.toLowerCase().includes(t));
    }
    if (this.filterAvailCategory) list = list.filter(c => c.category === this.filterAvailCategory);
    if (this.filterAvailFull === 'available') list = list.filter(c => c.currentMembers < c.maxMembers);
    if (this.filterAvailFull === 'full') list = list.filter(c => c.currentMembers >= c.maxMembers);
    if (this.sortAvailField) {
      list.sort((a: any, b: any) => {
        const cmp = smartCompare(a[this.sortAvailField], b[this.sortAvailField]);
        return this.sortAvailDir === 'asc' ? cmp : -cmp;
      });
    }
    this.filteredAvail = list;
    this.cdr.detectChanges();
  }

  toggleAvailDir() { this.sortAvailDir = this.sortAvailDir === 'asc' ? 'desc' : 'asc'; this.applyAvailFilters(); }
  hasAvailFilters() { return !!(this.searchAvail || this.filterAvailCategory || this.filterAvailFull || this.sortAvailField); }
  resetAvailFilters() { this.searchAvail = ''; this.filterAvailCategory = ''; this.filterAvailFull = ''; this.sortAvailField = ''; this.sortAvailDir = 'asc'; this.applyAvailFilters(); }

  joinClub(clubId: number) {
    if (!this.studentId) {
      this.error = 'Profil étudiant non trouvé';
      return;
    }

    const email = localStorage.getItem('user_email') || '';
    const firstName = localStorage.getItem('user_firstname') || '';
    const lastName = localStorage.getItem('user_lastname') || '';
    const studentName = `${firstName} ${lastName}`.trim();

    this.http.post(`http://localhost:8080/clubs-service/api/clubs/${clubId}/join`, {
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

    this.http.delete(`http://localhost:8080/clubs-service/api/clubs/${clubId}/leave/${this.studentId}`).subscribe({
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
