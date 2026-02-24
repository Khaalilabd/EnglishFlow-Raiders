import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>👥 Gestion des Étudiants</h1>
        <button class="btn-primary" (click)="openModal()">+ Ajouter un étudiant</button>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>{{students.length}}</h3>
          <p>Total Étudiants</p>
        </div>
        <div class="stat-card">
          <h3>{{getTotalEnrollments()}}</h3>
          <p>Inscriptions</p>
        </div>
        <div class="stat-card">
          <h3>{{getAverageCoursesPerStudent()}}</h3>
          <p>Cours/Étudiant</p>
        </div>
      </div>
      
      <div class="cards-grid">
        <div class="student-card" *ngFor="let student of students">
          <div class="student-header">
            <div class="avatar">{{getInitials(student)}}</div>
            <div class="student-info">
              <h3>{{student.firstName}} {{student.lastName}}</h3>
              <p>{{student.email}}</p>
            </div>
          </div>
          <div class="student-body">
            <p class="enrollment-date">📅 Inscrit le {{formatDate(student.enrollmentDate)}}</p>
            <button class="btn-view" (click)="viewStudentCourses(student)">
              📚 Voir les cours ({{getStudentCoursesCount(student.id)}})
            </button>
          </div>
          <div class="student-actions">
            <button class="btn-edit" (click)="editStudent(student)">✏️</button>
            <button class="btn-delete" (click)="deleteStudent(student.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <!-- Modal Formulaire -->
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{editMode ? 'Modifier' : 'Ajouter'}} un étudiant</h2>
          <form (ngSubmit)="saveStudent()">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="currentStudent.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="currentStudent.lastName" name="lastName" required>
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="currentStudent.email" name="email" required>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary">{{editMode ? 'Modifier' : 'Créer'}}</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Modal Cours de l'étudiant (OpenFeign) -->
      <div class="modal" *ngIf="showCoursesModal" (click)="closeCoursesModal()">
        <div class="modal-content large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>🔗 Cours de {{selectedStudentData?.student.firstName}} {{selectedStudentData?.student.lastName}}</h2>
            <p class="openfeign-badge">Communication OpenFeign : Student Service → Courses Service</p>
          </div>
          <div class="courses-list" *ngIf="selectedStudentData">
            <div class="course-item" *ngFor="let course of selectedStudentData.courses">
              <div class="course-icon">📚</div>
              <div class="course-details">
                <h4>{{course.title}}</h4>
                <p>{{course.description}}</p>
                <div class="course-meta">
                  <span>👨‍🏫 {{course.instructor}}</span>
                  <span>⏱️ {{course.durationHours}}h</span>
                  <span class="badge" [class]="'badge-' + course.level.toLowerCase()">{{course.level}}</span>
                </div>
              </div>
            </div>
            <div *ngIf="selectedStudentData.courses.length === 0" class="no-courses">
              Aucun cours inscrit
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="closeCoursesModal()">Fermer</button>
          </div>
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
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    
    .student-card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      position: relative;
    }
    
    .student-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }
    
    .student-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
    }
    
    .student-info h3 {
      margin: 0 0 5px 0;
      color: #333;
    }
    
    .student-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .student-body {
      margin: 15px 0;
    }
    
    .enrollment-date {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
    }
    
    .btn-view {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .btn-view:hover {
      transform: scale(1.02);
    }
    
    .student-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #f0f0f0;
    }
    
    .btn-edit, .btn-delete {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.2s;
    }
    
    .btn-edit {
      background: #4caf50;
      color: white;
    }
    
    .btn-delete {
      background: #f44336;
      color: white;
    }
    
    .btn-edit:hover, .btn-delete:hover {
      transform: scale(1.05);
    }
    
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
    
    .modal-content.large {
      max-width: 800px;
    }
    
    .modal-header {
      margin-bottom: 20px;
    }
    
    .modal-content h2 {
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .openfeign-badge {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
    }
    
    .courses-list {
      margin: 20px 0;
    }
    
    .course-item {
      display: flex;
      gap: 15px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 10px;
      margin-bottom: 15px;
      border-left: 4px solid #667eea;
    }
    
    .course-icon {
      font-size: 32px;
    }
    
    .course-details h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .course-details p {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }
    
    .course-meta {
      display: flex;
      gap: 15px;
      font-size: 14px;
      color: #666;
    }
    
    .badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .badge-beginner { background: #e3f2fd; color: #1976d2; }
    .badge-intermediate { background: #fff3e0; color: #f57c00; }
    .badge-advanced { background: #fce4ec; color: #c2185b; }
    
    .no-courses {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
    }
    
    input:focus {
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
export class StudentsComponent implements OnInit {
  students: any[] = [];
  studentCourses: Map<number, number> = new Map();
  showModal = false;
  showCoursesModal = false;
  editMode = false;
  currentStudent: any = {};
  selectedStudentData: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (data) => {
        this.students = data;
        console.log('Students loaded:', data);
        // Charger le nombre de cours pour chaque étudiant
        this.students.forEach(student => {
          this.http.get<any>(`http://localhost:8080/api/students/${student.id}/courses`).subscribe({
            next: (data) => this.studentCourses.set(student.id, data.courses.length),
            error: (err) => console.error('Error loading student courses:', err)
          });
        });
      },
      error: (err) => {
        console.error('Error loading students:', err);
        alert('Erreur lors du chargement des étudiants');
      }
    });
  }

  getInitials(student: any): string {
    return (student.firstName[0] + student.lastName[0]).toUpperCase();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getStudentCoursesCount(studentId: number): number {
    return this.studentCourses.get(studentId) || 0;
  }

  getTotalEnrollments(): number {
    let total = 0;
    this.studentCourses.forEach(count => total += count);
    return total;
  }

  getAverageCoursesPerStudent(): string {
    if (this.students.length === 0) return '0';
    return (this.getTotalEnrollments() / this.students.length).toFixed(1);
  }

  openModal() {
    this.editMode = false;
    this.currentStudent = {};
    this.showModal = true;
  }

  editStudent(student: any) {
    this.editMode = true;
    this.currentStudent = { ...student };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentStudent = {};
  }

  saveStudent() {
    // Validation
    if (!this.currentStudent.firstName || !this.currentStudent.lastName || !this.currentStudent.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.editMode) {
      this.http.put(`http://localhost:8080/api/students/${this.currentStudent.id}`, this.currentStudent)
        .subscribe({
          next: () => {
            this.loadStudents();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating student:', err);
            alert('Erreur lors de la modification de l\'étudiant');
          }
        });
    } else {
      // Create - Remove id and add enrollmentDate
      const studentData = {
        firstName: this.currentStudent.firstName,
        lastName: this.currentStudent.lastName,
        email: this.currentStudent.email,
        enrollmentDate: new Date().toISOString().split('T')[0]
      };
      
      this.http.post('http://localhost:8080/api/students', studentData)
        .subscribe({
          next: () => {
            this.loadStudents();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error creating student:', err);
            alert('Erreur lors de la création de l\'étudiant');
          }
        });
    }
  }

  deleteStudent(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.http.delete(`http://localhost:8080/api/students/${id}`)
        .subscribe(() => this.loadStudents());
    }
  }

  viewStudentCourses(student: any) {
    this.http.get<any>(`http://localhost:8080/api/students/${student.id}/courses`).subscribe({
      next: (data) => {
        this.selectedStudentData = data;
        this.showCoursesModal = true;
      }
    });
  }

  closeCoursesModal() {
    this.showCoursesModal = false;
    this.selectedStudentData = null;
  }
}
