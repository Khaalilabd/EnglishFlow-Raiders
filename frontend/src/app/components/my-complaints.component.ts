import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

function smartCompare(a: any, b: any): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'string' && /^\d{4}-\d{2}-\d{2}/.test(a)) return new Date(a).getTime() - new Date(b).getTime();
  if (typeof a === 'number' || !isNaN(Number(a))) return Number(a) - Number(b);
  return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase(), 'fr');
}

@Component({
  selector: 'app-my-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Mes Réclamations</h1>
          <p class="subtitle">{{ filtered.length }} réclamation(s) sur {{ complaints.length }}</p>
        </div>
        <button class="btn-primary" (click)="openModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouvelle réclamation
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon orange"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div><div class="stat-num">{{ count('PENDING') }}</div><div class="stat-lbl">En attente</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
          <div><div class="stat-num">{{ count('IN_PROGRESS') }}</div><div class="stat-lbl">En cours</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <div><div class="stat-num">{{ count('RESOLVED') }}</div><div class="stat-lbl">Résolues</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon gray"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg></div>
          <div><div class="stat-num">{{ count('CLOSED') }}</div><div class="stat-lbl">Fermées</div></div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Rechercher par titre ou description…" [(ngModel)]="search" (ngModelChange)="apply()" />
          <button *ngIf="search" class="clear-btn" (click)="search=''; apply()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="filters">
          <select [(ngModel)]="filterStatus" (ngModelChange)="apply()" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Résolue</option>
            <option value="CLOSED">Fermée</option>
          </select>
          <select [(ngModel)]="filterPriority" (ngModelChange)="apply()" class="filter-select">
            <option value="">Toutes priorités</option>
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
            <option value="URGENT">Urgente</option>
          </select>
          <select [(ngModel)]="sortField" (ngModelChange)="apply()" class="filter-select">
            <option value="createdAt">Plus récentes</option>
            <option value="title">Titre</option>
            <option value="status">Statut</option>
            <option value="priority">Priorité</option>
          </select>
          <button class="sort-dir-btn" (click)="toggleDir()" title="Inverser le tri">
            <svg *ngIf="sortDir==='asc'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            <svg *ngIf="sortDir==='desc'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          </button>
          <button class="reset-btn" *ngIf="hasFilters()" (click)="reset()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="state-box">
        <div class="spinner"></div><p>Chargement…</p>
      </div>

      <!-- Empty -->
      <div *ngIf="!loading && complaints.length === 0" class="empty-hero">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3>Aucune réclamation</h3>
        <p>Vous n'avez pas encore soumis de réclamation.</p>
        <button class="btn-primary" (click)="openModal()">Soumettre ma première réclamation</button>
      </div>

      <!-- No results -->
      <div *ngIf="!loading && complaints.length > 0 && filtered.length === 0" class="empty-hero">
        <div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <h3>Aucun résultat</h3>
        <p>Aucune réclamation ne correspond à vos filtres.</p>
        <button class="btn-secondary" (click)="reset()">Réinitialiser les filtres</button>
      </div>

      <!-- Cards -->
      <div class="cards-grid" *ngIf="!loading && filtered.length > 0">
        <div class="complaint-card" *ngFor="let c of filtered">
          <div class="card-top">
            <div class="card-title-row">
              <h3>{{ c.title }}</h3>
              <span class="status-badge" [class]="'s-' + c.status?.toLowerCase()">{{ statusLabel(c.status) }}</span>
            </div>
            <p class="card-desc">{{ c.description }}</p>
          </div>
          <div class="card-meta">
            <span class="meta-chip cat">{{ c.category }}</span>
            <span class="meta-chip" [class]="'prio-' + c.priority?.toLowerCase()">{{ c.priority }}</span>
            <span class="meta-date">{{ formatDate(c.createdAt) }}</span>
          </div>
          <div class="card-response" *ngIf="c.response">
            <div class="response-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Réponse
            </div>
            <p>{{ c.response }}</p>
            <small *ngIf="c.handledBy">— {{ c.handledBy }}, {{ formatDate(c.resolvedAt) }}</small>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editMode ? 'Modifier la réclamation' : 'Nouvelle réclamation' }}</h2>
            <button class="close-btn" (click)="closeModal()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form (ngSubmit)="save()" class="modal-form">
            <div class="form-group">
              <label>Titre *</label>
              <input type="text" [(ngModel)]="cur.title" name="title" required placeholder="Résumé de votre réclamation" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="cur.description" name="description" rows="4" placeholder="Décrivez le problème en détail…"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Catégorie</label>
                <select [(ngModel)]="cur.category" name="category">
                  <option value="TECHNICAL">Technique</option>
                  <option value="CONTENT">Contenu</option>
                  <option value="SERVICE">Service</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priorité</label>
                <select [(ngModel)]="cur.priority" name="priority">
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="saving">{{ saving ? 'Envoi…' : (editMode ? 'Modifier' : 'Soumettre') }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Toast -->
      <div *ngIf="toast" class="toast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        {{ toast }}
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 28px; background: #f4f5f7; min-height: 100vh; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .page-header h1 { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .subtitle { font-size: 13px; color: #6b7280; margin: 0; }

    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }
    .stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; transition: box-shadow .2s; }
    .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.06); }
    .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon.orange { background: #fffbeb; color: #d97706; }
    .stat-icon.blue   { background: #eff6ff; color: #2563eb; }
    .stat-icon.green  { background: #ecfdf5; color: #059669; }
    .stat-icon.gray   { background: #f3f4f6; color: #6b7280; }
    .stat-num { font-size: 24px; font-weight: 700; color: #111827; line-height: 1; }
    .stat-lbl { font-size: 12px; color: #6b7280; margin-top: 2px; }

    .toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .search-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 220px; background: white; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 0 12px; gap: 8px; }
    .search-wrap:focus-within { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
    .search-wrap svg { color: #9ca3af; flex-shrink: 0; }
    .search-wrap input { flex: 1; border: none; outline: none; padding: 9px 0; font-size: 13.5px; background: transparent; color: #111827; }
    .clear-btn { background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; padding: 2px; }
    .filters { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .filter-select { padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; background: white; color: #374151; cursor: pointer; outline: none; }
    .filter-select:focus { border-color: #10b981; }
    .reset-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1.5px solid #fca5a5; border-radius: 8px; background: #fef2f2; color: #dc2626; font-size: 13px; font-weight: 600; cursor: pointer; }
    .sort-dir-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; color: #6b7280; cursor: pointer; flex-shrink: 0; }
    .sort-dir-btn:hover { background: #f3f4f6; border-color: #d1d5db; }

    .state-box { text-align: center; padding: 48px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; }
    .spinner { border: 3px solid #e5e7eb; border-top-color: #10b981; border-radius: 50%; width: 36px; height: 36px; animation: spin .8s linear infinite; margin: 0 auto 12px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-hero { text-align: center; padding: 56px 24px; background: white; border-radius: 16px; border: 1px solid #e5e7eb; }
    .empty-icon { width: 80px; height: 80px; background: #f3f4f6; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #9ca3af; }
    .empty-hero h3 { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 8px; }
    .empty-hero p { font-size: 14px; color: #6b7280; margin: 0 0 20px; }

    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
    .complaint-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: box-shadow .2s, transform .2s; }
    .complaint-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.07); transform: translateY(-2px); }
    .card-top { display: flex; flex-direction: column; gap: 8px; }
    .card-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .card-title-row h3 { margin: 0; font-size: 15px; font-weight: 700; color: #111827; }
    .card-desc { margin: 0; font-size: 13.5px; color: #6b7280; line-height: 1.55; }
    .card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
    .meta-chip { padding: 3px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; }
    .cat { background: #f3f4f6; color: #6b7280; }
    .prio-low    { background: #ecfdf5; color: #059669; }
    .prio-medium { background: #fffbeb; color: #d97706; }
    .prio-high   { background: #fef2f2; color: #dc2626; }
    .prio-urgent { background: #ef4444; color: white; }
    .meta-date { font-size: 12px; color: #9ca3af; margin-left: auto; }
    .status-badge { padding: 3px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 600; white-space: nowrap; }
    .s-pending     { background: #fffbeb; color: #d97706; }
    .s-in_progress { background: #eff6ff; color: #2563eb; }
    .s-resolved    { background: #ecfdf5; color: #059669; }
    .s-closed      { background: #f3f4f6; color: #6b7280; }
    .card-response { background: #f0fdf4; border-left: 3px solid #10b981; border-radius: 8px; padding: 12px 14px; }
    .response-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #059669; margin-bottom: 6px; }
    .card-response p { margin: 0 0 4px; font-size: 13px; color: #374151; }
    .card-response small { font-size: 11.5px; color: #6b7280; }

    .btn-primary { background: #059669; color: white; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background .2s; }
    .btn-primary:hover:not(:disabled) { background: #047857; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .btn-secondary { padding: 9px 18px; border: 1.5px solid #e5e7eb; background: white; color: #374151; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
    .btn-secondary:hover { background: #f9fafb; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 16px; padding: 28px; width: 90%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-header h2 { font-size: 17px; font-weight: 700; color: #111827; margin: 0; }
    .close-btn { background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; padding: 4px; border-radius: 6px; }
    .close-btn:hover { background: #f3f4f6; color: #374151; }
    .modal-form { display: flex; flex-direction: column; gap: 14px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .form-group label { font-size: 13px; font-weight: 600; color: #374151; }
    .form-group input, .form-group textarea, .form-group select { padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #111827; outline: none; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }

    .toast { position: fixed; bottom: 24px; right: 24px; background: #059669; color: white; padding: 12px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; box-shadow: 0 8px 20px rgba(5,150,105,.3); z-index: 1100; animation: slideUp .3s ease; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class MyComplaintsComponent implements OnInit {
  complaints: any[] = [];
  filtered: any[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  saving = false;
  toast = '';
  cur: any = {};

  search = '';
  filterStatus = '';
  filterPriority = '';
  sortField = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';

  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const email = localStorage.getItem('user_email');
    if (email) {
      // Récupérer l'ID numérique du student via son email
      this.http.get<any[]>('http://localhost:8080/students-service/students').subscribe({
        next: (students) => {
          const student = students.find(s => s.email === email);
          const numericId = student ? student.id : null;
          const url = numericId
            ? `http://localhost:8080/complaints-service/api/complaints/student/${numericId}`
            : 'http://localhost:8080/complaints-service/api/complaints';
          this.http.get<any[]>(url).subscribe({
            next: d => { this.complaints = d; this.apply(); this.loading = false; this.cdr.detectChanges(); },
            error: () => { this.loading = false; this.cdr.detectChanges(); }
          });
        },
        error: () => {
          // Fallback: charger toutes les complaints
          this.http.get<any[]>('http://localhost:8080/complaints-service/api/complaints').subscribe({
            next: d => { this.complaints = d; this.apply(); this.loading = false; this.cdr.detectChanges(); },
            error: () => { this.loading = false; this.cdr.detectChanges(); }
          });
        }
      });
    } else {
      this.http.get<any[]>('http://localhost:8080/complaints-service/api/complaints').subscribe({
        next: d => { this.complaints = d; this.apply(); this.loading = false; this.cdr.detectChanges(); },
        error: () => { this.loading = false; this.cdr.detectChanges(); }
      });
    }
  }

  apply() {
    let list = [...this.complaints];
    if (this.search.trim()) {
      const t = this.search.toLowerCase();
      list = list.filter(c => c.title?.toLowerCase().includes(t) || c.description?.toLowerCase().includes(t));
    }
    if (this.filterStatus)   list = list.filter(c => c.status === this.filterStatus);
    if (this.filterPriority) list = list.filter(c => c.priority === this.filterPriority);
    list.sort((a: any, b: any) => {
      const cmp = smartCompare(a[this.sortField], b[this.sortField]);
      return this.sortDir === 'asc' ? cmp : -cmp;
    });
    this.filtered = list;
    this.cdr.detectChanges();
  }

  toggleDir() { this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; this.apply(); }

  hasFilters() { return !!(this.search || this.filterStatus || this.filterPriority); }
  reset() { this.search = ''; this.filterStatus = ''; this.filterPriority = ''; this.sortField = 'createdAt'; this.sortDir = 'desc'; this.apply(); }
  count(s: string) { return this.complaints.filter(c => c.status === s).length; }
  statusLabel(s: string) { const m: any = { PENDING: 'En attente', IN_PROGRESS: 'En cours', RESOLVED: 'Résolue', CLOSED: 'Fermée' }; return m[s] || s; }
  formatDate(d: string) { return d ? new Date(d).toLocaleDateString('fr-FR') : ''; }

  openModal() { this.editMode = false; this.cur = { category: 'TECHNICAL', priority: 'MEDIUM', status: 'PENDING' }; this.showModal = true; }
  closeModal() { this.showModal = false; }

  save() {
    if (!this.cur.title) return;
    this.saving = true;
    const email = localStorage.getItem('user_email');
    const firstName = localStorage.getItem('user_firstname') || '';
    const lastName = localStorage.getItem('user_lastname') || '';
    const studentName = `${firstName} ${lastName}`.trim();

    const submitComplaint = (numericId: number | null) => {
      const payload = {
        ...this.cur,
        studentId: numericId,
        studentName: studentName
      };
      this.http.post('http://localhost:8080/complaints-service/api/complaints', payload).subscribe({
        next: () => { this.saving = false; this.closeModal(); this.load(); this.showToast('Réclamation soumise !'); },
        error: () => { this.saving = false; }
      });
    };

    if (email) {
      this.http.get<any[]>('http://localhost:8080/students-service/students').subscribe({
        next: (students) => {
          const student = students.find(s => s.email === email);
          submitComplaint(student ? student.id : null);
        },
        error: () => submitComplaint(null)
      });
    } else {
      submitComplaint(null);
    }
  }

  showToast(msg: string) {
    this.toast = msg;
    this.cdr.detectChanges();
    setTimeout(() => { this.toast = ''; this.cdr.detectChanges(); }, 3000);
  }
}
