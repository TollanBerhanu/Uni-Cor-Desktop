import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';

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

  observer: MutationObserver;

  constructor(private elRef: ElementRef){}

  ngOnInit(){
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

}
