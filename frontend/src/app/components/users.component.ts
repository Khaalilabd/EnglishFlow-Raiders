import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>👥 Gestion des Utilisateurs</h1>
        <button *ngIf="canManageUsers()" class="btn-primary" (click)="openModal()">+ Nouvel utilisateur</button>
      </div>
      
      <div class="stats">
        <div class="stat-card admin">
          <h3>{{stats.byRole?.ADMIN || 0}}</h3>
          <p>Administrateurs</p>
        </div>
        <div class="stat-card tutor">
          <h3>{{stats.byRole?.TUTOR || 0}}</h3>
          <p>Tuteurs</p>
        </div>
        <div class="stat-card student">
          <h3>{{stats.byRole?.STUDENT || 0}}</h3>
          <p>Étudiants</p>
        </div>
        <div class="stat-card total">
          <h3>{{stats.total || 0}}</h3>
          <p>Total</p>
        </div>
      </div>
      
      <!-- Filtres et recherche -->
      <div class="filters-bar">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTerm" 
            (ngModelChange)="onSearchChange()"
            placeholder="🔍 Rechercher par nom, email, username..."
          >
        </div>
        <div class="filter-group">
          <select [(ngModel)]="filterRole" (ngModelChange)="applyFilters()">
            <option value="">Tous les rôles</option>
            <option value="ADMIN">Administrateur</option>
            <option value="TUTOR">Tuteur</option>
            <option value="STUDENT">Étudiant</option>
          </select>
          <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilters()">
            <option value="">Tous les statuts</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
          <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
            <option value="createdAt">Date de création</option>
            <option value="username">Nom d'utilisateur</option>
            <option value="email">Email</option>
            <option value="role">Rôle</option>
          </select>
          <select [(ngModel)]="sortOrder" (ngModelChange)="applyFilters()">
            <option value="desc">Décroissant</option>
            <option value="asc">Croissant</option>
          </select>
        </div>
      </div>
      
      <div class="table-container">
        <div *ngIf="loading" class="loading">Chargement...</div>
        <table *ngIf="!loading">
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td><strong>{{user.username}}</strong></td>
              <td>{{user.firstName}} {{user.lastName}}</td>
              <td>{{user.email}}</td>
              <td><span class="badge" [class]="'badge-' + user.role.toLowerCase()">{{user.role}}</span></td>
              <td>
                <span class="status" [class.active]="user.isActive">
                  {{user.isActive ? 'Actif' : 'Inactif'}}
                </span>
              </td>
              <td>{{formatDate(user.createdAt)}}</td>
              <td>
                <button *ngIf="canManageUsers()" class="btn-edit" (click)="editUser(user)" title="Modifier">✏️</button>
                <button 
                  *ngIf="canManageUsers()" 
                  class="btn-toggle" 
                  [class.active]="user.isActive"
                  (click)="toggleUserStatus(user)" 
                  title="{{user.isActive ? 'Désactiver' : 'Activer'}}">
                  {{user.isActive ? '🔓' : '🔒'}}
                </button>
              </td>
            </tr>
            <tr *ngIf="users.length === 0">
              <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                Aucun utilisateur trouvé
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{editMode ? 'Modifier' : 'Nouvel'}} utilisateur</h2>
          <form (ngSubmit)="saveUser()">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="currentUser.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="currentUser.lastName" name="lastName" required>
              </div>
            </div>
            <div class="form-group">
              <label>Nom d'utilisateur</label>
              <input type="text" [(ngModel)]="currentUser.username" name="username" required [disabled]="editMode">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="currentUser.email" name="email" required>
            </div>
            <div class="form-group" *ngIf="!editMode">
              <label>Mot de passe</label>
              <input type="password" [(ngModel)]="currentUser.password" name="password" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Rôle</label>
                <select [(ngModel)]="currentUser.role" name="role" required>
                  <option value="STUDENT">Étudiant</option>
                  <option value="TUTOR">Tuteur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
              <div class="form-group" *ngIf="editMode">
                <label>Statut</label>
                <select [(ngModel)]="currentUser.isActive" name="isActive">
                  <option [value]="true">Actif</option>
                  <option [value]="false">Inactif</option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary">{{editMode ? 'Modifier' : 'Créer'}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .page-header h1 { color: white; margin: 0; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .stat-card h3 { font-size: 36px; margin: 0 0 10px 0; }
    .stat-card.admin h3 { color: #f44336; }
    .stat-card.tutor h3 { color: #2196f3; }
    .stat-card.student h3 { color: #4caf50; }
    .stat-card.total h3 { color: #9c27b0; }
    .stat-card p { color: #666; margin: 0; }
    
    .filters-bar { background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .search-box { margin-bottom: 15px; }
    .search-box input { width: 100%; padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 25px; font-size: 14px; }
    .search-box input:focus { outline: none; border-color: #667eea; }
    .filter-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
    .filter-group select { padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; background: white; cursor: pointer; }
    .filter-group select:focus { outline: none; border-color: #667eea; }
    
    .table-container { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow-x: auto; }
    .loading { text-align: center; padding: 40px; color: #999; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 15px; border-bottom: 2px solid #e0e0e0; color: #333; font-weight: 600; }
    td { padding: 15px; border-bottom: 1px solid #f0f0f0; }
    tr:hover { background: #f8f9fa; }
    .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-admin { background: #ffebee; color: #c62828; }
    .badge-tutor { background: #e3f2fd; color: #1565c0; }
    .badge-student { background: #e8f5e9; color: #2e7d32; }
    .status { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status.active { background: #e8f5e9; color: #2e7d32; }
    .status:not(.active) { background: #ffebee; color: #c62828; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-secondary { background: #e0e0e0; color: #333; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-edit { background: #4caf50; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 5px; }
    .btn-toggle { background: #ff9800; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
    .btn-toggle.active { background: #4caf50; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .modal-content h2 { margin: 0 0 20px 0; color: #333; }
    .form-group { margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; }
    input, select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    input:focus, select:focus { outline: none; border-color: #667eea; }
    input:disabled { background: #f5f5f5; cursor: not-allowed; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
  `]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  stats: any = { total: 0, active: 0, inactive: 0, byRole: {} };
  showModal = false;
  editMode = false;
  currentUser: any = {};
  loading = false;
  
  // Filtres
  searchTerm = '';
  filterRole = '';
  filterStatus = '';
  sortBy = 'createdAt';
  sortOrder = 'desc';
  searchTimeout: any;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('UsersComponent initialized');
    this.loadStats();
    this.loadUsers();
  }

  loadStats() {
    this.http.get<any>('http://localhost:8080/api/auth/users/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadUsers() {
    console.log('Loading users...');
    this.loading = true;
    
    // Construire les paramètres de requête
    let params = `?sortBy=${this.sortBy}&sortOrder=${this.sortOrder}`;
    if (this.searchTerm) params += `&search=${encodeURIComponent(this.searchTerm)}`;
    if (this.filterRole) params += `&role=${this.filterRole}`;
    if (this.filterStatus) params += `&isActive=${this.filterStatus}`;
    
    this.http.get<any[]>(`http://localhost:8080/api/auth/users${params}`).subscribe({
      next: (data) => {
        console.log('Users loaded:', data);
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange() {
    // Debounce la recherche
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  applyFilters() {
    this.loadUsers();
    this.loadStats();
  }

  toggleUserStatus(user: any) {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activer' : 'désactiver';
    
    if (confirm(`Voulez-vous ${action} l'utilisateur ${user.username} ?`)) {
      this.http.put(`http://localhost:8080/api/auth/users/${user.id}`, { isActive: newStatus })
        .subscribe({
          next: () => {
            user.isActive = newStatus;
            this.loadStats();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error:', err);
            alert('Erreur lors de la modification du statut');
          }
        });
    }
  }

  openModal() {
    this.editMode = false;
    this.currentUser = { role: 'STUDENT', isActive: true };
    this.showModal = true;
  }

  editUser(user: any) {
    this.editMode = true;
    this.currentUser = { ...user };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    if (this.editMode) {
      this.http.put(`http://localhost:8080/api/auth/users/${this.currentUser.id}`, this.currentUser)
        .subscribe({
          next: () => {
            this.loadUsers();
            this.loadStats();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error:', err);
            alert(err.error?.error || 'Erreur lors de la modification');
          }
        });
    } else {
      this.http.post('http://localhost:8080/api/auth/register', this.currentUser)
        .subscribe({
          next: () => {
            this.loadUsers();
            this.loadStats();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error:', err);
            alert(err.error?.error || 'Erreur lors de la création');
          }
        });
    }
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString('fr-FR') : '-';
  }

  canManageUsers(): boolean {
    return this.authService.canManageUsers();
  }
}
