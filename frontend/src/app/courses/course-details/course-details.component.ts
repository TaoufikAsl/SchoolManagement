import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';


@Component({
  selector: 'app-course-detail',
  standalone:true,

  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getCourses().subscribe((courses) => {
        this.course = courses.find(course => course.id === +id) || null;
      });
    }
  }
}
