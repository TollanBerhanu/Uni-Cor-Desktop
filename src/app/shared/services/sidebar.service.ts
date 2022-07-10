import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  collapsed = false;

  collapseSidebar(){
    this.collapsed = !this.collapsed;
    console.log(this.collapsed);
    return this.collapsed;
  }
}
