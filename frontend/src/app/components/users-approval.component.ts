import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>👥 Approbation des Utilisateurs</h1>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'; filterUsers()">
          En attente ({{pendingUsers.length}})
        </button>
        <button class="tab" [class.active]="activeTab === 'approved'" (click)="activeTab = 'approved'; filterUsers()">
          Approuvés ({{approvedUsers.length}})
        </button>
        <button class="tab" [class.active]="activeTab === 'all'" (click)="activeTab = 'all'; filterUsers()">
          Tous ({{allUsers.length}})
        </button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Nom complet</th>
              <th>Rôle</th>
              <th>Date d'inscription</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of displayedUsers">
              <td>{{user.username}}</td>
              <td>{{user.email}}</td>
              <td>{{user.firstName}} {{user.lastName}}</td>
              <td><span class="badge badge-{{user.role.toLowerCase()}}">{{user.role}}</span></td>
              <td>{{user.createdAt | date:'dd/MM/yyyy HH:mm'}}</td>
              <td>
                <span class="status" [class.approved]="user.isApproved" [class.pending]="!user.isApproved">
                  {{user.isApproved ? '✓ Approuvé' : '⏳ En attente'}}
                </span>
              </td>
              <td>
                <button *ngIf="!user.isApproved && user.role === 'STUDENT'" 
                        class="btn-approve" 
                        (click)="approveUser(user)">
                  ✓ Approuver
                </button>
                <span *ngIf="user.isApproved" class="approved-text">Déjà approuvé</span>
                <span *ngIf="user.role !== 'STUDENT'" class="info-text">Non applicable</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
    .page-header { margin-bottom: 30px; }
    .page-header h1 { color: white; margin: 0; }
    
    .tabs { display: flex; gap: 10px; margin-bottom: 30px; }
    .tab { 
      padding: 12px 24px; 
      background: rgba(255,255,255,0.1); 
      color: white; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer; 
      font-weight: 600;
      transition: all 0.3s;
    }
    .tab:hover { background: rgba(255,255,255,0.2); }
    .tab.active { background: white; color: #667eea; }
    
    .table-container { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    th { padding: 15px; text-align: left; font-weight: 600; }
    td { padding: 15px; border-bottom: 1px solid #f0f0f0; }
    tr:hover { background: #f8f9fa; }
    
    .badge { 
      padding: 6px 12px; 
      border-radius: 20px; 
      font-size: 12px; 
      font-weight: 600; 
    }
    .badge-student { background: #e3f2fd; color: #1976d2; }
    .badge-tutor { background: #fff3e0; color: #f57c00; }
    .badge-admin { background: #fce4ec; color: #c2185b; }
    
    .status { 
      padding: 6px 12px; 
      border-radius: 20px; 
      font-size: 13px; 
      font-weight: 600; 
    }
    .status.approved { background: #e8f5e9; color: #388e3c; }
    .status.pending { background: #fff3e0; color: #f57c00; }
    
    .btn-approve { 
      background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
      color: white; 
      border: none; 
      padding: 8px 16px; 
      border-radius: 8px; 
      cursor: pointer; 
      font-weight: 600;
      transition: all 0.3s;
    }
    .btn-approve:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); }
    
    .approved-text { color: #388e3c; font-weight: 600; }
    .info-text { color: #999; font-style: italic; }
  `]
})
export class UsersApprovalComponent implements OnInit {
  allUsers: any[] = [];
  students: any[] = [];
  pendingUsers: any[] = [];
  approvedUsers: any[] = [];
  displayedUsers: any[] = [];
  activeTab: 'pending' | 'approved' | 'all' = 'pending';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les utilisateurs
    this.http.get<any[]>('http://localhost:8080/api/auth/users').subscribe({
      next: (users) => {
        this.allUsers = users;
        this.loadStudents();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadStudents() {
    // Charger les étudiants approuvés
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (students) => {
        this.students = students;
        this.categorizeUsers();
      },
      error: (err) => console.error('Error loading students:', err)
    });
  }

  categorizeUsers() {
    // Marquer les utilisateurs comme approuvés s'ils existent dans la table students
    this.allUsers = this.allUsers.map(user => ({
      ...user,
      isApproved: this.students.some(s => s.email === user.email)
    }));

    this.pendingUsers = this.allUsers.filter(u => !u.isApproved && u.role === 'STUDENT');
    this.approvedUsers = this.allUsers.filter(u => u.isApproved);
    
    this.filterUsers();
  }

  filterUsers() {
    switch(this.activeTab) {
      case 'pending':
        this.displayedUsers = this.pendingUsers;
        break;
      case 'approved':
        this.displayedUsers = this.approvedUsers;
        break;
      case 'all':
        this.displayedUsers = this.allUsers;
        break;
    }
    this.cdr.detectChanges();
  }

  approveUser(user: any) {
    if (confirm(`Approuver ${user.firstName} ${user.lastName} comme étudiant ?`)) {
      this.http.post(`http://localhost:8080/api/auth/users/${user.id}/approve`, {}).subscribe({
        next: () => {
          alert('Utilisateur approuvé avec succès!');
          this.loadData();
        },
        error: (err) => {
          console.error('Error approving user:', err);
          alert('Erreur lors de l\'approbation');
        }
      });
    }
  }
}
