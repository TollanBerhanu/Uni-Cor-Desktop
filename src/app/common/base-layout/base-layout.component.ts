import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {

  collapsed = false;
  showText = true;

  sidebarText = {
    score: 'Score Exam',
    exams: 'My Exams',
    students: 'My Students',
    help: 'Help',
    settings: 'Settings'
  };

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.collapsed = this.sidebarService.collapsed;
    this.showText = !this.collapsed;
  }

  collapseSidebar(){
    this.collapsed = this.sidebarService.collapseSidebar();

    if(this.showText) { this.showText = !this.collapsed; }
    else {
      setTimeout(()=>{
        this.showText = !this.collapsed;
      }, 400);
    }
  }

}
