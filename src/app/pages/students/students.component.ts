import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  studentName= '';
  students = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getAllStudents().subscribe((res: any) => {
      this.students = res.data;
    });
  }

  addStudent(){
    const data = {
      studentname: this.studentName,
      exam: {}
    };
    this.api.saveStudent(data).subscribe((res: any) => {
      console.log(res);
      alert('Student Added!');
    });
  }

}
