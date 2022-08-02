import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  institutionName = '';
  institutionAbbr = '';
  faculty = '';
  department = '';
  courseName = '';
  courseCode = '';
  instructorName = '';
  prefix = '';

  id = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getSetting().subscribe((res: any) => {
      res = res.data[0];
      this.institutionName = res.institutionName;
      this.institutionAbbr = res.institutionAbbr;
      this.faculty = res.faculty;
      this.department = res.department;
      this.courseName = res.courseName;
      this.courseCode = res.courseCode;
      this.instructorName = res.instructorName;
      this.prefix = res.prefix;
      // eslint-disable-next-line no-underscore-dangle
      this.id = res._id;
    });
  }

  saveSettings(){
    const setting = {
      institutionName: this.institutionName,
      institutionAbbr: this.institutionAbbr,
      faculty: this.faculty,
      department: this.department,
      courseName: this.courseName,
      courseCode: this.courseCode,
      instructorName: this.instructorName,
      prefix: this.prefix
    };
    this.api.updateSetting(setting, this.id).subscribe((res: any) => {
      console.log('Saved Settings!');
    });
  }
}
