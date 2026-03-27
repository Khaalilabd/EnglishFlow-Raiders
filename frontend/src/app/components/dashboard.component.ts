import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-text">
            <h1>Bienvenue, {{userName}} 👋</h1>
            <p>Voici un aperçu de votre activité sur EnglishFlow</p>
          </div>
          <div class="header-actions">
            <button class="action-btn secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exporter
            </button>
            <button class="action-btn primary" (click)="navigate('courses')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nouveau cours
            </button>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div class="stat-trend positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              12%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{totalCourses}}</h3>
            <p>Cours disponibles</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-trend positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              8%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{totalStudents}}</h3>
            <p>Étudiants actifs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div class="stat-trend positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              24%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{totalEnrollments}}</h3>
            <p>Inscriptions totales</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-trend neutral">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              0%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{servicesUp}}/8</h3>
            <p>Services actifs</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card main-card">
          <div class="card-header">
            <h2>Activité récente</h2>
            <button class="icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
          </div>
          <div class="activity-timeline">
            <div class="timeline-item">
              <div class="timeline-marker blue"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>Nouveau cours ajouté</h4>
                  <span class="timeline-time">Il y a 2h</span>
                </div>
                <p>Advanced English Grammar a été publié</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker green"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>Nouvel étudiant inscrit</h4>
                  <span class="timeline-time">Il y a 5h</span>
                </div>
                <p>Marie Dubois a rejoint la plateforme</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker purple"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>Quiz complété</h4>
                  <span class="timeline-time">Hier</span>
                </div>
                <p>15 étudiants ont terminé le quiz de vocabulaire</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card side-card">
          <div class="card-header">
            <h2>Actions rapides</h2>
          </div>
          <div class="quick-actions">
            <button class="quick-action-btn" (click)="navigate('courses')">
              <div class="quick-action-icon blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div class="quick-action-text">
                <h4>Parcourir les cours</h4>
                <p>Découvrir le catalogue</p>
              </div>
            </button>

            @if (isTutor()) {
              <button class="quick-action-btn" (click)="navigate('students')">
                <div class="quick-action-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="quick-action-text">
                  <h4>Gérer les étudiants</h4>
                  <p>Voir la liste complète</p>
                </div>
              </button>
            }

            <button class="quick-action-btn" (click)="navigate('quiz')">
              <div class="quick-action-icon purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div class="quick-action-text">
                <h4>Passer un quiz</h4>
                <p>Tester vos connaissances</p>
              </div>
            </button>

            <button class="quick-action-btn" (click)="navigate('clubs')">
              <div class="quick-action-icon orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="quick-action-text">
                <h4>Rejoindre un club</h4>
                <p>Communauté d'apprentissage</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="card system-card">
        <div class="card-header">
          <h2>Architecture Microservices</h2>
          <div class="status-badge">
            <span class="status-dot"></span>
            Tous les services opérationnels
          </div>
        </div>
        <div class="services-grid">
          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Eureka Server</h4>
              <p>Service Discovery</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>API Gateway</h4>
              <p>Routing & Load Balancing</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Auth Service</h4>
              <p>Authentication & Authorization</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Courses Service</h4>
              <p>Course Management</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Students Service</h4>
              <p>Student Management</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Complaints Service</h4>
              <p>Feedback Management</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Clubs Service</h4>
              <p>Community Management</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>

          <div class="service-item">
            <div class="service-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div class="service-info">
              <h4>Quiz Service</h4>
              <p>Assessment Management</p>
            </div>
            <div class="service-status active">
              <span></span>
              Active
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      margin-left: 280px;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f1629 0%, #1a1f3a 100%);
      padding: 32px;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .header-text h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
    }

    .header-text p {
      margin: 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
    }

    .action-btn.secondary {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .action-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s;
    }

    .stat-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-4px);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.blue {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
      color: #60a5fa;
    }

    .stat-icon.green {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
      color: #34d399;
    }

    .stat-icon.purple {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
      color: #a78bfa;
    }

    .stat-icon.orange {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
      color: #fbbf24;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
    }

    .stat-trend.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
    }

    .stat-trend.neutral {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
    }

    .stat-content h3 {
      margin: 0 0 4px 0;
      font-size: 36px;
      font-weight: 700;
      color: white;
    }

    .stat-content p {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      overflow: hidden;
    }

    .card-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: white;
    }

    .icon-btn {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 0.3s;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .activity-timeline {
      padding: 24px;
    }

    .timeline-item {
      display: flex;
      gap: 16px;
      padding-bottom: 24px;
      position: relative;
    }

    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 32px;
      width: 2px;
      height: calc(100% - 16px);
      background: rgba(255, 255, 255, 0.06);
    }

    .timeline-marker {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
    }

    .timeline-marker.blue { background: #60a5fa; }
    .timeline-marker.green { background: #34d399; }
    .timeline-marker.purple { background: #a78bfa; }

    .timeline-content {
      flex: 1;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .timeline-header h4 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: white;
    }

    .timeline-time {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
    }

    .timeline-content p {
      margin: 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    .quick-actions {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      text-align: left;
    }

    .quick-action-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .quick-action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .quick-action-icon.blue {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
      color: #60a5fa;
    }

    .quick-action-icon.green {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
      color: #34d399;
    }

    .quick-action-icon.purple {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
      color: #a78bfa;
    }

    .quick-action-icon.orange {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%);
      color: #fbbf24;
    }

    .quick-action-text h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 600;
      color: white;
    }

    .quick-action-text p {
      margin: 0;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }

    .system-card {
      grid-column: 1 / -1;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #34d399;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #34d399;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .services-grid {
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      transition: all 0.3s;
    }

    .service-item:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .service-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a78bfa;
      flex-shrink: 0;
    }

    .service-info {
      flex: 1;
    }

    .service-info h4 {
      margin: 0 0 4px 0;
      font-size: 15px;
      font-weight: 600;
      color: white;
    }

    .service-info p {
      margin: 0;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }

    .service-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }

    .service-status.active {
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
    }

    .service-status span {
      width: 6px;
      height: 6px;
      background: #34d399;
      border-radius: 50%;
    }

    @media (max-width: 1400px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 1024px) {
      .dashboard-container {
        margin-left: 240px;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        margin-left: 0;
        padding: 20px;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalCourses = 0;
  totalStudents = 0;
  totalEnrollments = 0;
  servicesUp = 8;
  userName = '';
  userRole = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userName = localStorage.getItem('user_firstname') || localStorage.getItem('username') || 'Utilisateur';
    this.userRole = localStorage.getItem('user_role') || '';
    this.loadStats();
  }

  loadStats() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (data) => this.totalCourses = data.length,
      error: () => this.totalCourses = 0
    });
    
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (data) => {
        this.totalStudents = data.length;
        data.forEach(student => {
          this.http.get<any>(`http://localhost:8080/api/students/${student.id}/courses`).subscribe({
            next: (studentData) => this.totalEnrollments += studentData.courses?.length || 0,
            error: () => {}
          });
        });
      },
      error: () => this.totalStudents = 0
    });
  }

  isTutor(): boolean {
    return this.userRole === 'TUTOR' || this.userRole === 'ADMIN';
  }

  navigate(page: string) {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  }
}
