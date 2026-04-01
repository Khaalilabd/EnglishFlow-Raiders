import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentsService, Student } from '../services/students.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="students-container">
      <!-- Header -->
      <div class="header">
        <h1>
          <i class="fas fa-user-graduate"></i>
          Gestion des Étudiants
        </h1>
        <button *ngIf="canManageStudents()" class="btn-primary" (click)="openAddModal()">
          <i class="fas fa-plus"></i>
          Ajouter un étudiant
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Rechercher par nom, prénom ou email..."
          [(ngModel)]="searchTerm"
          (input)="filterStudents()"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des étudiants...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>

      <!-- Students Table -->
      <div *ngIf="!loading && !error" class="table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let student of filteredStudents" class="student-row">
              <td>{{ student.id }}</td>
              <td>{{ student.firstName }}</td>
              <td>{{ student.lastName }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.enrollmentDate | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button *ngIf="canManageStudents()" class="btn-icon btn-edit" (click)="openEditModal(student)" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button *ngIf="canManageStudents()" class="btn-icon btn-delete" (click)="confirmDelete(student)" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredStudents.length === 0">
              <td colspan="6" class="no-data">
                <i class="fas fa-inbox"></i>
                <p>Aucun étudiant trouvé</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas" [ngClass]="isEditMode ? 'fa-edit' : 'fa-plus'"></i>
              {{ isEditMode ? 'Modifier l\'étudiant' : 'Ajouter un étudiant' }}
            </h2>
            <button class="btn-close" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form (ngSubmit)="saveStudent()" class="modal-form">
            <div class="form-group">
              <label for="firstName">
                <i class="fas fa-user"></i>
                Prénom *
              </label>
              <input 
                type="text" 
                id="firstName"
                [(ngModel)]="currentStudent.firstName"
                name="firstName"
                required
                placeholder="Entrez le prénom"
              />
            </div>

            <div class="form-group">
              <label for="lastName">
                <i class="fas fa-user"></i>
                Nom *
              </label>
              <input 
                type="text" 
                id="lastName"
                [(ngModel)]="currentStudent.lastName"
                name="lastName"
                required
                placeholder="Entrez le nom"
              />
            </div>

            <div class="form-group">
              <label for="email">
                <i class="fas fa-envelope"></i>
                Email *
              </label>
              <input 
                type="email" 
                id="email"
                [(ngModel)]="currentStudent.email"
                name="email"
                required
                placeholder="exemple@email.com"
              />
            </div>

            <div class="form-group">
              <label for="enrollmentDate">
                <i class="fas fa-calendar"></i>
                Date d'inscription
              </label>
              <input 
                type="date" 
                id="enrollmentDate"
                [(ngModel)]="currentStudent.enrollmentDate"
                name="enrollmentDate"
              />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">
                Annuler
              </button>
              <button type="submit" class="btn-primary" [disabled]="saving">
                <i class="fas" [ngClass]="saving ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="closeDeleteModal()">
        <div class="modal-content modal-small" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas fa-exclamation-triangle"></i>
              Confirmer la suppression
            </h2>
          </div>

          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer l'étudiant :</p>
            <p class="student-name">{{ studentToDelete?.firstName }} {{ studentToDelete?.lastName }}</p>
            <p class="warning">Cette action est irréversible.</p>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" (click)="closeDeleteModal()">
              Annuler
            </button>
            <button type="button" class="btn-danger" (click)="deleteStudent()" [disabled]="deleting">
              <i class="fas" [ngClass]="deleting ? 'fa-spinner fa-spin' : 'fa-trash'"></i>
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="success-toast">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>
    </div>
  `,
  styles: [`
    .students-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header h1 i {
      color: #6366f1;
    }

    .search-bar {
      position: relative;
      margin-bottom: 2rem;
    }

    .search-bar i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }

    .search-bar input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .search-bar input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    }

    .table-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .students-table {
      width: 100%;
      border-collapse: collapse;
    }

    .students-table thead {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
    }

    .students-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
    }

    .students-table td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .student-row {
      transition: all 0.3s;
    }

    .student-row:hover {
      background: #f9fafb;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.5rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-edit {
      background: #3b82f6;
      color: white;
    }

    .btn-edit:hover {
      background: #2563eb;
      transform: scale(1.1);
    }

    .btn-delete {
      background: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s;
    }

    .modal-small {
      max-width: 400px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-header h2 {
      font-size: 1.5rem;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      transition: color 0.3s;
    }

    .btn-close:hover {
      color: #1a1a2e;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-group input {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      background: white;
      color: #374151;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .btn-danger {
      flex: 1;
      padding: 0.75rem;
      border: none;
      background: #ef4444;
      color: white;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .modal-body {
      padding: 1rem 0;
    }

    .student-name {
      font-weight: 600;
      color: #6366f1;
      font-size: 1.125rem;
      margin: 0.5rem 0;
    }

    .warning {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .loading {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      border: 4px solid #f3f4f6;
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .success-toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: slideInRight 0.3s;
      z-index: 1001;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #6b7280;
    }

    .no-data i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  
  currentStudent: Student = this.getEmptyStudent();
  studentToDelete: Student | null = null;
  
  loading: boolean = false;
  saving: boolean = false;
  deleting: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(
    private studentsService: StudentsService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('StudentsComponent initialized');
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    this.studentsService.getAllStudents().subscribe({
      next: (data) => {
        console.log('Students loaded:', data);
        this.students = data;
        this.filteredStudents = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.error = 'Erreur lors du chargement des étudiants';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterStudents() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.firstName.toLowerCase().includes(term) ||
      student.lastName.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.isEditMode = false;
    this.currentStudent = this.getEmptyStudent();
    this.showModal = true;
  }

  openEditModal(student: Student) {
    this.isEditMode = true;
    this.currentStudent = { ...student };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentStudent = this.getEmptyStudent();
  }

  saveStudent() {
    this.saving = true;
    this.cdr.detectChanges();
    
    if (this.isEditMode && this.currentStudent.id) {
      console.log('Updating student:', this.currentStudent);
      this.studentsService.updateStudent(this.currentStudent.id, this.currentStudent).subscribe({
        next: (response) => {
          console.log('Student updated successfully:', response);
          this.showSuccess('Étudiant modifié avec succès');
          this.saving = false;
          this.closeModal();
          this.loadStudents();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error updating student:', err);
          this.error = 'Erreur lors de la modification';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.log('Creating student:', this.currentStudent);
      this.studentsService.createStudent(this.currentStudent).subscribe({
        next: (response) => {
          console.log('Student created successfully:', response);
          this.showSuccess('Étudiant ajouté avec succès');
          this.saving = false;
          this.closeModal();
          this.loadStudents();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error creating student:', err);
          this.error = 'Erreur lors de l\'ajout';
          this.saving = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  confirmDelete(student: Student) {
    this.studentToDelete = student;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.studentToDelete = null;
  }

  deleteStudent() {
    if (!this.studentToDelete?.id) return;
    
    this.deleting = true;
    this.cdr.detectChanges();
    
    console.log('Deleting student:', this.studentToDelete.id);
    this.studentsService.deleteStudent(this.studentToDelete.id).subscribe({
      next: () => {
        console.log('Student deleted successfully');
        this.showSuccess('Étudiant supprimé avec succès');
        this.deleting = false;
        this.closeDeleteModal();
        this.loadStudents();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting student:', err);
        this.error = 'Erreur lors de la suppression';
        this.deleting = false;
        this.cdr.detectChanges();
      }
    });
  }

  showSuccess(message: string) {
    this.successMessage = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  getEmptyStudent(): Student {
    return {
      firstName: '',
      lastName: '',
      email: '',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
  }

  canManageStudents(): boolean {
    return this.authService.canManageStudents();
  }
}
