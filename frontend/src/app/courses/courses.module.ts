import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'; // Si vous utilisez MatCard

import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-details/course-details.component';
import { CourseRoutingModule } from './courses-routing.module';

@NgModule({
  declarations: [
    CourseListComponent,
    CourseDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule, 
    MatCardModule,   
    CourseRoutingModule
  ]
})
export class CourseModule { }
