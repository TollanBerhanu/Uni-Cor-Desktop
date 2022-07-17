import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.scss']
})
export class CreateExamComponent implements OnInit {
  tf = false;
  tfqn: number[] = [];
  choice = false;
  choiceqn: number[] = [];
  fill = false;
  fillqn: number[] = [];
  define = false;
  defineqn: number[] = [];
  shortans = false;
  shortansqn: number[] = [];

  constructor() { }

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
  }

  addQuestion(question: string){
    switch(question){
      case 'tf': this.tfqn.push(this.tfqn.length); break;
      case 'choice': this.choiceqn.push(this.choiceqn.length); break;
      case 'fill': this.fillqn.push(this.fillqn.length); break;
      case 'define': this.defineqn.push(this.defineqn.length); break;
      case 'shortans': this.shortansqn.push(this.shortansqn.length); break;
    }
  }

  addChoiceOption(choice: number){

  }

  onSubmit(examForm: NgForm){
    console.log(examForm);
  }

}
