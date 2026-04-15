import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ModernDataTableComponent, TableColumn, TableAction } from './modern-data-table.component';
import { ModernStatsCardComponent } from './modern-stats-card.component';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ModernDataTableComponent, ModernStatsCardComponent],
  template: `
    <div class="modern-complaints-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestion des Réclamations</h1>
          <p class="subtitle">Gérez et suivez les réclamations des utilisateurs</p>
        </div>
        <button *ngIf="!authService.isAdmin()" class="btn-primary" (click)="openModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle réclamation
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-modern-stats-card
          title="En attente"
          [value]="countStatus('PENDING')"
          iconColor="orange"
          theme="orange"
          trend="neutral"
          [trendValue]="0"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </app-modern-stats-card>

        <app-modern-stats-card
          title="En cours"
          [value]="countStatus('IN_PROGRESS')"
          iconColor="blue"
          theme="blue"
          trend="up"
          [trendValue]="12"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </app-modern-stats-card>

        <app-modern-stats-card
          title="Résolues"
          [value]="countStatus('RESOLVED')"
          iconColor="green"
          theme="primary"
          trend="up"
          [trendValue]="25"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </app-modern-stats-card>

        <app-modern-stats-card
          title="Fermées"
          [value]="countStatus('CLOSED')"
          iconColor="gray"
          theme="purple"
          trend="neutral"
          [trendValue]="0"
        >
          <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </app-modern-stats-card>
      </div>

      <!-- Modern Data Table -->
      <app-modern-data-table
        [data]="filtered"
        [columns]="tableColumns"
        [actions]="tableActions"
        title="Liste des Réclamations"
        [subtitle]="getTableSubtitle()"
        [loading]="loading"
        [searchable]="true"
        emptyMessage="Aucune réclamation trouvée. Les réclamations apparaîtront ici une fois créées."
        (rowClick)="onRowClick($event)"
      >
        <div slot="actions" class="table-actions">
          <div class="filters">
            <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilters()" class="filter-select">
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="RESOLVED">Résolue</option>
              <option value="CLOSED">Fermée</option>
            </select>
            <select [(ngModel)]="filterPriority" (ngModelChange)="applyFilters()" class="filter-select">
              <option value="">Toutes priorités</option>
              <option value="LOW">Basse</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Haute</option>
              <option value="URGENT">Urgente</option>
            </select>
            <select [(ngModel)]="filterCategory" (ngModelChange)="applyFilters()" class="filter-select">
              <option value="">Toutes catégories</option>
              <option value="TECHNICAL">Technique</option>
              <option value="CONTENT">Contenu</option>
              <option value="SERVICE">Service</option>
              <option value="OTHER">Autre</option>
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
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h2>{{ editMode ? 'Modifier la réclamation' : 'Nouvelle réclamation' }}</h2>
                  <p>{{ editMode ? 'Modifiez les détails de la réclamation' : 'Créez une nouvelle réclamation' }}</p>
                </div>
              </div>
              <button class="close-btn" (click)="closeModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form (ngSubmit)="saveComplaint()" class="modal-form">
              <div class="form-group">
                <label>Titre *</label>
                <input 
                  type="text" 
                  [(ngModel)]="currentComplaint.title" 
                  name="title" 
                  required 
                  placeholder="Titre de la réclamation"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  [(ngModel)]="currentComplaint.description" 
                  name="description" 
                  rows="3"
                  placeholder="Décrivez le problème en détail"
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Catégorie</label>
                  <select [(ngModel)]="currentComplaint.category" name="category" class="form-input">
                    <option value="TECHNICAL">Technique</option>
                    <option value="CONTENT">Contenu</option>
                    <option value="SERVICE">Service</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Priorité</label>
                  <select [(ngModel)]="currentComplaint.priority" name="priority" class="form-input">
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
              </div>
              
              @if (editMode) {
                <div class="form-group">
                  <label>Statut</label>
                  <select [(ngModel)]="currentComplaint.status" name="status" class="form-input">
                    <option value="PENDING">En attente</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="RESOLVED">Résolue</option>
                    <option value="CLOSED">Fermée</option>
                  </select>
                </div>
              }
              
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

      <!-- Resolve Modal -->
      @if (showResolveModal) {
        <div class="modal-overlay" (click)="closeResolve()">
          <div class="modal modern-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-title">
                <div class="modal-icon success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <h2>Traiter la réclamation</h2>
                  <p>Fournissez une réponse et mettez à jour le statut</p>
                </div>
              </div>
              <button class="close-btn" (click)="closeResolve()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div class="modal-body">
              <div class="complaint-summary">
                <h3>{{selectedComplaint?.title}}</h3>
                <p>{{selectedComplaint?.description}}</p>
              </div>
            </div>
            
            <form (ngSubmit)="resolveComplaint()" class="modal-form">
              <div class="form-group">
                <label>Nouveau statut</label>
                <select [(ngModel)]="resolution.status" name="status" required class="form-input">
                  <option value="IN_PROGRESS">En cours de traitement</option>
                  <option value="RESOLVED">Résolue</option>
                  <option value="CLOSED">Fermée</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Réponse / Solution *</label>
                <textarea 
                  [(ngModel)]="resolution.response" 
                  name="response" 
                  rows="4" 
                  placeholder="Décrivez la solution apportée ou les actions entreprises..."
                  required
                  class="form-input"
                ></textarea>
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="closeResolve()">
                  Annuler
                </button>
                <button type="submit" class="btn-primary" [disabled]="saving">
                  @if (saving) {
                    <div class="spinner-sm"></div>
                    Traitement...
                  } @else {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Enregistrer
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
    .modern-complaints-container {
      padding: 24px 28px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      min-height: calc(100vh - 56px);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding: 24px 0;
    }

    .header-content h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 16px;
      color: #6b7280;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .table-actions {
      display: flex;
      gap: 12px;
    }

    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 8px 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      font-size: 13px;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    /* Modern Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .modern-modal {
      background: white;
      border-radius: 20px;
      padding: 0;
      width: 90%;
      max-width: 520px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      padding: 24px 28px;
      border-bottom: 1px solid #f3f4f6;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    }

    .modal-title {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      flex: 1;
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      color: #059669;
      flex-shrink: 0;
    }

    .modal-icon.success {
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      color: #059669;
    }

    .modal-title h2 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .modal-title p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-form {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .modal-body {
      padding: 0 28px 20px;
    }

    .complaint-summary {
      background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .complaint-summary h3 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .complaint-summary p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
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
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      font-size: 14px;
      color: #111827;
      background: white;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 28px;
      border-top: 1px solid #f3f4f6;
      background: #f9fafb;
    }

    /* Buttons */
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: white;
      color: #374151;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    /* Spinner */
    .spinner-sm {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Toast Notifications */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 1100;
      animation: slideUp 0.3s ease;
      max-width: 400px;
    }

    .success-toast {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .error-toast {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .toast-close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s;
      margin-left: 8px;
    }

    .toast-close:hover {
      color: white;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modern-complaints-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-actions {
        flex-direction: column;
      }

      .toast {
        bottom: 16px;
        right: 16px;
        left: 16px;
        max-width: none;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ComplaintsComponent implements OnInit {
  all: any[] = [];
  filtered: any[] = [];
  loading = false;

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'title', label: 'Titre', sortable: true, type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { 
      key: 'category', 
      label: 'Catégorie', 
      sortable: true, 
      type: 'badge',
      align: 'center',
      width: '120px'
    },
    { 
      key: 'priority', 
      label: 'Priorité', 
      sortable: true, 
      type: 'badge',
      align: 'center',
      width: '100px'
    },
    { 
      key: 'status', 
      label: 'Statut', 
      sortable: true, 
      type: 'badge',
      align: 'center',
      width: '120px'
    },
    { 
      key: 'createdAt', 
      label: 'Date', 
      sortable: true, 
      type: 'date',
      align: 'center',
      width: '120px'
    },
    { key: 'actions', label: 'Actions', type: 'actions', width: '200px', align: 'center' }
  ];

  tableActions: TableAction[] = [];

  // Filters
  filterStatus = '';
  filterPriority = '';
  filterCategory = '';

  // Modal states
  showModal = false;
  showResolveModal = false;
  editMode = false;
  currentComplaint: any = {};
  selectedComplaint: any = null;
  resolution: any = { status: 'IN_PROGRESS', response: '' };

  // UI states
  saving = false;
  error = '';
  successMessage = '';

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef, 
    public authService: AuthService
  ) {
    this.setupTableActions();
  }

  ngOnInit() { 
    this.loadComplaints(); 
  }

  setupTableActions() {
    this.tableActions = [];

    if (this.canManage()) {
      this.tableActions.push(
        {
          label: 'Traiter',
          icon: 'view',
          color: 'success',
          action: (row: any) => this.openResolve(row),
          visible: (row: any) => row.status !== 'RESOLVED' && row.status !== 'CLOSED'
        },
        {
          label: 'Modifier',
          icon: 'edit',
          color: 'secondary',
          action: (row: any) => this.editComplaint(row),
          visible: () => !this.authService.isAdmin()
        },
        {
          label: 'Supprimer',
          icon: 'delete',
          color: 'danger',
          action: (row: any) => this.deleteComplaint(row.id)
        }
      );
    }
  }

  loadComplaints() {
    this.loading = true;
    this.error = '';
    
    this.http.get<any[]>('http://localhost:8080/complaints-service/api/complaints').subscribe({
      next: (data) => { 
        this.all = data; 
        this.applyFilters(); 
        this.loading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => { 
        console.error('Error loading complaints:', err);
        this.error = 'Erreur lors du chargement des réclamations';
        this.loading = false; 
        this.cdr.detectChanges(); 
      }
    });
  }

  applyFilters() {
    let list = [...this.all];
    
    if (this.filterStatus) {
      list = list.filter(c => c.status === this.filterStatus);
    }
    
    if (this.filterPriority) {
      list = list.filter(c => c.priority === this.filterPriority);
    }
    
    if (this.filterCategory) {
      list = list.filter(c => c.category === this.filterCategory);
    }
    
    this.filtered = list;
    this.cdr.detectChanges();
  }

  getTableSubtitle(): string {
    return `${this.filtered.length} réclamation${this.filtered.length > 1 ? 's' : ''} affichée${this.filtered.length > 1 ? 's' : ''}`;
  }

  countStatus(status: string): number { 
    return this.all.filter(c => c.status === status).length; 
  }

  onRowClick(complaint: any) {
    if (this.canManage()) {
      this.editComplaint(complaint);
    }
  }

  openModal() { 
    this.editMode = false; 
    this.currentComplaint = { 
      category: 'TECHNICAL', 
      priority: 'MEDIUM', 
      status: 'PENDING' 
    }; 
    this.showModal = true; 
  }

  editComplaint(complaint: any) { 
    this.editMode = true; 
    this.currentComplaint = { ...complaint }; 
    this.showModal = true; 
  }

  closeModal() { 
    this.showModal = false; 
    this.currentComplaint = {};
  }

  saveComplaint() {
    if (!this.currentComplaint.title) {
      this.error = 'Le titre est obligatoire';
      return;
    }

    this.saving = true;
    this.error = '';
    
    const url = this.editMode 
      ? `http://localhost:8080/complaints-service/api/complaints/${this.currentComplaint.id}` 
      : 'http://localhost:8080/complaints-service/api/complaints';
    
    const method = this.editMode 
      ? this.http.put(url, this.currentComplaint) 
      : this.http.post(url, this.currentComplaint);
    
    method.subscribe({ 
      next: () => { 
        this.saving = false;
        this.loadComplaints(); 
        this.closeModal(); 
        this.showToast(this.editMode ? 'Réclamation modifiée avec succès !' : 'Réclamation créée avec succès !');
      },
      error: (err) => {
        this.saving = false;
        this.error = 'Erreur lors de l\'enregistrement de la réclamation';
        console.error('Error saving complaint:', err);
        this.cdr.detectChanges();
      }
    });
  }

  deleteComplaint(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.http.delete(`http://localhost:8080/complaints-service/api/complaints/${id}`).subscribe({
        next: () => {
          this.loadComplaints();
          this.showToast('Réclamation supprimée avec succès !');
        },
        error: (err) => {
          console.error('Error deleting complaint:', err);
          this.error = 'Erreur lors de la suppression de la réclamation';
        }
      });
    }
  }

  openResolve(complaint: any) {
    this.selectedComplaint = complaint;
    this.resolution = { 
      status: 'IN_PROGRESS', 
      response: complaint.response || '', 
      handledBy: (localStorage.getItem('user_firstname') || '') + ' ' + (localStorage.getItem('user_lastname') || '') 
    };
    this.showResolveModal = true;
  }

  closeResolve() { 
    this.showResolveModal = false; 
    this.selectedComplaint = null; 
  }

  resolveComplaint() {
    if (!this.selectedComplaint || !this.resolution.response) {
      this.error = 'La réponse est obligatoire';
      return;
    }

    this.saving = true;
    this.error = '';
    
    this.http.patch(`http://localhost:8080/complaints-service/api/complaints/${this.selectedComplaint.id}/resolve`, this.resolution).subscribe({
      next: () => { 
        this.saving = false;
        this.loadComplaints(); 
        this.closeResolve(); 
        this.showToast('Réclamation traitée avec succès !');
      },
      error: (err) => {
        this.saving = false;
        this.error = 'Erreur lors du traitement de la réclamation';
        console.error('Error resolving complaint:', err);
        this.cdr.detectChanges();
      }
    });
  }

  canManage(): boolean { 
    return this.authService.canViewAllComplaints(); 
  }

  showToast(message: string) {
    this.successMessage = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}