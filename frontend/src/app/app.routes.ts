import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { LayoutComponent } from './components/layout.component';
import { DashboardComponent } from './components/dashboard.component';
import { CoursesComponent } from './components/courses.component';
import { StudentsComponent } from './components/students.component';
import { EnrollmentsComponent } from './components/enrollments.component';
import { ComplaintsComponent } from './components/complaints.component';
import { ClubsComponent } from './components/clubs.component';
import { QuizComponent } from './components/quiz.component';
import { UsersComponent } from './components/users.component';
import { MyCoursesComponent } from './components/my-courses.component';
import { MyComplaintsComponent } from './components/my-complaints.component';
import { MyClubsComponent } from './components/my-clubs.component';
import { TakeQuizComponent } from './components/take-quiz.component';
import { UsersApprovalComponent } from './components/users-approval.component';
import { MyQuizHistoryComponent } from './components/my-quiz-history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'my-courses', component: MyCoursesComponent },
      { path: 'my-complaints', component: MyComplaintsComponent },
      { path: 'my-clubs', component: MyClubsComponent },
      { path: 'my-quiz-history', component: MyQuizHistoryComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'users-approval', component: UsersApprovalComponent },
      { path: 'enrollments', component: EnrollmentsComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'clubs', component: ClubsComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'quiz/take/:id', component: TakeQuizComponent },
      { path: 'users', component: UsersComponent }
    ]
  },
  { path: '**', redirectTo: '/' }
];
