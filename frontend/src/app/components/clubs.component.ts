import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>🎭 Gestion des Clubs</h1>
        <button class="btn-primary" (click)="openModal()">+ Nouveau club</button>
      </div>
      
      <div class="clubs-grid">
        <div class="club-card" *ngFor="let club of clubs">
          <div class="club-icon">🎭</div>
          <h3>{{club.name}}</h3>
          <p class="category">{{club.category}}</p>
          <p class="description">{{club.description}}</p>
          <div class="club-info">
            <div class="info-item">
              <span class="label">Membres</span>
              <span class="value">{{club.currentMembers}}/{{club.maxMembers}}</span>
            </div>
            <div class="info-item">
              <span class="label">Horaire</span>
              <span class="value">{{club.meetingSchedule}}</span>
            </div>
            <div class="info-item">
              <span class="label">Lieu</span>
              <span class="value">{{club.location}}</span>
            </div>
          </div>
          <div class="club-actions">
            <button class="btn-edit" (click)="editClub(club)">✏️</button>
            <button class="btn-delete" (click)="deleteClub(club.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <div class="modal" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{editMode ? 'Modifier' : 'Nouveau'}} club</h2>
          <form (ngSubmit)="saveClub()">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" [(ngModel)]="currentClub.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="currentClub.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Catégorie</label>
                <input type="text" [(ngModel)]="currentClub.category" name="category">
              </div>
              <div class="form-group">
                <label>Max Membres</label>
                <input type="number" [(ngModel)]="currentClub.maxMembers" name="maxMembers">
              </div>
            </div>
            <div class="form-group">
              <label>Horaire</label>
              <input type="text" [(ngModel)]="currentClub.meetingSchedule" name="schedule">
            </div>
            <div class="form-group">
              <label>Lieu</label>
              <input type="text" [(ngModel)]="currentClub.location" name="location">
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
    .clubs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .club-card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    .club-icon { font-size: 48px; margin-bottom: 15px; }
    .club-card h3 { margin: 0 0 10px 0; color: #333; }
    .category { color: #667eea; font-weight: 600; margin-bottom: 15px; }
    .description { color: #666; margin-bottom: 20px; line-height: 1.5; }
    .club-info { background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px; }
    .info-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .info-item:last-child { margin-bottom: 0; }
    .label { color: #999; font-size: 14px; }
    .value { color: #333; font-weight: 600; font-size: 14px; }
    .club-actions { display: flex; gap: 10px; }
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
    input, textarea { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    input:focus, textarea:focus { outline: none; border-color: #667eea; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
  `]
})
export class ClubsComponent implements OnInit {
  clubs: any[] = [];
  showModal = false;
  editMode = false;
  currentClub: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadClubs();
  }

  loadClubs() {
    this.http.get<any[]>('http://localhost:8080/api/clubs').subscribe({
      next: (data) => this.clubs = data,
      error: (err) => console.error('Error:', err)
    });
  }

  openModal() {
    this.editMode = false;
    this.currentClub = { currentMembers: 0 };
    this.showModal = true;
  }

  editClub(club: any) {
    this.editMode = true;
    this.currentClub = { ...club };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveClub() {
    const url = this.editMode 
      ? `http://localhost:8080/api/clubs/${this.currentClub.id}`
      : 'http://localhost:8080/api/clubs';
    
    const method = this.editMode ? this.http.put(url, this.currentClub) : this.http.post(url, this.currentClub);
    
    method.subscribe({
      next: () => {
        this.loadClubs();
        this.closeModal();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  deleteClub(id: number) {
    if (confirm('Supprimer ce club ?')) {
      this.http.delete(`http://localhost:8080/api/clubs/${id}`).subscribe({
        next: () => this.loadClubs(),
        error: (err) => console.error('Error:', err)
      });
    }
  }
}
