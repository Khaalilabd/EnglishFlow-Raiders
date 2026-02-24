import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📝 Gestion des Quiz</h1>
        <button class="btn-primary" (click)="openModal()">+ Nouveau quiz</button>
      </div>
      
      <div class="quiz-grid">
        <div class="quiz-card" *ngFor="let quiz of quizzes">
          <div class="quiz-header">
            <h3>{{quiz.title}}</h3>
            <span class="badge" [class]="'badge-' + quiz.difficulty?.toLowerCase()">{{quiz.difficulty}}</span>
          </div>
          <p class="description">{{quiz.description}}</p>
          <div class="quiz-info">
            <div class="info-item">
              <span>⏱️ {{quiz.timeLimit}} min</span>
            </div>
            <div class="info-item">
              <span>✅ Score: {{quiz.passingScore}}%</span>
            </div>
          </div>
          <div class="quiz-actions">
            <button class="btn-edit" (click)="editQuiz(quiz)">✏️ Modifier</button>
            <button class="btn-delete" (click)="deleteQuiz(quiz.id)">🗑️ Supprimer</button>
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
    .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-easy { background: #e8f5e9; color: #388e3c; }
    .badge-medium { background: #fff3e0; color: #f57c00; }
    .badge-hard { background: #ffebee; color: #d32f2f; }
    .description { color: #666; margin-bottom: 20px; line-height: 1.5; }
    .quiz-info { display: flex; gap: 20px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; }
    .info-item span { color: #666; font-weight: 600; }
    .quiz-actions { display: flex; gap: 10px; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-secondary { background: #e0e0e0; color: #333; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-edit { flex: 1; background: #4caf50; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; }
    .btn-delete { flex: 1; background: #f44336; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .modal-content h2 { margin: 0 0 20px 0; color: #333; }
    .form-group { margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    label { display: block; margin-bottom: 8px; color: #333; font-weight: 600; }
    input, textarea, select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    input:focus, textarea:focus, select:focus { outline: none; border-color: #667eea; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
  `]
})
export class QuizComponent implements OnInit {
  quizzes: any[] = [];
  showModal = false;
  editMode = false;
  currentQuiz: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadQuizzes();
  }

  loadQuizzes() {
    this.http.get<any[]>('http://localhost:8080/api/quizzes').subscribe({
      next: (data) => this.quizzes = data,
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
}
