import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ModernDataTableComponent, TableColumn, TableAction } from './modern-data-table.component';
import { ModernStatsCardComponent } from './modern-stats-card.component';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule, ModernDataTableComponent, ModernStatsCardComponent],
  template: `
    <div class="modern-clubs-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestion des Clubs</h1>
          <p class="subtitle">Découvrez et rejoignez des communautés d'apprentissage</p>
        </div>
        @if (canManageClubs()) {
          <button class="btn-primary" (click)="openModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau club
          </button>
        }
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-modern-stats-card
          title="Total clubs"
          [value]="clubs.length"
          iconColor="blue"
          theme="blue"
          trend="up"
          [trendValue]="15"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </app-modern-stats-card>

        <app-modern-stats-card
          title="Membres total"
          [value]="totalMembers()"
          iconColor="green"
          theme="primary"
          trend="up"
          [trendValue]="22"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </app-modern-stats-card>

        <app-modern-stats-card
          title="Catégories"
          [value]="categories().length"
          iconColor="purple"
          theme="purple"
          trend="neutral"
          [trendValue]="0"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </app-modern-stats-card>

        <app-modern-stats-card
          title="Taux de remplissage"
          [value]="getAverageOccupancy()"
          suffix="%"
          iconColor="orange"
          theme="orange"
          trend="up"
          [trendValue]="8"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </app-modern-stats-card>
      </div>

      <!-- Modern Data Table -->
      <app-modern-data-table
        [data]="filtered"
        [columns]="tableColumns"
        [actions]="tableActions"
        title="Liste des Clubs"
        [subtitle]="getTableSubtitle()"
        [loading]="loading"
        [searchable]="true"
        emptyMessage="Aucun club trouvé. Créez le premier club de la communauté."
        (rowClick)="onRowClick($event)"
      >
        <div slot="actions" class="table-actions">
          <div class="filters">
            <select [(ngModel)]="filterCategory" (ngModelChange)="applyFilters()" class="filter-select">
              <option value="">Toutes catégories</option>
              @for (cat of categories(); track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>
        </div>
      </app-modern-data-table>

      <!-- Add/Edit Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal modern-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-title">
                <div class="modal-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h2>{{ editMode ? 'Modifier le club' : 'Nouveau club' }}</h2>
                  <p>{{ editMode ? 'Modifiez les informations du club' : 'Créez un nouveau club pour la communauté' }}</p>
                </div>
              </div>
              <button class="close-btn" (click)="closeModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form (ngSubmit)="saveClub()" class="modal-form">
              <div class="form-group">
                <label>Nom du club *</label>
                <input 
                  type="text" 
                  [(ngModel)]="currentClub.name" 
                  name="name" 
                  required 
                  placeholder="Entrez le nom du club"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  [(ngModel)]="currentClub.description" 
                  name="description" 
                  rows="3"
                  placeholder="Décrivez les activités et objectifs du club"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Catégorie</label>
                  <input 
                    type="text" 
                    [(ngModel)]="currentClub.category" 
                    name="category" 
                    placeholder="Ex: Sport, Culture, Technologie"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Nombre max de membres</label>
                  <input 
                    type="number" 
                    [(ngModel)]="currentClub.maxMembers" 
                    name="maxMembers" 
                    min="1"
                    max="100"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Horaire des réunions</label>
                  <input 
                    type="text" 
                    [(ngModel)]="currentClub.meetingSchedule" 
                    name="schedule" 
                    placeholder="Ex: Lundi 18h00"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Lieu</label>
                  <input 
                    type="text" 
                    [(ngModel)]="currentClub.location" 
                    name="location" 
                    placeholder="Ex: Salle A, Bâtiment principal"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">
                  Annuler
                </button>
                <button type="submit" class="btn-primary" [disabled]="saving">
                  @if (saving) {
                    <div class="spinner-sm"></div>
                    Enregistrement...
                  } @else {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    {{ editMode ? 'Modifier' : 'Créer' }}
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Success Toast -->
      @if (successMessage) {
        <div class="toast success-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ successMessage }}
        </div>
      }

      <!-- Error Toast -->
      @if (error) {
        <div class="toast error-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ error }}
          <button class="toast-close" (click)="error = ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .modern-clubs-container {
      padding: 24px 28px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .header-content h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin: 0;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .table-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 10px 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 14px;
      background: white;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 160px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modern-modal {
      background: white;
      border-radius: 20px;
      padding: 0;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 28px;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    }

    .modal-title {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .modal-title h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .modal-title p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #475569;
    }

    .modal-form {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .form-input {
      padding: 12px 16px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 14px;
      color: #1e293b;
      transition: all 0.2s;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-input::placeholder {
      color: #94a3b8;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px 28px;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
    }

    .btn-secondary {
      padding: 12px 24px;
      border: 1.5px solid #e2e8f0;
      background: white;
      color: #475569;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Toast Notifications */
    .toast {
      position: fixed;
      top: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1100;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .success-toast {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .error-toast {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      color: currentColor;
      opacity: 0.7;
      padding: 4px;
      border-radius: 4px;
      transition: opacity 0.2s;
    }

    .toast-close:hover {
      opacity: 1;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .modern-clubs-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .toast {
        left: 16px;
        right: 16px;
        top: 16px;
      }
    }

    @media (max-width: 480px) {
      .modern-modal {
        width: 95%;
        margin: 16px;
      }

      .modal-form {
        padding: 20px;
      }

      .modal-header {
        padding: 20px;
      }

      .modal-actions {
        padding: 20px;
      }
    }
  `]
})
export class ClubsComponent implements OnInit {
  clubs: any[] = [];
  filtered: any[] = [];
  loading = false;
  saving = false;

  // Modal state
  showModal = false;
  editMode = false;
  currentClub: any = {};

  // Filters
  filterCategory = '';

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Nom du club', sortable: true, type: 'text' },
    { key: 'category', label: 'Catégorie', sortable: true, type: 'badge' },
    { key: 'memberCount', label: 'Membres', sortable: true, type: 'number', align: 'center' },
    { key: 'maxMembers', label: 'Capacité max', sortable: true, type: 'number', align: 'center' },
    { key: 'meetingSchedule', label: 'Horaire', sortable: false, type: 'text' },
    { key: 'location', label: 'Lieu', sortable: false, type: 'text' },
    { key: 'actions', label: 'Actions', type: 'actions', align: 'center' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Rejoindre',
      icon: 'view',
      color: 'success',
      action: (row) => this.joinClub(row),
      visible: (row) => this.canJoinClub(row)
    },
    {
      label: 'Modifier',
      icon: 'edit',
      color: 'primary',
      action: (row) => this.editClub(row),
      visible: () => this.canManageClubs()
    },
    {
      label: 'Supprimer',
      icon: 'delete',
      color: 'danger',
      action: (row) => this.deleteClub(row.id),
      visible: () => this.canManageClubs()
    }
  ];

  // Toast messages
  successMessage = '';
  error = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadClubs();
  }

  loadClubs() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/clubs-service/api/clubs').subscribe({
      next: (data) => {
        this.clubs = data.map(club => ({
          ...club,
          memberCount: club.members?.length || 0
        }));
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des clubs';
        this.loading = false;
        this.cdr.detectChanges();
        this.hideErrorAfterDelay();
      }
    });
  }

  applyFilters() {
    let result = [...this.clubs];
    
    if (this.filterCategory) {
      result = result.filter(club => 
        club.category?.toLowerCase().includes(this.filterCategory.toLowerCase())
      );
    }
    
    this.filtered = result;
    this.cdr.detectChanges();
  }

  // Stats calculations
  totalMembers(): number {
    return this.clubs.reduce((sum, club) => sum + (club.memberCount || 0), 0);
  }

  categories(): string[] {
    const cats = this.clubs
      .map(club => club.category)
      .filter(cat => cat && cat.trim())
      .filter((cat, index, arr) => arr.indexOf(cat) === index);
    return cats;
  }

  getAverageOccupancy(): number {
    if (this.clubs.length === 0) return 0;
    const totalOccupancy = this.clubs.reduce((sum, club) => {
      const occupancy = club.maxMembers > 0 ? (club.memberCount / club.maxMembers) * 100 : 0;
      return sum + occupancy;
    }, 0);
    return Math.round(totalOccupancy / this.clubs.length);
  }

  getTableSubtitle(): string {
    return `${this.filtered.length} club(s) affiché(s) sur ${this.clubs.length}`;
  }

  // Modal operations
  openModal() {
    this.editMode = false;
    this.currentClub = {
      name: '',
      description: '',
      category: '',
      maxMembers: 20,
      meetingSchedule: '',
      location: ''
    };
    this.showModal = true;
  }

  editClub(club: any) {
    this.editMode = true;
    this.currentClub = { ...club };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentClub = {};
    this.editMode = false;
  }

  saveClub() {
    if (!this.currentClub.name?.trim()) {
      this.error = 'Le nom du club est requis';
      this.hideErrorAfterDelay();
      return;
    }

    this.saving = true;
    const clubData = { ...this.currentClub };

    const request = this.editMode
      ? this.http.put(`http://localhost:8080/clubs-service/api/clubs/${clubData.id}`, clubData)
      : this.http.post('http://localhost:8080/clubs-service/api/clubs', clubData);

    request.subscribe({
      next: () => {
        this.successMessage = this.editMode 
          ? 'Club modifié avec succès' 
          : 'Club créé avec succès';
        this.loadClubs();
        this.closeModal();
        this.saving = false;
        this.hideSuccessAfterDelay();
      },
      error: (err) => {
        this.error = 'Erreur lors de la sauvegarde du club';
        this.saving = false;
        this.hideErrorAfterDelay();
      }
    });
  }

  deleteClub(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce club ?')) {
      return;
    }

    this.http.delete(`http://localhost:8080/clubs-service/api/clubs/${id}`).subscribe({
      next: () => {
        this.successMessage = 'Club supprimé avec succès';
        this.loadClubs();
        this.hideSuccessAfterDelay();
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression du club';
        this.hideErrorAfterDelay();
      }
    });
  }

  joinClub(club: any) {
    if (club.memberCount >= club.maxMembers) {
      this.error = 'Ce club a atteint sa capacité maximale';
      this.hideErrorAfterDelay();
      return;
    }

    this.http.post(`http://localhost:8080/clubs-service/api/clubs/${club.id}/join`, {}).subscribe({
      next: () => {
        this.successMessage = `Vous avez rejoint le club "${club.name}"`;
        this.loadClubs();
        this.hideSuccessAfterDelay();
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'inscription au club';
        this.hideErrorAfterDelay();
      }
    });
  }

  // Table events
  onRowClick(club: any) {
    // Could open a detail view or perform an action
    console.log('Club clicked:', club);
  }

  // Permission checks
  canManageClubs(): boolean {
    return this.authService.canManageClubs();
  }

  canJoinClub(club: any): boolean {
    // Students can join clubs, admins and tutors typically manage them
    const userRole = this.authService.getUserRole();
    return userRole === 'STUDENT' && club.memberCount < club.maxMembers;
  }

  // Utility methods
  private hideSuccessAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  private hideErrorAfterDelay() {
    setTimeout(() => {
      this.error = '';
      this.cdr.detectChanges();
    }, 5000);
  }
}