import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ElectronService } from '../../core/services/electron/electron.service';
import { ApiService } from '../../core/services/api.service';
import { GenerateQaSheetService } from '../../core/services/generate-qa-sheet.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit, AfterViewInit {

  examTable = {
    no: '#',
    name: 'Exam Name',
    id: 'Exam ID',
    type: 'Type',
    date: 'Date Created',
    course: 'Course Name',
    code: 'Course Code',
    status: 'Status',
    description: 'Description'
  };
  courseName = '';
  courseCode = '';

  exams = [];

  selectedExam = '';

  observer: MutationObserver;

  constructor(private elRef: ElementRef,
    private electron: ElectronService,
    private api: ApiService,
    private generate: GenerateQaSheetService){}

  ngOnInit(){
    this.api.getAllExams().subscribe((res: any) => {
      this.exams.push(...res.data);
    });

    this.api.getSetting().subscribe((res: any) => {
      res = res.data[0];
      this.courseName = res.courseName;
      this.courseCode = res.courseCode;
    });

    // this.exams = this.electron.allExams;
    // console.log(this.electron.allExams);

    $.getScript('/assets/js/exams.js'); //Add path to your custom js file

  }

  ngAfterViewInit(){
    this.observer = new MutationObserver(mutations => {
      console.log('Dom change detected...');
      $.getScript('/assets/js/exams.js'); //Add path to your custom js file
    });
    // const config = { attributes: true, childList: true, characterData: true };
    const config = { characterData: true };

    this.observer.observe(this.elRef.nativeElement);
  }

  generateSheet(id: string){
    this.selectedExam = id;
  }

}
