import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { GenerateQaSheetService } from '../../../core/services/generate-qa-sheet.service';

@Component({
  selector: 'app-generate-questionsheet',
  templateUrl: './generate-questionsheet.component.html',
  styleUrls: ['./generate-questionsheet.component.scss']
})
export class GenerateQuestionsheetComponent implements OnInit {

  institutionName = '';
  institutionAbbr = '';
  faculty = '';
  department = '';
  courseName = '';
  courseCode = '';
  instructorName = '';
  prefix = '';

  constructor(private api: ApiService, private generate: GenerateQaSheetService) { }

  ngOnInit(): void {

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

    //Get exam
    this.api.getAllExams().subscribe((res: any) => {
      console.log(res);
    });
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

  /* onPrint() {
    window.print();
  } */

}
