import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseManagementComponent } from './course-management/course-management.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    CourseManagementComponent,
    DashboardComponent,
    StudentManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
