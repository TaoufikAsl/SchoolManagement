import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CourseManagementComponent } from './admin/course-management/course-management.component';
import { StudentManagementComponent } from './admin/student-management/student-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/:id', component: CourseDetailsComponent },
  { path: 'admin', component: DashboardComponent, children: [
    { path: 'course-management', component: CourseManagementComponent },
    { path: 'student-management', component: StudentManagementComponent },
  ] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
