import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="my-complaints-container">
      <div class="page-header">
        <h1>📢 Mes Réclamations</h1>
        <button class="btn-primary" (click)="openModal()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle réclamation
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>

      <div *ngIf="!loading && complaints.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <p>Vous n'avez aucune réclamation</p>
        <button class="btn-primary" (click)="openModal()">Soumettre une réclamation</button>
      </div>

      <div class="complaints-list" *ngIf="!loading && complaints.length > 0">
        <div class="complaint-card" *ngFor="let complaint of complaints">
          <div class="complaint-header">
            <h3>{{complaint.title}}</h3>
            <span class="status-badge" [class]="'status-' + complaint.status.toLowerCase()">
              {{getStatusLabel(complaint.status)}}
            </span>
          </div>
          <p class="complaint-description">{{complaint.description}}</p>
          <div class="complaint-footer">
            <span class="complaint-date">📅 {{formatDate(complaint.createdAt)}}</span>
            <span class="complaint-category">🏷️ {{complaint.category}}</span>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nouvelle réclamation</h2>
            <button class="btn-close" (click)="closeModal()">×</button>
          </div>

          <form (ngSubmit)="submitComplaint()">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" [(ngModel)]="newComplaint.title" name="title" required placeholder="Résumé de votre réclamation">
            </div>

            <div class="form-group">
              <label>Catégorie</label>
              <select [(ngModel)]="newComplaint.category" name="category" required>
                <option value="">Sélectionnez une catégorie</option>
                <option value="COURS">Cours</option>
                <option value="TECHNIQUE">Technique</option>
                <option value="ADMINISTRATIF">Administratif</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="newComplaint.description" name="description" rows="5" required placeholder="Décrivez votre réclamation en détail..."></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="submitting">
                {{submitting ? 'Envoi...' : 'Soumettre'}}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div *ngIf="successMessage" class="success-toast">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        {{successMessage}}
      </div>
    </div>
  `,
  styles: [`
    .my-complaints-container {
      margin-left: 280px;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f1629 0%, #1a1f3a 100%);
      padding: 32px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: rgba(255, 255, 255, 0.6);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state svg {
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 16px;
    }

    .empty-state p {
      font-size: 16px;
      margin: 0 0 24px 0;
    }

    .complaints-list {
      display: grid;
      gap: 20px;
    }

    .complaint-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }

    .complaint-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .complaint-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }

    .complaint-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: white;
      margin: 0;
      flex: 1;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }

    .status-in_progress {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    .status-resolved {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }

    .status-closed {
      background: rgba(156, 163, 175, 0.2);
      color: #9ca3af;
    }

    .complaint-description {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .complaint-footer {
      display: flex;
      gap: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: #1a1f3a;
      border-radius: 16px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .modal-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.05);
      border: none;
      border-radius: 8px;
      color: white;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    form {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: white;
      font-size: 14px;
      box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(255, 255, 255, 0.08);
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-secondary {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .success-toast {
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: rgba(16, 185, 129, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
      z-index: 1000;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .my-complaints-container {
        margin-left: 0;
        padding: 20px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class MyComplaintsComponent implements OnInit {
  complaints: any[] = [];
  loading = true;
  showModal = false;
  submitting = false;
  successMessage = '';
  
  newComplaint = {
    title: '',
    description: '',
    category: '',
    status: 'PENDING'
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMyComplaints();
  }

  loadMyComplaints() {
    this.loading = true;
    // Pour la démo, charger toutes les réclamations
    // TODO: Filtrer par utilisateur connecté
    this.http.get<any[]>('http://localhost:8080/api/complaints').subscribe({
      next: (data) => {
        this.complaints = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading complaints:', err);
        this.loading = false;
      }
    });
  }

  openModal() {
    this.newComplaint = {
      title: '',
      description: '',
      category: '',
      status: 'PENDING'
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitComplaint() {
    if (!this.newComplaint.title || !this.newComplaint.description || !this.newComplaint.category) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.submitting = true;
    this.http.post('http://localhost:8080/api/complaints', this.newComplaint).subscribe({
      next: () => {
        this.showSuccess('Réclamation soumise avec succès!');
        this.closeModal();
        this.loadMyComplaints();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error submitting complaint:', err);
        alert('Erreur lors de la soumission');
        this.submitting = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'PENDING': return 'En attente';
      case 'IN_PROGRESS': return 'En cours';
      case 'RESOLVED': return 'Résolue';
      case 'CLOSED': return 'Fermée';
      default: return status;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}
