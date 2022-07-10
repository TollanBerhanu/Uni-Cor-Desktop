import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {

  collapsed = false;

  sidebarText = {
    score: 'Score Exams',
    exams: 'My Exams',
    students: 'My Students',
    help: 'Help',
    settings: 'Settings'
  };

  constructor() { }

  ngOnInit(): void {
  }

  collapseSidebar(){
    this.collapsed = !this.collapsed;
  }

}
