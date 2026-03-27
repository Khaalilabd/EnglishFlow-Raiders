import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-title">EnglishFlow</span>
            <span class="logo-subtitle">Academic</span>
          </div>
        </div>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-label">PRINCIPAL</span>
          <a [class.active]="currentPage === 'dashboard'" (click)="navigate('dashboard')" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span>Dashboard</span>
            @if (currentPage === 'dashboard') {
              <div class="active-indicator"></div>
            }
          </a>

          <a [class.active]="currentPage === 'courses'" (click)="navigate('courses')" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span>Cours</span>
            @if (currentPage === 'courses') {
              <div class="active-indicator"></div>
            }
          </a>

          <a [class.active]="currentPage === 'quiz'" (click)="navigate('quiz')" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span>Quiz</span>
            @if (currentPage === 'quiz') {
              <div class="active-indicator"></div>
            }
          </a>
        </div>

        @if (isTutor()) {
          <div class="nav-section">
            <span class="nav-label">GESTION</span>
            <a [class.active]="currentPage === 'students'" (click)="navigate('students')" class="nav-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Étudiants</span>
              @if (currentPage === 'students') {
                <div class="active-indicator"></div>
              }
            </a>

            <a [class.active]="currentPage === 'enrollments'" (click)="navigate('enrollments')" class="nav-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>Inscriptions</span>
              @if (currentPage === 'enrollments') {
                <div class="active-indicator"></div>
              }
            </a>
          </div>
        }

        <div class="nav-section">
          <span class="nav-label">COMMUNAUTÉ</span>
          <a [class.active]="currentPage === 'clubs'" (click)="navigate('clubs')" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Clubs</span>
            @if (currentPage === 'clubs') {
              <div class="active-indicator"></div>
            }
          </a>

          <a [class.active]="currentPage === 'complaints'" (click)="navigate('complaints')" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Réclamations</span>
            @if (currentPage === 'complaints') {
              <div class="active-indicator"></div>
            }
          </a>
        </div>

        @if (isAdmin()) {
          <div class="nav-section">
            <span class="nav-label">ADMINISTRATION</span>
            <a [class.active]="currentPage === 'users'" (click)="navigate('users')" class="nav-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <span>Utilisateurs</span>
              @if (currentPage === 'users') {
                <div class="active-indicator"></div>
              }
            </a>
          </div>
        }
      </div>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">
            <div class="avatar-gradient">{{getUserInitials()}}</div>
            <div class="status-indicator"></div>
          </div>
          <div class="user-details">
            <span class="user-name">{{getUserName()}}</span>
            <span class="user-role">{{getRoleLabel()}}</span>
          </div>
          <button class="logout-btn" (click)="logout()" title="Déconnexion">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #0a0e27 0%, #0f1629 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(20px);
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
    }

    .logo-subtitle {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 20px 16px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    }

    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .nav-section {
      margin-bottom: 28px;
    }

    .nav-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 0 12px;
      display: block;
      margin-bottom: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 12px;
      margin: 4px 0;
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .nav-item:hover {
      color: white;
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-item:hover::before {
      opacity: 1;
    }

    .nav-item.active {
      color: white;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .nav-item.active::before {
      opacity: 1;
    }

    .nav-item svg {
      flex-shrink: 0;
      transition: transform 0.3s;
    }

    .nav-item:hover svg {
      transform: scale(1.1);
    }

    .nav-item span {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .active-indicator {
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(0.9); }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      transition: all 0.3s;
    }

    .user-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      position: relative;
      flex-shrink: 0;
    }

    .avatar-gradient {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid #0a0e27;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }

    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .logout-btn {
      width: 36px;
      height: 36px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ef4444;
      cursor: pointer;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
      transform: scale(1.05);
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 240px;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
        position: relative;
      }

      .sidebar-nav {
        max-height: 400px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentPage = 'dashboard';
  userRole = '';
  userName = '';
  
  ngOnInit() {
    this.userRole = localStorage.getItem('user_role') || '';
    this.userName = localStorage.getItem('user_firstname') || localStorage.getItem('username') || 'User';
    
    window.addEventListener('navigate', (event: any) => {
      this.currentPage = event.detail;
    });
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

  getUserName(): string {
    return this.userName;
  }

  getUserInitials(): string {
    const firstName = localStorage.getItem('user_firstname') || '';
    const lastName = localStorage.getItem('user_lastname') || '';
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    return this.userName.substring(0, 2).toUpperCase();
  }

  getRoleLabel(): string {
    switch(this.userRole) {
      case 'ADMIN': return 'Administrateur';
      case 'TUTOR': return 'Tuteur';
      case 'STUDENT': return 'Étudiant';
      default: return 'Utilisateur';
    }
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }
}
