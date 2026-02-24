import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>📢 Gestion des Réclamations</h1>
        <button class="btn-primary" (click)="openModal()">+ Nouvelle réclamation</button>
      </div>
      
      <div class="stats">
        <div class="stat-card pending">
          <h3>{{getCountByStatus('PENDING')}}</h3>
          <p>En attente</p>
        </div>
        <div class="stat-card progress">
          <h3>{{getCountByStatus('IN_PROGRESS')}}</h3>
          <p>En cours</p>
        </div>
        <div class="stat-card resolved">
          <h3>{{getCountByStatus('RESOLVED')}}</h3>
          <p>Résolues</p>
        </div>
      </div>
      
      <div class="complaints-grid">
        <div class="complaint-card" *ngFor="let complaint of complaints">
          <div class="complaint-header">
            <h3>{{complaint.title}}</h3>
            <span class="badge" [class]="'badge-' + complaint.status.toLowerCase()">{{complaint.status}}</span>
          </div>
          <p class="description">{{complaint.description}}</p>
          <div class="complaint-meta">
            <span class="category">📁 {{complaint.category}}</span>
            <span class="priority" [class]="'priority-' + complaint.priority.toLowerCase()">
              {{complaint.priority}}
            </span>
            <span class="date">📅 {{formatDate(complaint.createdAt)}}</span>
          </div>
          <div class="complaint-actions">
            <button class="btn-edit" (click)="editComplaint(complaint)">✏️ Modifier</button>
            <button class="btn-delete" (click)="deleteComplaint(complaint.id)">🗑️ Supprimer</button>
          </div>
        </div>
      </div>
      
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{editMode ? 'Modifier' : 'Nouvelle'}} réclamation</h2>
          <form (ngSubmit)="saveComplaint()">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" [(ngModel)]="currentComplaint.title" name="title" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="currentComplaint.description" name="description" rows="4"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Catégorie</label>
                <select [(ngModel)]="currentComplaint.category" name="category">
                  <option value="TECHNICAL">Technique</option>
                  <option value="CONTENT">Contenu</option>
                  <option value="SERVICE">Service</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priorité</label>
                <select [(ngModel)]="currentComplaint.priority" name="priority">
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
            </div>
            <div class="form-group" *ngIf="editMode">
              <label>Statut</label>
              <select [(ngModel)]="currentComplaint.status" name="status">
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="RESOLVED">Résolue</option>
                <option value="CLOSED">Fermée</option>
              </select>
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
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .stat-card h3 { font-size: 36px; margin: 0 0 10px 0; }
    .stat-card.pending h3 { color: #ff9800; }
    .stat-card.progress h3 { color: #2196f3; }
    .stat-card.resolved h3 { color: #4caf50; }
    .stat-card p { color: #666; margin: 0; }
    .complaints-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .complaint-card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .complaint-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
    .complaint-header h3 { margin: 0; color: #333; font-size: 18px; }
    .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-pending { background: #fff3e0; color: #f57c00; }
    .badge-in_progress { background: #e3f2fd; color: #1976d2; }
    .badge-resolved { background: #e8f5e9; color: #388e3c; }
    .badge-closed { background: #f5f5f5; color: #757575; }
    .description { color: #666; margin-bottom: 15px; line-height: 1.5; }
    .complaint-meta { display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 15px; font-size: 14px; }
    .category { color: #666; }
    .priority { padding: 4px 8px; border-radius: 4px; font-weight: 600; }
    .priority-low { background: #e8f5e9; color: #388e3c; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #d32f2f; }
    .priority-urgent { background: #f44336; color: white; }
    .date { color: #999; }
    .complaint-actions { display: flex; gap: 10px; padding-top: 15px; border-top: 1px solid #f0f0f0; }
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
export class ComplaintsComponent implements OnInit {
  complaints: any[] = [];
  showModal = false;
  editMode = false;
  currentComplaint: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.http.get<any[]>('http://localhost:8080/api/complaints').subscribe({
      next: (data) => this.complaints = data,
      error: (err) => console.error('Error:', err)
    });
  }

  openModal() {
    this.editMode = false;
    this.currentComplaint = { category: 'TECHNICAL', priority: 'MEDIUM', status: 'PENDING' };
    this.showModal = true;
  }

  editComplaint(complaint: any) {
    this.editMode = true;
    this.currentComplaint = { ...complaint };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveComplaint() {
    const url = this.editMode 
      ? `http://localhost:8080/api/complaints/${this.currentComplaint.id}`
      : 'http://localhost:8080/api/complaints';
    
    const method = this.editMode ? this.http.put(url, this.currentComplaint) : this.http.post(url, this.currentComplaint);
    
    method.subscribe({
      next: () => {
        this.loadComplaints();
        this.closeModal();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  deleteComplaint(id: number) {
    if (confirm('Supprimer cette réclamation ?')) {
      this.http.delete(`http://localhost:8080/api/complaints/${id}`).subscribe({
        next: () => this.loadComplaints(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  getCountByStatus(status: string): number {
    return this.complaints.filter(c => c.status === status).length;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
