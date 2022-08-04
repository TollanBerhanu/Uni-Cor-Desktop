import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { GenerateQaSheetService } from '../../../core/services/generate-qa-sheet.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss']
})
export class EditExamComponent implements OnInit {
  sectionsAdded: string[] = [];

  tf = false;
  tfqn: number[] = [];
  choice = false;
  choiceqn: number[] = [];
  choiceopt = [[0]];
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

  examID: string;

  constructor(private electron: ElectronService, private api: ApiService, private edit: GenerateQaSheetService) { }

  ngOnInit(): void {
    this.api.getAllExams().subscribe((res: any) => {
      res = res.data[this.edit.toBeEdited];

      this.examID = res._id;

      //Section content
      this.examName = res.examname;
      this.examType = res.examtype;
      this.tfQn = res.exam.tf.qn;
      this.tfAns = res.exam.tf.ans;
      this.choiceQn = res.exam.choice.qn;
      this.choiceAns = res.exam.choice.ans;
      this.choiceOpt = res.exam.choice.opt;
      this.fillQn = res.exam.fill.qn;
      this.fillAns = res.exam.fill.ans;
      this.defineQn = res.exam.define.qn;
      this.defineAns = res.exam.define.ans;
      this.shortansQn = res.exam.shortans.qn;
      this.shortansAns = res.exam.shortans.ans;

      //Section Visibility
      this.tf = res.exam.content.tf;
      this.choice = res.exam.content.choice;
      this.fill = res.exam.content.fill;
      this.define = res.exam.content.define;
      this.shortans = res.exam.content.shortans;

      //Question Visibility
      this.tfqn = res.exam.tf.qn;
      this.choiceqn = res.exam.choice.qn;
      this.choiceopt = res.exam.choice.opt;
      this.fillqn = res.exam.fill.qn;
      this.defineqn = res.exam.define.qn;
      this.shortansqn = res.exam.shortans.qn;

      //Section numbers
      if(this.tf) {this.sectionsAdded.push('tf');}
      if(this.choice) {this.sectionsAdded.push('choice');}
      if(this.fill) {this.sectionsAdded.push('fill');}
      if(this.define) {this.sectionsAdded.push('define');}
      if(this.shortans) {this.sectionsAdded.push('shortans');}
    });
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
      case 'choice':
        this.choiceqn.push(this.choiceqn.length);
        this.choiceopt.push([0]);
        this.choiceOpt.push(['']);
        console.log(this.choiceopt); break;
      case 'fill': this.fillqn.push(this.fillqn.length); break;
      case 'define': this.defineqn.push(this.defineqn.length); break;
      case 'shortans': this.shortansqn.push(this.shortansqn.length); break;
    }
  }

  addChoiceOption(choice: number, question: number){
    this.choiceopt[question].push(this.choiceopt[question].length);
    console.log(this.choiceopt);
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
      },
      content: {
        tf: this.tf,
        choice: this.choice,
        fill: this.fill,
        define: this.define,
        shortans: this.shortans,
      }
    };

    console.log(examContent);
    this.api.updateExam({examname: this.examName, examtype: this.examType, exam: examContent}, this.examID);

    // ipcRenderer.send('msg', 'Hello from angular');
    // ipcRenderer.on('reply', (event, data)=> {
    //   console.log(data);
    // });
  }

}
