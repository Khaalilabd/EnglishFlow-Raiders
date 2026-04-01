import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📝 Gestion des Quiz</h1>
        <button *ngIf="canCreateQuiz()" class="btn-primary" (click)="openModal()">+ Nouveau quiz</button>
      </div>
      
      <div class="quiz-grid">
        <div class="quiz-card" *ngFor="let quiz of quizzes">
          <div class="quiz-header">
            <h3>{{quiz.title}}</h3>
            <div class="badges">
              <span class="badge" [class]="'badge-' + quiz.difficulty?.toLowerCase()">{{quiz.difficulty}}</span>
              <span *ngIf="quiz.completed" class="badge badge-completed">✓ Déjà passé</span>
            </div>
          </div>
          <p class="description">{{quiz.description}}</p>
          <div class="quiz-info">
            <div class="info-item">
              <span>⏱️ {{quiz.timeLimit}} min</span>
            </div>
            <div class="info-item">
              <span>✅ Score: {{quiz.passingScore}}%</span>
            </div>
            <div class="info-item" *ngIf="quiz.completed && quiz.lastScore !== undefined">
              <span>📊 Dernier score: {{quiz.lastScore}}%</span>
            </div>
          </div>
          <div class="quiz-actions">
            <button class="btn-take" (click)="takeQuiz(quiz.id)">
              {{quiz.completed ? '👁️ Voir résultat' : '🎯 Passer le quiz'}}
            </button>
            <button *ngIf="canCreateQuiz()" class="btn-questions" (click)="manageQuestions(quiz)">❓ Questions</button>
            <button *ngIf="canCreateQuiz()" class="btn-edit" (click)="editQuiz(quiz)">✏️</button>
            <button *ngIf="canCreateQuiz()" class="btn-delete" (click)="deleteQuiz(quiz.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{editMode ? 'Modifier' : 'Nouveau'}} quiz</h2>
          <form (ngSubmit)="saveQuiz()">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" [(ngModel)]="currentQuiz.title" name="title" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="currentQuiz.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Difficulté</label>
                <select [(ngModel)]="currentQuiz.difficulty" name="difficulty">
                  <option value="EASY">Facile</option>
                  <option value="MEDIUM">Moyen</option>
                  <option value="HARD">Difficile</option>
                </select>
              </div>
              <div class="form-group">
                <label>Temps (min)</label>
                <input type="number" [(ngModel)]="currentQuiz.timeLimit" name="timeLimit">
              </div>
            </div>
            <div class="form-group">
              <label>Score de passage (%)</label>
              <input type="number" [(ngModel)]="currentQuiz.passingScore" name="passingScore" min="0" max="100">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary">{{editMode ? 'Modifier' : 'Créer'}}</button>
            </div>
          </form>
        </div>
      </div>

      <div class="modal" *ngIf="showQuestionsModal" (click)="closeQuestionsModal()">
        <div class="modal-content-large" (click)="$event.stopPropagation()">
          <h2>Questions - {{selectedQuiz?.title}}</h2>
          
          <div class="questions-list">
            <div class="question-item" *ngFor="let q of questions; let i = index">
              <div class="question-header">
                <span class="question-number">Q{{i + 1}}</span>
                <span class="question-text">{{q.questionText}}</span>
                <div class="question-actions">
                  <button class="btn-icon" (click)="editQuestion(q)">✏️</button>
                  <button class="btn-icon" (click)="deleteQuestion(q.id)">🗑️</button>
                </div>
              </div>
              <div class="options-list">
                <div class="option" *ngFor="let opt of q.options" [class.correct]="opt === q.correctAnswer">
                  {{opt}} <span *ngIf="opt === q.correctAnswer">✓</span>
                </div>
              </div>
            </div>
          </div>

          <button class="btn-add-question" (click)="openQuestionForm()">+ Ajouter une question</button>

          <div class="question-form" *ngIf="showQuestionForm">
            <h3>{{editQuestionMode ? 'Modifier' : 'Nouvelle'}} question</h3>
            <form (ngSubmit)="saveQuestion()">
              <div class="form-group">
                <label>Question</label>
                <textarea [(ngModel)]="currentQuestion.questionText" name="questionText" rows="3" required></textarea>
              </div>
              <div class="form-group">
                <label>Options (une par ligne)</label>
                <textarea [(ngModel)]="optionsText" name="options" rows="4" placeholder="Option A&#10;Option B&#10;Option C&#10;Option D" required></textarea>
              </div>
              <div class="form-group">
                <label>Réponse correcte</label>
                <input type="text" [(ngModel)]="currentQuestion.correctAnswer" name="correctAnswer" placeholder="Entrez la réponse exacte" required>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="cancelQuestionForm()">Annuler</button>
                <button type="submit" class="btn-primary">{{editQuestionMode ? 'Modifier' : 'Ajouter'}}</button>
              </div>
            </form>
          </div>

          <div class="modal-actions">
            <button class="btn-secondary" (click)="closeQuestionsModal()">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .page-header h1 { color: white; margin: 0; }
    .quiz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .quiz-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .quiz-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
    .quiz-header h3 { margin: 0; color: #333; }
    .badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-easy { background: #e8f5e9; color: #388e3c; }
    .badge-medium { background: #fff3e0; color: #f57c00; }
    .badge-hard { background: #ffebee; color: #d32f2f; }
    .badge-completed { background: #e3f2fd; color: #1976d2; }
    .description { color: #666; margin-bottom: 20px; line-height: 1.5; }
    .quiz-info { display: flex; gap: 20px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; }
    .info-item span { color: #666; font-weight: 600; }
    .quiz-actions { display: flex; gap: 10px; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-secondary { background: #e0e0e0; color: #333; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-take { flex: 2; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-take:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); }
    .btn-questions { flex: 1; background: #ff9800; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-edit { background: #4caf50; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }
    .btn-delete { background: #f44336; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .modal-content h2 { margin: 0 0 20px 0; color: #333; }
    .form-group { margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; }
    input, textarea, select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #667eea; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
    .modal-content-large { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; }
    .questions-list { margin-bottom: 20px; }
    .question-item { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 15px; }
    .question-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
    .question-number { background: #667eea; color: white; padding: 8px 12px; border-radius: 8px; font-weight: 600; }
    .question-text { flex: 1; font-weight: 600; color: #333; }
    .question-actions { display: flex; gap: 10px; }
    .btn-icon { background: transparent; border: none; font-size: 18px; cursor: pointer; padding: 5px; }
    .options-list { display: grid; gap: 10px; padding-left: 50px; }
    .option { padding: 10px 15px; background: white; border-radius: 8px; border: 2px solid #e0e0e0; }
    .option.correct { border-color: #4caf50; background: #e8f5e9; font-weight: 600; }
    .btn-add-question { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; margin-bottom: 20px; }
    .question-form { background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px; }
    .question-form h3 { margin: 0 0 20px 0; color: #333; }
    .form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
  `]
})
export class QuizComponent implements OnInit {
  quizzes: any[] = [];
  showModal = false;
  editMode = false;
  currentQuiz: any = {};
  
  showQuestionsModal = false;
  selectedQuiz: any = null;
  questions: any[] = [];
  showQuestionForm = false;
  editQuestionMode = false;
  currentQuestion: any = {};
  optionsText = '';
  
  studentId: number | null = null;
  studentAttempts: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('QuizComponent initialized');
    if (this.authService.isStudent()) {
      this.loadStudentId();
    } else {
      this.loadQuizzes();
    }
  }

  loadStudentId() {
    const email = localStorage.getItem('user_email');
    if (email) {
      this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
        next: (students) => {
          const student = students.find(s => s.email === email);
          if (student) {
            this.studentId = student.id;
            this.loadStudentAttempts();
          } else {
            this.loadQuizzes();
          }
        },
        error: (err) => {
          console.error('Error loading student:', err);
          this.loadQuizzes();
        }
      });
    } else {
      this.loadQuizzes();
    }
  }

  loadStudentAttempts() {
    if (!this.studentId) {
      this.loadQuizzes();
      return;
    }

    this.http.get<any[]>(`http://localhost:8080/api/quizzes/attempts/student/${this.studentId}`).subscribe({
      next: (attempts) => {
        this.studentAttempts = attempts;
        this.loadQuizzes();
      },
      error: (err) => {
        console.error('Error loading attempts:', err);
        this.loadQuizzes();
      }
    });
  }

  loadQuizzes() {
    console.log('Loading quizzes...');
    this.http.get<any[]>('http://localhost:8080/api/quizzes').subscribe({
      next: (data) => {
        console.log('Quizzes loaded:', data);
        this.quizzes = data.map(quiz => {
          const attempt = this.studentAttempts.find(a => a.quizId === quiz.id);
          return {
            ...quiz,
            completed: !!attempt,
            lastScore: attempt?.score
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  openModal() {
    this.editMode = false;
    this.currentQuiz = { difficulty: 'MEDIUM', timeLimit: 30, passingScore: 70 };
    this.showModal = true;
  }

  editQuiz(quiz: any) {
    this.editMode = true;
    this.currentQuiz = { ...quiz };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveQuiz() {
    const url = this.editMode 
      ? `http://localhost:8080/api/quizzes/${this.currentQuiz.id}`
      : 'http://localhost:8080/api/quizzes';
    
    const method = this.editMode ? this.http.put(url, this.currentQuiz) : this.http.post(url, this.currentQuiz);
    
    method.subscribe({
      next: () => {
        this.loadQuizzes();
        this.closeModal();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  deleteQuiz(id: number) {
    if (confirm('Supprimer ce quiz ?')) {
      this.http.delete(`http://localhost:8080/api/quizzes/${id}`).subscribe({
        next: () => this.loadQuizzes(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  canCreateQuiz(): boolean {
    return this.authService.canCreateQuiz();
  }
  
  takeQuiz(quizId: number) {
    this.router.navigate(['/quiz/take', quizId]);
  }

  manageQuestions(quiz: any) {
    this.selectedQuiz = quiz;
    this.showQuestionsModal = true;
    this.loadQuestions(quiz.id);
  }

  closeQuestionsModal() {
    this.showQuestionsModal = false;
    this.showQuestionForm = false;
    this.selectedQuiz = null;
  }

  loadQuestions(quizId: number) {
    this.http.get<any[]>(`http://localhost:8080/api/quizzes/${quizId}/questions`).subscribe({
      next: (data) => {
        this.questions = data.map(q => ({
          ...q,
          options: q.options ? q.options.split(',') : []
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading questions:', err)
    });
  }

  openQuestionForm() {
    this.editQuestionMode = false;
    this.currentQuestion = { quizId: this.selectedQuiz.id };
    this.optionsText = '';
    this.showQuestionForm = true;
  }

  editQuestion(question: any) {
    this.editQuestionMode = true;
    this.currentQuestion = { ...question };
    this.optionsText = question.options.join('\n');
    this.showQuestionForm = true;
  }

  cancelQuestionForm() {
    this.showQuestionForm = false;
    this.currentQuestion = {};
    this.optionsText = '';
  }

  saveQuestion() {
    const options = this.optionsText.split('\n').filter(o => o.trim()).join(',');
    const questionData = {
      ...this.currentQuestion,
      options: options,
      quizId: this.selectedQuiz.id
    };

    const url = this.editQuestionMode
      ? `http://localhost:8080/api/quizzes/questions/${this.currentQuestion.id}`
      : `http://localhost:8080/api/quizzes/${this.selectedQuiz.id}/questions`;
    
    const method = this.editQuestionMode 
      ? this.http.put(url, questionData) 
      : this.http.post(url, questionData);

    method.subscribe({
      next: () => {
        this.loadQuestions(this.selectedQuiz.id);
        this.cancelQuestionForm();
      },
      error: (err) => console.error('Error saving question:', err)
    });
  }

  deleteQuestion(id: number) {
    if (confirm('Supprimer cette question ?')) {
      this.http.delete(`http://localhost:8080/api/quizzes/questions/${id}`).subscribe({
        next: () => this.loadQuestions(this.selectedQuiz.id),
        error: (err) => console.error('Error deleting question:', err)
      });
    }
  }
}
