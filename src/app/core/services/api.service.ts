import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private webReqService: WebRequestService) { }


  //Score Exam
  scoreExam(formData: Object, selectedExam: string){
    return this.webReqService.post('score', { formData, selectedExam });
  }

  //'Save' methods
  saveStudent(formData: Object){
    return this.webReqService.post('student', formData);
  }
  saveExam(formData: Object){
    return this.webReqService.post('exam', formData);
  }
  saveSetting(formData: Object){
    return this.webReqService.post('setting', formData);
  }
  saveScore(formData: Object){
    return this.webReqService.post('class', formData);
  }

  //'Retrieve' methods
  getAllStudents(){
    return this.webReqService.get('student');
  }
  getAllExams(){
    return this.webReqService.get('exam');
  }
  getSetting(){
    return this.webReqService.get('setting');
  }
  getScore(){
    return this.webReqService.get('class');
  }

  //'Update' methods
  updateSetting(formData: Object, id: string){
    return this.webReqService.put(`setting/${id}`, formData);
  }
  updateExam(formData: Object, id: string){
    return this.webReqService.put(`exam/${id}`, formData);
  }

  //'Retrieve one' methods
  getOneExam(id: string){
    return this.webReqService.get(`exam/:${id}`);
  }


  //-------------------------------------------


  //'Delete' methods
  deleteStudent(id: string){
    return this.webReqService.delete(`student/:${id}`);
  }
}
