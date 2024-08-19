import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailComponent } from './courses/course-details/course-details.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard } from './services/guards/auth.guard';
import { CourseCreateComponent } from './courses/course-create/course-create.component';
import { UserListComponent } from './components/users/user-list/user-list.component';


export const routes: Routes = [
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protéger la route du tableau de bord
  { path: 'courses/create', component:CourseCreateComponent,canActivate: [AuthGuard]}, //Route pour créer un cours
  { path: 'user-management', component: UserListComponent }, // Ajouter cette route
  { path: 'course/:id', component: CourseDetailComponent, canActivate: [AuthGuard]/*, data: { role: 'instructor' */} ,
  { path: 'courses/list', component: CourseListComponent, canActivate: [AuthGuard] }, // Protéger la liste des cours
  { path: 'course/:id/edit', component: CourseCreateComponent}, /*canActivate: [AuthGuard], data: { role: 'instructor' } },*/
  { path: 'admin', component: DashboardComponent},// canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'courses/detail/:id', component: CourseDetailComponent, canActivate: [AuthGuard] }, // Protéger les détails des cours
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

/*import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard } from './services/guards/auth.guard';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { CourseListComponent } from './courses/course-list/course-list.component';


export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'auth/login', 
    component: LoginComponent 
  },
  { 
    path: 'auth/register', 
    component: RegisterComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'user-management', 
    component: UserListComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'admin' }  // Accessible uniquement aux administrateurs
  },
  { 
    path: 'courses', 
    component: CourseListComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'instructor' }  // Accessible uniquement aux instructeurs
  },
  /*{ 
    path: 'student-dashboard', 
    component: StudentDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'student' }  // Accessible uniquement aux étudiants
  },
  { 
    path: 'instructor-dashboard', 
    component: InstructorDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'instructor' }  // Accessible uniquement aux instructeurs
  },
  { 
    path: 'access-denied', 
    component: AccessDeniedComponent 
  },
  { 
    path: '**', 
    redirectTo: 'dashboard'  // Redirige vers le dashboard pour les routes inconnues
  }
];*/
