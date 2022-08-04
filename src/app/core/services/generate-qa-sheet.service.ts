import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateQaSheetService {

  selectedExam: string;

  toBeEdited: number = 1;

  constructor() { }

  setSelectedExam(id: any){
    this.selectedExam = id;
  }

  getSelectedExam(){
    return this.selectedExam;
  }
}
