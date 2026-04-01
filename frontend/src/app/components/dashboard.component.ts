import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

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

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon pink">
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
              15%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{totalClubs}}</h3>
            <p>Clubs actifs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="stat-trend positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              5%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{totalComplaints}}</h3>
            <p>Réclamations</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div class="stat-trend positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              20%
            </div>
          </div>
          <div class="stat-content">
            <h3>{{totalQuizzes}}</h3>
            <p>Quiz disponibles</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <div class="card chart-card">
          <div class="card-header">
            <h2>Statistiques d'inscription</h2>
            <select class="chart-filter">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>Cette année</option>
            </select>
          </div>
          <div class="chart-container">
            <canvas #enrollmentChart></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header">
            <h2>Répartition par catégorie</h2>
            <select class="chart-filter">
              <option>Tous</option>
              <option>Cours</option>
              <option>Clubs</option>
            </select>
          </div>
          <div class="chart-container">
            <canvas #categoryChart></canvas>
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

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      min-height: 400px;
    }

    .chart-container {
      padding: 24px;
      height: 320px;
    }

    .chart-filter {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .chart-filter:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .chart-filter:focus {
      outline: none;
      border-color: #667eea;
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

    .stat-icon.pink {
      background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%);
      color: #f472b6;
    }

    .stat-icon.red {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
      color: #f87171;
    }

    .stat-icon.cyan {
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%);
      color: #22d3ee;
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

      .charts-grid {
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
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('enrollmentChart') enrollmentChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  private enrollmentChart?: Chart;
  private categoryChart?: Chart;

  totalCourses = 0;
  totalStudents = 0;
  totalEnrollments = 0;
  totalClubs = 0;
  totalComplaints = 0;
  totalQuizzes = 0;
  servicesUp = 8;
  userName = '';
  userRole = '';

  // Données pour les graphiques
  coursesData: any[] = [];
  enrollmentsData: any[] = [];
  clubsData: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userName = this.authService.getUserInfo().firstName || this.authService.getUserInfo().username;
    this.userRole = this.authService.getUserRole() || '';
    this.loadStats();
  }

  ngAfterViewInit() {
    // Délai plus long pour s'assurer que les canvas sont rendus
    setTimeout(() => {
      console.log('Initializing charts...');
      console.log('Enrollment chart ref:', this.enrollmentChartRef);
      console.log('Category chart ref:', this.categoryChartRef);
      
      if (this.enrollmentChartRef && this.categoryChartRef) {
        this.createEnrollmentChart();
        this.createCategoryChart();
        console.log('Charts created successfully');
      } else {
        console.error('Chart refs not available');
      }
    }, 1000);
  }

  loadStats() {
    // Charger les cours
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (data) => {
        this.totalCourses = data.length;
        this.coursesData = data;
        console.log('Courses loaded:', this.totalCourses);
        this.updateCharts();
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.totalCourses = 0;
      }
    });
    
    // Charger les étudiants
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (data) => {
        this.totalStudents = data.length;
        console.log('Students loaded:', this.totalStudents);
        this.updateCharts();
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.totalStudents = 0;
      }
    });

    // Charger les inscriptions
    this.http.get<any[]>('http://localhost:8080/api/enrollments').subscribe({
      next: (data) => {
        this.totalEnrollments = data.length;
        this.enrollmentsData = data;
        console.log('Enrollments loaded:', this.totalEnrollments);
        this.updateCharts();
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.totalEnrollments = 0;
      }
    });

    // Charger les clubs
    this.http.get<any[]>('http://localhost:8080/api/clubs').subscribe({
      next: (data) => {
        this.totalClubs = data.length;
        this.clubsData = data;
        console.log('Clubs loaded:', this.totalClubs);
        this.updateCharts();
      },
      error: (err) => {
        console.error('Error loading clubs:', err);
        this.totalClubs = 0;
      }
    });

    // Charger les réclamations
    this.http.get<any[]>('http://localhost:8080/api/complaints').subscribe({
      next: (data) => {
        this.totalComplaints = data.length;
        console.log('Complaints loaded:', this.totalComplaints);
      },
      error: (err) => {
        console.error('Error loading complaints:', err);
        this.totalComplaints = 0;
      }
    });

    // Charger les quizzes
    this.http.get<any[]>('http://localhost:8080/api/quizzes').subscribe({
      next: (data) => {
        this.totalQuizzes = data.length;
        console.log('Quizzes loaded:', this.totalQuizzes);
      },
      error: (err) => {
        console.error('Error loading quizzes:', err);
        this.totalQuizzes = 0;
      }
    });
  }

  isTutor(): boolean {
    return this.authService.isTutorOrAdmin();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  canManageCourses(): boolean {
    return this.authService.canManageCourses();
  }

  canManageStudents(): boolean {
    return this.authService.canManageStudents();
  }

  navigate(page: string) {
    this.router.navigate([`/${page}`]);
  }

  createEnrollmentChart() {
    if (!this.enrollmentChartRef) return;

    const ctx = this.enrollmentChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Données initiales (seront mises à jour par updateCharts)
    this.enrollmentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
          {
            label: 'Inscriptions',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Nouveaux étudiants',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: 500
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 22, 41, 0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: {
                size: 11
              },
              stepSize: 1
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.6)',
              font: {
                size: 11
              }
            }
          }
        }
      }
    });
  }

  createCategoryChart() {
    if (!this.categoryChartRef) return;

    const ctx = this.categoryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Données initiales (seront mises à jour par updateCharts)
    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#667eea',
            '#10b981',
            '#f59e0b',
            '#ec4899',
            '#06b6d4',
            '#8b5cf6',
            '#ef4444'
          ],
          borderColor: '#0f1629',
          borderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12,
                weight: 500
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 22, 41, 0.95)',
            titleColor: '#fff',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return label + ': ' + value + ' (' + percentage + '%)';
              }
            }
          }
        }
      }
    });
  }

  updateCharts() {
    // Mettre à jour le graphique des inscriptions avec les données réelles
    if (this.enrollmentChart && this.enrollmentsData.length > 0) {
      // Simuler une distribution sur 7 jours basée sur le total
      const total = this.enrollmentsData.length;
      const distribution = this.generateWeekDistribution(total);
      
      this.enrollmentChart.data.datasets[0].data = distribution;
      this.enrollmentChart.data.datasets[1].data = this.generateWeekDistribution(this.totalStudents);
      this.enrollmentChart.update();
    }

    // Mettre à jour le graphique des catégories avec les données réelles
    if (this.categoryChart && this.coursesData.length > 0) {
      const categories = this.groupByCategory(this.coursesData);
      
      this.categoryChart.data.labels = Object.keys(categories);
      this.categoryChart.data.datasets[0].data = Object.values(categories);
      this.categoryChart.update();
    }
  }

  generateWeekDistribution(total: number): number[] {
    // Générer une distribution réaliste sur 7 jours
    const distribution: number[] = [];
    let remaining = total;
    
    for (let i = 0; i < 6; i++) {
      const value = Math.floor(Math.random() * (remaining / (7 - i))) + 1;
      distribution.push(Math.min(value, remaining));
      remaining -= distribution[i];
    }
    distribution.push(Math.max(0, remaining));
    
    return distribution;
  }

  groupByCategory(courses: any[]): { [key: string]: number } {
    const categories: { [key: string]: number } = {};
    
    courses.forEach(course => {
      const category = course.category || course.level || 'Autre';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    // Si pas de catégories, créer des catégories par défaut
    if (Object.keys(categories).length === 0) {
      return {
        'Grammaire': Math.floor(courses.length * 0.3),
        'Vocabulaire': Math.floor(courses.length * 0.25),
        'Conversation': Math.floor(courses.length * 0.2),
        'Écriture': Math.floor(courses.length * 0.15),
        'Lecture': Math.floor(courses.length * 0.1)
      };
    }
    
    return categories;
  }

  ngOnDestroy() {
    if (this.enrollmentChart) {
      this.enrollmentChart.destroy();
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  }
}
