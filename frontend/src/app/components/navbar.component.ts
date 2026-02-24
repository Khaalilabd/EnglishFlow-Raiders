import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h2>🎯 Microservices Demo</h2>
        <span class="subtitle">Eureka • Gateway • OpenFeign</span>
      </div>
      <div class="nav-links">
        <a [class.active]="currentPage === 'dashboard'" (click)="navigate('dashboard')">
          📊 Dashboard
        </a>
        <a [class.active]="currentPage === 'courses'" (click)="navigate('courses')">
          📚 Courses
        </a>
        <a *ngIf="isTutor()" [class.active]="currentPage === 'students'" (click)="navigate('students')">
          👥 Students
        </a>
        <a *ngIf="isTutor()" [class.active]="currentPage === 'enrollments'" (click)="navigate('enrollments')">
          📝 Inscriptions
        </a>
        <a [class.active]="currentPage === 'complaints'" (click)="navigate('complaints')">
          📢 Réclamations
        </a>
        <a [class.active]="currentPage === 'clubs'" (click)="navigate('clubs')">
          🎭 Clubs
        </a>
        <a [class.active]="currentPage === 'quiz'" (click)="navigate('quiz')">
          📝 Quiz
        </a>
        <a *ngIf="isAdmin()" [class.active]="currentPage === 'users'" (click)="navigate('users')">
          👥 Utilisateurs
        </a>
        <a href="http://localhost:8761" target="_blank" class="external-link">
          🔍 Eureka
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      margin-bottom: 30px;
      animation: slideDown 0.5s ease;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .nav-brand {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .nav-brand h2 {
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 24px;
    }
    
    .subtitle {
      font-size: 12px;
      color: #999;
      font-weight: 500;
    }
    
    .nav-links {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .nav-links a {
      color: #666;
      text-decoration: none;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      font-size: 14px;
      position: relative;
    }
    
    .nav-links a:hover {
      background: #f8f9fa;
      color: #667eea;
      transform: translateY(-2px);
    }
    
    .nav-links a.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .nav-links a.external-link {
      border: 2px solid #667eea;
      color: #667eea;
    }
    
    .nav-links a.external-link:hover {
      background: #667eea;
      color: white;
    }
    
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .nav-links a {
        padding: 8px 16px;
        font-size: 13px;
      }
    }
  `]
})
export class NavbarComponent {
  currentPage = 'dashboard';
  userRole = '';
  
  ngOnInit() {
    this.userRole = localStorage.getItem('user_role') || '';
  }
  
  navigate(page: string) {
    this.currentPage = page;
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  }
  
  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }
  
  isTutor(): boolean {
    return this.userRole === 'TUTOR' || this.userRole === 'ADMIN';
  }
}
