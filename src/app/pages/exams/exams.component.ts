import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ElectronService } from '../../core/services/electron/electron.service';

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

  exams = [];

  observer: MutationObserver;

  constructor(private elRef: ElementRef, private electron: ElectronService){}

  ngOnInit(){
    $.getScript('/assets/js/exams.js'); //Add path to your custom js file

    this.exams = this.electron.getAllExams();
    console.log(this.electron.getAllExams());
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

}
