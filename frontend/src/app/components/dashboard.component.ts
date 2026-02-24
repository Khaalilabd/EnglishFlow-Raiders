import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="welcome-banner">
        <h1>👋 Bienvenue sur le Dashboard</h1>
        <p>Architecture Microservices avec Eureka, API Gateway et OpenFeign</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{totalCourses}}</h3>
            <p>Cours disponibles</p>
          </div>
        </div>
        
        <div class="stat-card success">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{totalStudents}}</h3>
            <p>Étudiants inscrits</p>
          </div>
        </div>
        
        <div class="stat-card warning">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>{{totalEnrollments}}</h3>
            <p>Inscriptions totales</p>
          </div>
        </div>
        
        <div class="stat-card info">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <h3>{{servicesUp}}/4</h3>
            <p>Services actifs</p>
          </div>
        </div>
      </div>
      
      <div class="info-cards">
        <div class="info-card">
          <h2>🎯 Architecture Microservices</h2>
          <div class="architecture-diagram">
            <div class="service-box eureka">
              <strong>Eureka Server</strong>
              <span>Port 8761</span>
              <span class="status">✅ UP</span>
            </div>
            <div class="arrow">↓</div>
            <div class="service-box gateway">
              <strong>API Gateway</strong>
              <span>Port 8080</span>
              <span class="status">✅ UP</span>
            </div>
            <div class="arrow">↓</div>
            <div class="services-row">
              <div class="service-box auth">
                <strong>Auth Service</strong>
                <span>Port 8081</span>
                <span class="status">✅ UP</span>
              </div>
              <div class="service-box courses">
                <strong>Courses Service</strong>
                <span>Port 8082</span>
                <span class="status">✅ UP</span>
              </div>
              <div class="service-box students">
                <strong>Students Service</strong>
                <span>Port 8083</span>
                <span class="status">✅ UP</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <h2>🔗 Communication OpenFeign</h2>
          <p class="description">
            Le Student Service communique avec le Courses Service via OpenFeign pour récupérer les cours d'un étudiant.
          </p>
          <div class="openfeign-demo">
            <div class="demo-step">
              <span class="step-number">1</span>
              <p>Requête vers Student Service</p>
            </div>
            <div class="demo-arrow">→</div>
            <div class="demo-step">
              <span class="step-number">2</span>
              <p>OpenFeign appelle Courses Service</p>
            </div>
            <div class="demo-arrow">→</div>
            <div class="demo-step">
              <span class="step-number">3</span>
              <p>Données combinées et retournées</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>🚀 Actions Rapides</h2>
        <div class="actions-grid">
          <button class="action-btn" (click)="navigate('courses')">
            <span class="action-icon">📚</span>
            <span>Gérer les Cours</span>
          </button>
          <button class="action-btn" (click)="navigate('students')">
            <span class="action-icon">👥</span>
            <span>Gérer les Étudiants</span>
          </button>
          <a href="http://localhost:8761" target="_blank" class="action-btn">
            <span class="action-icon">🔍</span>
            <span>Ouvrir Eureka</span>
          </a>
          <a href="http://localhost:9090" target="_blank" class="action-btn">
            <span class="action-icon">🔐</span>
            <span>Ouvrir Keycloak</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
      animation: fadeIn 0.6s ease;
    }
    
    .welcome-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 50px 40px;
      border-radius: 20px;
      margin-bottom: 30px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .welcome-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    .welcome-banner h1 {
      margin: 0 0 10px 0;
      font-size: 36px;
      position: relative;
      z-index: 1;
    }
    
    .welcome-banner p {
      margin: 0;
      font-size: 18px;
      opacity: 0.95;
      position: relative;
      z-index: 1;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeIn 0.6s ease;
      animation-fill-mode: both;
    }
    
    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .stat-card:nth-child(4) { animation-delay: 0.4s; }
    
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
    
    .stat-icon {
      font-size: 48px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    }
    
    .stat-content h3 {
      margin: 0 0 5px 0;
      font-size: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
    
    .stat-content p {
      margin: 0;
      color: #666;
      font-weight: 500;
    }
    
    .stat-card.primary { border-left: 5px solid #667eea; }
    .stat-card.success { border-left: 5px solid #4caf50; }
    .stat-card.warning { border-left: 5px solid #ff9800; }
    .stat-card.info { border-left: 5px solid #2196f3; }
    
    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .info-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      animation: fadeIn 0.7s ease;
    }
    
    .info-card h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 22px;
    }
    
    .architecture-diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    
    .service-box {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      padding: 18px 30px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 160px;
      border: 2px solid #e0e0e0;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .service-box:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    
    .service-box strong {
      color: #333;
      font-size: 15px;
      font-weight: 600;
    }
    
    .service-box span {
      font-size: 13px;
      color: #666;
    }
    
    .service-box .status {
      color: #4caf50;
      font-weight: 700;
      font-size: 14px;
    }
    
    .service-box.eureka { border-color: #2196f3; background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%); }
    .service-box.gateway { border-color: #9c27b0; background: linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%); }
    .service-box.auth { border-color: #ff9800; background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%); }
    .service-box.courses { border-color: #667eea; background: linear-gradient(135deg, #ede7f6 0%, #ffffff 100%); }
    .service-box.students { border-color: #4caf50; background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%); }
    
    .services-row {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .arrow {
      font-size: 28px;
      color: #667eea;
      font-weight: bold;
    }
    
    .description {
      color: #666;
      line-height: 1.8;
      margin-bottom: 20px;
      font-size: 15px;
    }
    
    .openfeign-demo {
      display: flex;
      align-items: center;
      gap: 15px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 25px;
      border-radius: 12px;
      color: white;
      box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
    }
    
    .demo-step {
      flex: 1;
      text-align: center;
    }
    
    .step-number {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: white;
      color: #f5576c;
      border-radius: 50%;
      line-height: 36px;
      font-weight: 700;
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .demo-step p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
    
    .demo-arrow {
      font-size: 24px;
      font-weight: 700;
    }
    
    .quick-actions {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      animation: fadeIn 0.8s ease;
    }
    
    .quick-actions h2 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 22px;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 25px 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      font-weight: 600;
    }
    
    .action-btn:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .action-icon {
      font-size: 36px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    
    @media (max-width: 768px) {
      .welcome-banner {
        padding: 30px 20px;
      }
      
      .welcome-banner h1 {
        font-size: 28px;
      }
      
      .info-cards {
        grid-template-columns: 1fr;
      }
      
      .openfeign-demo {
        flex-direction: column;
      }
      
      .demo-arrow {
        transform: rotate(90deg);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalCourses = 0;
  totalStudents = 0;
  totalEnrollments = 0;
  servicesUp = 4;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (data) => this.totalCourses = data.length
    });
    
    this.http.get<any[]>('http://localhost:8080/api/students').subscribe({
      next: (data) => {
        this.totalStudents = data.length;
        // Calculer le total des inscriptions
        data.forEach(student => {
          this.http.get<any>(`http://localhost:8080/api/students/${student.id}/courses`).subscribe({
            next: (studentData) => this.totalEnrollments += studentData.courses.length
          });
        });
      }
    });
  }

  navigate(page: string) {
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  }
}
