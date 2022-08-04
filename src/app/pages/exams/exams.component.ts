import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ElectronService } from '../../core/services/electron/electron.service';
import { ApiService } from '../../core/services/api.service';
import { GenerateQaSheetService } from '../../core/services/generate-qa-sheet.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

  institutionName = '';
  institutionAbbr = '';
  faculty = '';
  department = '';
  courseName = '';
  courseCode = '';
  instructorName = '';
  prefix = '';

  exams = [];

  selectedExam = {
    examname: '',
    examtype: '',
    exam: {
      content: {
        tf: false, choice: false, fill: false, define: false, shortans: false
      }
    }
  };

  options = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  observer: MutationObserver;

  constructor(private elRef: ElementRef,
    private electron: ElectronService,
    private api: ApiService,
    private generate: GenerateQaSheetService){}

  ngOnInit(){
    // Get Exam headers
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
    });


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

  generateSheet(id: number, type: string){
    this.selectedExam = this.exams[id];
    console.log(this.selectedExam);
  }
  editExam(i: number){
    this.generate.toBeEdited = i;
  }

  exportAsPDF(divId: string)
  {
    const data = document.getElementById(divId);

    html2canvas(data).then(canvas => {

      const docWidth = 208;
      const docHeight = canvas.height * docWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);

      doc.save('transcript.pdf');
    });
  }

}
