import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-courses-container">
      <div class="page-header">
        <h1>📚 Mes Cours</h1>
      </div>

      <!-- Mes cours inscrits -->
      <div class="section">
        <h2>Cours auxquels je suis inscrit</h2>
        
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Chargement...</p>
        </div>

        <div *ngIf="!loading && myCourses.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <p>Vous n'êtes inscrit à aucun cours pour le moment</p>
          <button class="btn-primary" (click)="showAvailableCourses = true">Parcourir les cours disponibles</button>
        </div>

        <div class="courses-grid" *ngIf="!loading && myCourses.length > 0">
          <div class="course-card enrolled" *ngFor="let course of myCourses">
            <div class="course-header">
              <span class="badge" [class]="'badge-' + course.level.toLowerCase()">{{getLevelLabel(course.level)}}</span>
              <span class="enrolled-badge">✓ Inscrit</span>
            </div>
            <h3>{{course.title}}</h3>
            <p class="course-instructor">👨‍🏫 {{course.instructor}}</p>
            <p class="course-description">{{course.description}}</p>
            <div class="course-footer">
              <span class="course-duration">⏱️ {{course.durationHours}}h</span>
              <button class="btn-danger-outline" (click)="unenrollFromCourse(course.id)">
                Se désinscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cours disponibles -->
      <div class="section" *ngIf="showAvailableCourses || myCourses.length > 0">
        <div class="section-header">
          <h2>Cours disponibles</h2>
          <button class="btn-secondary" (click)="showAvailableCourses = !showAvailableCourses">
            {{showAvailableCourses ? 'Masquer' : 'Afficher'}}
          </button>
        </div>

        <div class="courses-grid" *ngIf="showAvailableCourses">
          <div class="course-card" *ngFor="let course of availableCourses">
            <div class="course-header">
              <span class="badge" [class]="'badge-' + course.level.toLowerCase()">{{getLevelLabel(course.level)}}</span>
            </div>
            <h3>{{course.title}}</h3>
            <p class="course-instructor">👨‍🏫 {{course.instructor}}</p>
            <p class="course-description">{{course.description}}</p>
            <div class="course-footer">
              <span class="course-duration">⏱️ {{course.durationHours}}h</span>
              <button class="btn-primary" (click)="enrollInCourse(course.id)">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast de succès -->
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
    .my-courses-container {
      margin-left: 280px;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f1629 0%, #1a1f3a 100%);
      padding: 32px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0;
    }

    .section {
      margin-bottom: 48px;
    }

    .section h2 {
      font-size: 24px;
      font-weight: 600;
      color: white;
      margin: 0 0 24px 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .loading {
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

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .empty-state svg {
      color: rgba(255, 255, 255, 0.3);
      margin-bottom: 16px;
    }

    .empty-state p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 24px 0;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .course-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }

    .course-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    }

    .course-card.enrolled {
      border-color: rgba(102, 126, 234, 0.3);
      background: rgba(102, 126, 234, 0.05);
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-beginner {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }

    .badge-intermediate {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
    }

    .badge-advanced {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .enrolled-badge {
      padding: 6px 12px;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }

    .course-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0 0 8px 0;
    }

    .course-instructor {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 12px 0;
    }

    .course-description {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 16px 0;
      line-height: 1.6;
    }

    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .course-duration {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }

    .btn-primary, .btn-secondary, .btn-danger-outline {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .btn-danger-outline {
      background: transparent;
      color: #f87171;
      border: 1px solid rgba(248, 113, 113, 0.3);
    }

    .btn-danger-outline:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(248, 113, 113, 0.5);
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

    @media (max-width: 1024px) {
      .my-courses-container {
        margin-left: 240px;
      }
    }

    @media (max-width: 768px) {
      .my-courses-container {
        margin-left: 0;
        padding: 20px;
      }

      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyCoursesComponent implements OnInit {
  myCourses: any[] = [];
  availableCourses: any[] = [];
  loading = true;
  showAvailableCourses = false;
  successMessage = '';
  studentId: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Récupérer l'ID de l'étudiant depuis le username
    const username = this.authService.getUserInfo().username;
    this.loadStudentData(username);
  }

  loadStudentData(username: string) {
    // Charger les données de l'étudiant
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (students) => {
        console.log('All students:', students);
        console.log('Looking for email:', this.authService.getUserInfo().email);
        console.log('Looking for username:', username);
        
        // Essayer de trouver par email ou username
        const student = students.find(s => 
          s.email === this.authService.getUserInfo().email || 
          s.email?.toLowerCase().includes(username.toLowerCase())
        );
        
        if (student) {
          console.log('Student found:', student);
          this.studentId = student.id;
          this.loadMyCourses();
        } else {
          // Si l'étudiant n'existe pas, utiliser le premier étudiant pour la démo
          console.warn('Student not found, using first student for demo');
          if (students.length > 0) {
            this.studentId = students[0].id;
            this.loadMyCourses();
          } else {
            this.loading = false;
            console.error('No students in database');
          }
        }
      },
      error: (err) => {
        console.error('Error loading student:', err);
        this.loading = false;
      }
    });
  }

  loadMyCourses() {
    this.loading = true;
    this.http.get<any>(`http://localhost:8080/api/students/${this.studentId}/courses`).subscribe({
      next: (data) => {
        this.myCourses = data.courses || [];
        this.loadAllCourses();
      },
      error: (err) => {
        console.error('Error loading my courses:', err);
        this.loading = false;
      }
    });
  }

  loadAllCourses() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (courses) => {
        // Filtrer les cours auxquels l'étudiant n'est pas inscrit
        const enrolledIds = this.myCourses.map(c => c.id);
        this.availableCourses = courses.filter(c => !enrolledIds.includes(c.id));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loading = false;
      }
    });
  }

  enrollInCourse(courseId: number) {
    this.http.post(`http://localhost:8080/api/students/${this.studentId}/courses/${courseId}`, {}).subscribe({
      next: () => {
        this.showSuccess('Inscription réussie!');
        this.loadMyCourses();
      },
      error: (err) => {
        console.error('Error enrolling:', err);
        alert('Erreur lors de l\'inscription');
      }
    });
  }

  unenrollFromCourse(courseId: number) {
    if (confirm('Êtes-vous sûr de vouloir vous désinscrire de ce cours ?')) {
      this.http.delete(`http://localhost:8080/api/students/${this.studentId}/courses/${courseId}`).subscribe({
        next: () => {
          this.showSuccess('Désinscription réussie!');
          this.loadMyCourses();
        },
        error: (err) => {
          console.error('Error unenrolling:', err);
          alert('Erreur lors de la désinscription');
        }
      });
    }
  }

  getLevelLabel(level: string): string {
    switch(level) {
      case 'BEGINNER': return 'Débutant';
      case 'INTERMEDIATE': return 'Intermédiaire';
      case 'ADVANCED': return 'Avancé';
      default: return level;
    }
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }
}
