import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateQaSheetService {

  selectedExam: Observable<string>;

  constructor() { }

  setSelectedExam(id: any){
    this.selectedExam = id;
  }

  getSelectedExam(){
    return this.selectedExam;
  }
}
