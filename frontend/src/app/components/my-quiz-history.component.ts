import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-quiz-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📊 Mon Historique de Quiz</h1>
      </div>

      <div class="history-grid">
        <div class="history-card" *ngFor="let attempt of attempts">
          <div class="card-header">
            <h3>{{attempt.quizTitle || 'Quiz #' + attempt.quizId}}</h3>
            <span class="badge" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
              {{attempt.passed ? '✓ Réussi' : '✗ Échoué'}}
            </span>
          </div>
          
          <div class="score-section">
            <div class="score-circle" [class.passed]="attempt.passed" [class.failed]="!attempt.passed">
              <span class="score-value">{{attempt.score}}%</span>
            </div>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="stat-label">Bonnes réponses</span>
              <span class="stat-value">{{attempt.correctAnswers}}/{{attempt.totalQuestions}}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Date</span>
              <span class="stat-value">{{attempt.completedAt | date:'dd/MM/yyyy HH:mm'}}</span>
            </div>
          </div>
        </div>

        <div *ngIf="attempts.length === 0" class="no-data">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <p>Vous n'avez pas encore passé de quiz</p>
          <button class="btn-primary" (click)="goToQuizzes()">Voir les quiz disponibles</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
    .page-header { margin-bottom: 30px; }
    .page-header h1 { color: white; margin: 0; }
    
    .history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    
    .history-card { 
      background: white; 
      padding: 30px; 
      border-radius: 15px; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .history-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
    
    .card-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: start; 
      margin-bottom: 25px; 
    }
    .card-header h3 { margin: 0; color: #333; font-size: 20px; }
    
    .badge { 
      padding: 8px 16px; 
      border-radius: 20px; 
      font-size: 13px; 
      font-weight: 600; 
    }
    .badge.passed { background: #e8f5e9; color: #388e3c; }
    .badge.failed { background: #ffebee; color: #d32f2f; }
    
    .score-section { 
      display: flex; 
      justify-content: center; 
      margin-bottom: 25px; 
    }
    
    .score-circle { 
      width: 120px; 
      height: 120px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .score-circle.passed { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .score-circle.failed { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
    
    .score-value { 
      font-size: 32px; 
      font-weight: 700; 
      color: white; 
    }
    
    .stats { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 15px; 
    }
    
    .stat { 
      background: #f8f9fa; 
      padding: 15px; 
      border-radius: 10px; 
      text-align: center; 
    }
    
    .stat-label { 
      display: block; 
      font-size: 12px; 
      color: #666; 
      margin-bottom: 5px; 
    }
    
    .stat-value { 
      display: block; 
      font-size: 18px; 
      font-weight: 700; 
      color: #333; 
    }
    
    .no-data { 
      grid-column: 1 / -1; 
      text-align: center; 
      padding: 60px 20px; 
      background: white; 
      border-radius: 15px; 
    }
    .no-data svg { color: #ccc; margin-bottom: 20px; }
    .no-data p { color: #666; font-size: 18px; margin-bottom: 20px; }
    
    .btn-primary { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      border: none; 
      padding: 12px 24px; 
      border-radius: 8px; 
      font-weight: 600; 
      cursor: pointer; 
    }
  `]
})
export class MyQuizHistoryComponent implements OnInit {
  attempts: any[] = [];
  studentId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStudentId();
  }

  loadStudentId() {
    const email = localStorage.getItem('user_email');
    if (email) {
      this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
        next: (students) => {
          const student = students.find(s => s.email === email);
          if (student) {
            this.studentId = student.id;
            this.loadAttempts();
          }
        },
        error: (err) => console.error('Error loading student:', err)
      });
    }
  }

  loadAttempts() {
    if (!this.studentId) return;

    this.http.get<any[]>(`http://localhost:8080/api/quizzes/attempts/student/${this.studentId}`).subscribe({
      next: (attempts) => {
        this.attempts = attempts;
        this.loadQuizTitles();
      },
      error: (err) => console.error('Error loading attempts:', err)
    });
  }

  loadQuizTitles() {
    this.http.get<any[]>('http://localhost:8080/api/quizzes').subscribe({
      next: (quizzes) => {
        this.attempts = this.attempts.map(attempt => ({
          ...attempt,
          quizTitle: quizzes.find(q => q.id === attempt.quizId)?.title
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading quizzes:', err)
    });
  }

  goToQuizzes() {
    this.router.navigate(['/quiz']);
  }
}
