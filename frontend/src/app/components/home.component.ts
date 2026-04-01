import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-wrapper">
      <div class="home-container">
        <!-- Header -->
        <div class="home-header">
          <div class="logo">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h1>EnglishFlow</h1>
          <p class="subtitle">Plateforme académique d'apprentissage de l'anglais</p>
        </div>

        <!-- Features -->
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon blue">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3>Cours interactifs</h3>
            <p>Accédez à des cours d'anglais structurés et adaptés à votre niveau</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon purple">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3>Quiz & Évaluations</h3>
            <p>Testez vos connaissances avec des quiz interactifs</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon green">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3>Communauté</h3>
            <p>Rejoignez des clubs et échangez avec d'autres apprenants</p>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="cta-section">
          <h2>Prêt à commencer votre apprentissage ?</h2>
          <div class="cta-buttons">
            <button class="btn-primary" (click)="goToLogin()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Se connecter
            </button>
            <button class="btn-secondary" (click)="goToRegister()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Créer un compte
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="home-footer">
          <p>Propulsé par Keycloak & Spring Cloud Microservices</p>
          <div class="tech-badges">
            <span class="badge">Angular</span>
            <span class="badge">Spring Boot</span>
            <span class="badge">Node.js</span>
            <span class="badge">PostgreSQL</span>
            <span class="badge">MySQL</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
      padding: 40px 20px;
      position: relative;
      overflow: hidden;
    }

    .home-wrapper::before {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      top: -300px;
      right: -300px;
      animation: float 20s ease-in-out infinite;
    }

    .home-wrapper::after {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      bottom: -250px;
      left: -250px;
      animation: float 15s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(30px, 30px); }
    }

    .home-container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      width: 100%;
      text-align: center;
    }

    .home-header {
      margin-bottom: 60px;
      animation: fadeInDown 0.8s ease-out;
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo {
      width: 96px;
      height: 96px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3); }
      50% { transform: scale(1.05); box-shadow: 0 25px 50px rgba(59, 130, 246, 0.4); }
    }

    .home-header h1 {
      font-size: 56px;
      font-weight: 800;
      color: white;
      margin: 0 0 16px 0;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-weight: 500;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      margin-bottom: 80px;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px 32px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .feature-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .feature-icon {
      width: 72px;
      height: 72px;
      margin: 0 auto 24px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    }

    .feature-card:hover .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .feature-icon.blue {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
      color: #60a5fa;
    }

    .feature-icon.purple {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
      color: #a78bfa;
    }

    .feature-icon.green {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
      color: #34d399;
    }

    .feature-card h3 {
      font-size: 24px;
      font-weight: 700;
      color: white;
      margin: 0 0 12px 0;
    }

    .feature-card p {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      line-height: 1.6;
    }

    .cta-section {
      margin-bottom: 60px;
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .cta-section h2 {
      font-size: 36px;
      font-weight: 700;
      color: white;
      margin: 0 0 32px 0;
      letter-spacing: -0.5px;
    }

    .cta-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 36px;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      min-width: 200px;
      justify-content: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    }

    .btn-primary:active,
    .btn-secondary:active {
      transform: translateY(-2px);
    }

    .home-footer {
      animation: fadeIn 0.8s ease-out 0.6s both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .home-footer p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0 16px 0;
    }

    .tech-badges {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .badge {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.3s;
    }

    .badge:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: white;
    }

    @media (max-width: 768px) {
      .home-header h1 {
        font-size: 40px;
      }

      .subtitle {
        font-size: 16px;
      }

      .features {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .cta-section h2 {
        font-size: 28px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {
    // Vérifier si déjà connecté
    const token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
