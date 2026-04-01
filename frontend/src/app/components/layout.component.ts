import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="main-app">
      <app-navbar></app-navbar>
      
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .main-app {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(180deg, #0f1629 0%, #1a1f3a 100%);
    }

    .content {
      flex: 1;
      margin-left: 280px;
    }

    @media (max-width: 1024px) {
      .content {
        margin-left: 240px;
      }
    }

    @media (max-width: 768px) {
      .content {
        margin-left: 0;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Vérifier l'authentification
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/']);
    }
  }
}
