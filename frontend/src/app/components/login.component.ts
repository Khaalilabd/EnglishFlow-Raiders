import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🔐 {{isRegisterMode ? 'Créer un compte' : 'Authentification'}}</h1>
          <p>Microservices Demo - Architecture Complète</p>
        </div>
        
        <form (ngSubmit)="isRegisterMode ? onRegister() : onLogin()" class="login-form">
          <div *ngIf="isRegisterMode">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" [(ngModel)]="firstName" name="firstName" [required]="isRegisterMode" [disabled]="loading">
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" [(ngModel)]="lastName" name="lastName" [required]="isRegisterMode" [disabled]="loading">
            </div>
          </div>
          
          <div class="form-group" *ngIf="isRegisterMode">
            <label>📧 Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="votre@email.com"
              [required]="isRegisterMode"
              [disabled]="loading">
          </div>
          
          <div class="form-group">
            <label>👤 Nom d'utilisateur</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username"
              placeholder="demo"
              required
              [disabled]="loading">
          </div>
          
          <div class="form-group">
            <label>🔒 Mot de passe</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="demo123"
              required
              [disabled]="loading">
          </div>
          
          <div class="form-group" *ngIf="isRegisterMode">
            <label>🔒 Confirmer le mot de passe</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              placeholder="Confirmer"
              [required]="isRegisterMode"
              [disabled]="loading">
          </div>
          
          <button type="submit" class="btn-login" [disabled]="loading">
            <span *ngIf="!loading">{{isRegisterMode ? '✨ Créer le compte' : '🚀 Se connecter'}}</span>
            <span *ngIf="loading">⏳ {{isRegisterMode ? 'Création...' : 'Connexion...'}}</span>
          </button>
          
          <div class="toggle-mode">
            <a (click)="toggleMode()" *ngIf="!loading">
              {{isRegisterMode ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}}
            </a>
          </div>
          
          <div *ngIf="error" class="error-message">
            ❌ {{error}}
          </div>
          
          <div *ngIf="success" class="success-message">
            ✅ {{success}}
          </div>
        </form>
        
        <div class="info-box" *ngIf="!isRegisterMode">
          <h3>ℹ️ Informations de test</h3>
          <div class="credentials">
            <p><strong>Username:</strong> demo</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
          <div class="tech-stack">
            <span class="tech-badge">Keycloak</span>
            <span class="tech-badge">OAuth2</span>
            <span class="tech-badge">JWT</span>
          </div>
        </div>
        
        <div class="architecture-info">
          <h4>🎯 Architecture</h4>
          <div class="flow">
            <span>Frontend</span>
            <span>→</span>
            <span>API Gateway</span>
            <span>→</span>
            <span>Auth Service</span>
            <span>→</span>
            <span>Keycloak</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 500px;
      animation: slideUp 0.5s ease;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-header h1 {
      color: #667eea;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    
    .login-header p {
      color: #666;
      margin: 0;
    }
    
    .login-form {
      margin-bottom: 30px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 600;
      font-size: 14px;
    }
    
    input {
      width: 100%;
      padding: 14px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    
    input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
    
    .btn-login {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    }
    
    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      margin-top: 15px;
      padding: 12px;
      background: #fee;
      color: #c33;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      animation: shake 0.5s;
    }
    
    .success-message {
      margin-top: 15px;
      padding: 12px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
      animation: fadeIn 0.5s;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    .toggle-mode {
      text-align: center;
      margin-top: 15px;
    }
    
    .toggle-mode a {
      color: #667eea;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }
    
    .toggle-mode a:hover {
      color: #764ba2;
      text-decoration: underline;
    }
    
    .info-box {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    
    .info-box h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }
    
    .credentials {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .credentials p {
      margin: 5px 0;
      color: #666;
      font-family: monospace;
    }
    
    .tech-stack {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .tech-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .architecture-info {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 20px;
      border-radius: 10px;
      color: white;
    }
    
    .architecture-info h4 {
      margin: 0 0 15px 0;
      font-size: 16px;
    }
    
    .flow {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .flow span {
      background: rgba(255,255,255,0.2);
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';
  firstName = '';
  lastName = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';
  isRegisterMode = false;

  constructor(private http: HttpClient) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.success = '';
    this.username = '';
    this.password = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.confirmPassword = '';
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    console.log('Attempting login with:', { username: this.username });

    this.http.post<any>('http://localhost:8080/api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('user_role', response.role);
        localStorage.setItem('user_email', response.email);
        localStorage.setItem('user_firstname', response.firstName || '');
        localStorage.setItem('user_lastname', response.lastName || '');
        this.loading = false;
        this.success = 'Connexion réussie! Redirection...';
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('login-success'));
        }, 500);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez que les services sont démarrés.';
        } else if (err.status === 401) {
          this.error = 'Identifiants incorrects. Utilisez demo/demo123';
        } else if (err.status === 404) {
          this.error = 'Service d\'authentification non disponible';
        } else {
          this.error = err.error?.message || 'Erreur de connexion. Réessayez.';
        }
      }
    });
  }

  onRegister() {
    if (!this.username || !this.password || !this.email || !this.firstName || !this.lastName || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    console.log('Attempting registration with:', { username: this.username, email: this.email });

    this.http.post<any>('http://localhost:8080/api/auth/register', {
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      role: 'STUDENT'
    }).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.loading = false;
        this.success = 'Compte créé avec succès! Vous pouvez maintenant vous connecter.';
        setTimeout(() => {
          this.toggleMode();
        }, 2000);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur';
        } else if (err.status === 409) {
          this.error = 'Ce nom d\'utilisateur ou email existe déjà';
        } else {
          this.error = err.error?.message || 'Erreur lors de la création du compte';
        }
      }
    });
  }
}
