import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  createCourse(course: Course) {
    this.courseService.createCourse(course).subscribe(response => {
      this.courses.push(response);
    });
  }

  updateCourse(course: Course) {
    this.courseService.updateCourse(course.id!, course).subscribe(() => {
      this.loadCourses();
    });
  }

  deleteCourse(id: number) {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.courses = this.courses.filter(course => course.id !== id);
    });
  }
}
