import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './components/login.component';
import { NavbarComponent } from './components/navbar.component';
import { DashboardComponent } from './components/dashboard.component';
import { CoursesComponent } from './components/courses.component';
import { StudentsComponent } from './components/students.component';
import { EnrollmentsComponent } from './components/enrollments.component';
import { ComplaintsComponent } from './components/complaints.component';
import { ClubsComponent } from './components/clubs.component';
import { QuizComponent } from './components/quiz.component';
import { UsersComponent } from './components/users.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, NavbarComponent, DashboardComponent, CoursesComponent, StudentsComponent, EnrollmentsComponent, ComplaintsComponent, ClubsComponent, QuizComponent, UsersComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isAuthenticated = false;
  currentPage = 'dashboard';
  userRole = '';
  pageKey = 0;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('access_token');
    this.isAuthenticated = !!token;
    this.userRole = localStorage.getItem('user_role') || '';

    // Écouter les événements de navigation
    window.addEventListener('navigate', (event: any) => {
      this.currentPage = event.detail;
      this.pageKey++;
      this.cdr.detectChanges();
    });

    // Écouter l'événement de connexion réussie
    window.addEventListener('login-success', () => {
      this.isAuthenticated = true;
      this.userRole = localStorage.getItem('user_role') || '';
      this.currentPage = 'dashboard';
      this.pageKey++;
      this.cdr.detectChanges();
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_firstname');
    localStorage.removeItem('user_lastname');
    this.isAuthenticated = false;
    this.userRole = '';
    this.currentPage = 'dashboard';
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  isTutor(): boolean {
    return this.userRole === 'TUTOR' || this.userRole === 'ADMIN';
  }

  isStudent(): boolean {
    return this.userRole === 'STUDENT';
  }
}
