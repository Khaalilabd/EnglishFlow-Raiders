import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📝 Gestion des Inscriptions</h1>
        <button *ngIf="canManageEnrollments()" class="btn-primary" (click)="openModal()">+ Nouvelle inscription</button>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>{{enrollments.length}}</h3>
          <p>Total Inscriptions</p>
        </div>
        <div class="stat-card">
          <h3>{{students.length}}</h3>
          <p>Étudiants</p>
        </div>
        <div class="stat-card">
          <h3>{{courses.length}}</h3>
          <p>Cours</p>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Email</th>
              <th>Cours</th>
              <th>Niveau</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let enrollment of enrollments">
              <td><strong>{{enrollment.studentName}}</strong></td>
              <td>{{enrollment.studentEmail}}</td>
              <td>{{enrollment.courseTitle}}</td>
              <td><span class="badge" [class]="'badge-' + enrollment.courseLevel.toLowerCase()">{{enrollment.courseLevel}}</span></td>
              <td>{{formatDate(enrollment.enrollmentDate)}}</td>
              <td>
                <button *ngIf="canManageEnrollments()" class="btn-delete" (click)="deleteEnrollment(enrollment)">🗑️ Désinscrire</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div *ngIf="enrollments.length === 0" class="no-data">
          Aucune inscription pour le moment
        </div>
      </div>
      
      <!-- Modal Inscription -->
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Nouvelle inscription</h2>
          <form (ngSubmit)="saveEnrollment()">
            <div class="form-group">
              <label>Étudiant</label>
              <select [(ngModel)]="selectedStudentId" name="student" required>
                <option value="">Sélectionner un étudiant</option>
                <option *ngFor="let student of students" [value]="student.id">
                  {{student.firstName}} {{student.lastName}} ({{student.email}})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Cours</label>
              <select [(ngModel)]="selectedCourseId" name="course" required>
                <option value="">Sélectionner un cours</option>
                <option *ngFor="let course of courses" [value]="course.id">
                  {{course.title}} - {{course.level}} ({{course.durationHours}}h)
                </option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary">Inscrire</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .page-header h1 {
      color: white;
      margin: 0;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: white;
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .stat-card h3 {
      font-size: 36px;
      color: #667eea;
      margin: 0 0 10px 0;
    }
    
    .stat-card p {
      color: #666;
      margin: 0;
    }
    
    .table-container {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      text-align: left;
      padding: 15px;
      border-bottom: 2px solid #e0e0e0;
      color: #333;
      font-weight: 600;
    }
    
    td {
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    tr:hover {
      background: #f8f9fa;
    }
    
    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .badge-beginner { background: #e3f2fd; color: #1976d2; }
    .badge-intermediate { background: #fff3e0; color: #f57c00; }
    .badge-advanced { background: #fce4ec; color: #c2185b; }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: #e0e0e0;
      color: #333;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }
    
    .btn-delete {
      background: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 15px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .modal-content h2 {
      margin: 0 0 20px 0;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
    }
    
    select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
    }
    
    select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
    }
  `]
})
export class EnrollmentsComponent implements OnInit {
  students: any[] = [];
  courses: any[] = [];
  enrollments: any[] = [];
  showModal = false;
  selectedStudentId: any = '';
  selectedCourseId: any = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('EnrollmentsComponent initialized');
    this.loadData();
  }

  loadData() {
    this.loadStudents();
    this.loadCourses();
    this.loadEnrollments();
  }

  loadStudents() {
    console.log('Loading students...');
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (data) => {
        console.log('Students loaded:', data);
        this.students = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading students:', err)
    });
  }

  loadCourses() {
    console.log('Loading courses...');
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (data) => {
        console.log('Courses loaded:', data);
        this.courses = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading courses:', err)
    });
  }

  loadEnrollments() {
    console.log('Loading enrollments...');
    // Charger toutes les inscriptions
    this.enrollments = [];
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (students) => {
        console.log('Loading enrollments for students:', students);
        students.forEach(student => {
          this.http.get<any>(`http://localhost:8080/api/students/${student.id}/courses`).subscribe({
            next: (data) => {
              data.courses.forEach((course: any) => {
                this.enrollments.push({
                  studentId: student.id,
                  studentName: `${student.firstName} ${student.lastName}`,
                  studentEmail: student.email,
                  courseId: course.id,
                  courseTitle: course.title,
                  courseLevel: course.level,
                  enrollmentDate: student.enrollmentDate
                });
              });
              this.cdr.detectChanges();
            }
          });
        });
      }
    });
  }

  openModal() {
    this.selectedStudentId = '';
    this.selectedCourseId = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveEnrollment() {
    if (!this.selectedStudentId || !this.selectedCourseId) {
      alert('Veuillez sélectionner un étudiant et un cours');
      return;
    }

    // Appel API pour inscrire l'étudiant au cours
    this.http.post(`http://localhost:8080/api/students/${this.selectedStudentId}/courses/${this.selectedCourseId}`, {})
      .subscribe({
        next: () => {
          alert('Inscription réussie!');
          this.loadEnrollments();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error enrolling student:', err);
          alert('Erreur lors de l\'inscription');
        }
      });
  }

  deleteEnrollment(enrollment: any) {
    if (confirm(`Désinscrire ${enrollment.studentName} du cours ${enrollment.courseTitle} ?`)) {
      this.http.delete(`http://localhost:8080/api/students/${enrollment.studentId}/courses/${enrollment.courseId}`)
        .subscribe({
          next: () => {
            alert('Désinscription réussie!');
            this.loadEnrollments();
          },
          error: (err) => {
            console.error('Error unenrolling student:', err);
            alert('Erreur lors de la désinscription');
          }
        });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  canManageEnrollments(): boolean {
    return this.authService.canManageEnrollments();
  }
}
