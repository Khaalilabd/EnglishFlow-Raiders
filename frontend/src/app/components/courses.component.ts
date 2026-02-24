import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📚 Gestion des Cours</h1>
        <button class="btn-primary" (click)="openModal()">+ Ajouter un cours</button>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>{{courses.length}}</h3>
          <p>Total Cours</p>
        </div>
        <div class="stat-card">
          <h3>{{getBeginnerCount()}}</h3>
          <p>Débutant</p>
        </div>
        <div class="stat-card">
          <h3>{{getIntermediateCount()}}</h3>
          <p>Intermédiaire</p>
        </div>
        <div class="stat-card">
          <h3>{{getAdvancedCount()}}</h3>
          <p>Avancé</p>
        </div>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Instructeur</th>
              <th>Durée</th>
              <th>Niveau</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let course of courses">
              <td><strong>{{course.title}}</strong></td>
              <td>{{course.instructor}}</td>
              <td>{{course.durationHours}}h</td>
              <td><span class="badge" [class]="'badge-' + course.level.toLowerCase()">{{course.level}}</span></td>
              <td>
                <button class="btn-edit" (click)="editCourse(course)">✏️ Modifier</button>
                <button class="btn-delete" (click)="deleteCourse(course.id)">🗑️ Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{editMode ? 'Modifier' : 'Ajouter'}} un cours</h2>
          <form (ngSubmit)="saveCourse()">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" [(ngModel)]="currentCourse.title" name="title" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="currentCourse.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Instructeur</label>
              <input type="text" [(ngModel)]="currentCourse.instructor" name="instructor" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Durée (heures)</label>
                <input type="number" [(ngModel)]="currentCourse.durationHours" name="duration" required>
              </div>
              <div class="form-group">
                <label>Niveau</label>
                <select [(ngModel)]="currentCourse.level" name="level" required>
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
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
    
    .btn-edit {
      background: #4caf50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 10px;
    }
    
    .btn-delete {
      background: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
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
    
    .modal-content h2 {
      margin: 0 0 20px 0;
      color: #333;
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
    
    input, textarea, select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
    }
    
    input:focus, textarea:focus, select:focus {
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
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  showModal = false;
  editMode = false;
  currentCourse: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (data) => {
        this.courses = data;
        console.log('Courses loaded:', data);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        alert('Erreur lors du chargement des cours');
      }
    });
  }

  openModal() {
    this.editMode = false;
    this.currentCourse = { level: 'BEGINNER' };
    this.showModal = true;
  }

  editCourse(course: any) {
    this.editMode = true;
    this.currentCourse = { ...course };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentCourse = {};
  }

  saveCourse() {
    // Validation
    if (!this.currentCourse.title || !this.currentCourse.instructor || !this.currentCourse.durationHours) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.editMode) {
      // Update
      this.http.put(`http://localhost:8080/api/courses/${this.currentCourse.id}`, this.currentCourse)
        .subscribe({
          next: () => {
            this.loadCourses();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error updating course:', err);
            alert('Erreur lors de la modification du cours');
          }
        });
    } else {
      // Create - Remove id field if present
      const courseData = { ...this.currentCourse };
      delete courseData.id;
      
      this.http.post('http://localhost:8080/api/courses', courseData)
        .subscribe({
          next: () => {
            this.loadCourses();
            this.closeModal();
          },
          error: (err) => {
            console.error('Error creating course:', err);
            alert('Erreur lors de la création du cours');
          }
        });
    }
  }

  deleteCourse(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.http.delete(`http://localhost:8080/api/courses/${id}`)
        .subscribe(() => this.loadCourses());
    }
  }

  getBeginnerCount(): number {
    return this.courses.filter(c => c.level === 'BEGINNER').length;
  }

  getIntermediateCount(): number {
    return this.courses.filter(c => c.level === 'INTERMEDIATE').length;
  }

  getAdvancedCount(): number {
    return this.courses.filter(c => c.level === 'ADVANCED').length;
  }
}
