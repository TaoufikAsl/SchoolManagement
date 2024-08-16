import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-details/course-details.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard } from './services/guards/auth.guard';
import { CourseCreateComponent } from './courses/course-create/course-create.component';

export const routes: Routes = [
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protéger la route du tableau de bord
  { path: 'courses/create', component:CourseCreateComponent,canActivate: [AuthGuard]}, //Route pour créer un cours
  { path: 'courses/list', component: CourseListComponent, canActivate: [AuthGuard] }, // Protéger la liste des cours
  { path: 'courses/detail/:id', component: CourseDetailComponent, canActivate: [AuthGuard] }, // Protéger les détails des cours
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];
