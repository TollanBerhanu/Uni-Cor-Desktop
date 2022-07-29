import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ipcRenderer } from 'electron';
import * as fs from 'fs';
import { ElectronService } from '../../../core/services/electron/electron.service';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.scss']
})
export class CreateExamComponent implements OnInit {
  sectionsAdded: string[] = [];

  tf = false;
  tfqn: number[] = [];
  choice = false;
  choiceqn: number[] = [];
  choiceopt = [[1]];
  choicelbl = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  fill = false;
  fillqn: number[] = [];
  define = false;
  defineqn: number[] = [];
  shortans = false;
  shortansqn: number[] = [];

  examName = '';
  examType = '';
  tfQn: string[] = [];
  tfAns: string[] = [];
  choiceQn: string[] = [];
  choiceAns: string[] = [];
  choiceOpt = [['']];
  fillQn: string[] = [];
  fillAns: string[] = [];
  defineQn: string[] = [];
  defineAns: string[] = [];
  shortansQn: string[] = [];
  shortansAns: string[] = [];


  constructor(private electron: ElectronService) { }

  ngOnInit(): void {
  }

  addSection(section: string){
    switch(section){
      case 'tf': this.tf = true; break;
      case 'choice': this.choice = true; break;
      case 'fill': this.fill = true; break;
      case 'define': this.define = true; break;
      case 'shortans': this.shortans = true; break;
    }
    this.sectionsAdded.push(section);
  }

  removeSection(section: string){
    switch(section){
      case 'tf': this.tf = false; break;
      case 'choice': this.choice = false; break;
      case 'fill': this.fill = false; break;
      case 'define': this.define = false; break;
      case 'shortans': this.shortans = false; break;
    }
    this.sectionsAdded.splice(this.sectionsAdded.indexOf(section), 1);
  }

  resolveSection(section: string){
    let secno: string;
    let secPriority = [0,0,0,0,0];
    if(section === 'tf') { secPriority[0] = 10; }
    if(section === 'choice') { secPriority[1] = 8; }
    if(section === 'fill') { secPriority[2] = 6; }
    if(section === 'define') { secPriority[3] = 4; }
    if(section === 'shortans') { secPriority[4] = 2; }
    secPriority = secPriority.sort();
    return this.sectionsAdded.indexOf(section) + 1;
  }

  addQuestion(question: string){
    switch(question){
      case 'tf': this.tfqn.push(this.tfqn.length); break;
      case 'choice': this.choiceqn.push(this.choiceqn.length); this.choiceopt.push([1]); break;
      case 'fill': this.fillqn.push(this.fillqn.length); break;
      case 'define': this.defineqn.push(this.defineqn.length); break;
      case 'shortans': this.shortansqn.push(this.shortansqn.length); break;
    }
  }

  addChoiceOption(choice: number, question: number){
    this.choiceopt[question].push(this.choiceopt[question].length);
  }
  toChoiceLabel(choiceno: number){
    return this.choicelbl[choiceno];
  }
  removeChoiceOption(choice: number, question: number){
    this.choiceopt[question].splice(choice, 1);
  }

  removeQuestion(question: string, no: number){
    switch(question){
      case 'tf': this.tfqn.splice(no, 1); break;
      case 'choice': this.choiceqn.splice(no, 1); this.choiceopt.splice(no, 1); break;
      case 'fill': this.fillqn.splice(no, 1); break;
      case 'define': this.defineqn.splice(no, 1); break;
      case 'shortans': this.shortansqn.splice(no, 1); break;
    }
  }

  onSubmit(examForm: NgForm){
    console.log(examForm.value);
    // this.electron.saveExam(examForm);
  }

  sendToElectron(){
    const examContent = {
      tf: {
        qn: this.tfQn,
        ans: this.tfAns
      },
      choice: {
        qn: this.choiceQn,
        opt: this.choiceOpt,
        ans: this.choiceAns
      },
      fill: {
        qn: this.fillQn,
        ans: this.fillAns
      },
      define: {
        qn: this.defineQn,
        ans: this.defineAns
      },
      shortans: {
        qn: this.shortansQn,
        ans: this.shortansAns
      }
    };

    console.log(examContent);
    this.electron.saveExam(this.examName, this.examType, examContent);

    // ipcRenderer.send('msg', 'Hello from angular');
    // ipcRenderer.on('reply', (event, data)=> {
    //   console.log(data);
    // });
  }

}
