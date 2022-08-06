import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

import { CaptureService } from '../../shared/services/capture.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-score-exam',
  templateUrl: './score-exam.component.html',
  styleUrls: ['./score-exam.component.scss']
})
export class ScoreExamComponent implements OnInit {

  exams = [];
  students = [];
  selectedStudent = '';

  allAnswers = {
    tf: {
      my: [],
      score: []
    },
    choice: {
      my: [],
      score: []
    },
    fill: {
      my: [],
      score: []
    },
    define: {
      my: [],
      score: []
    },
    shortans: {
      my: [],
      score: []
    },
    content: {}
  };

  myScore = 0;

  selectedExam = '';
  selectedExamName = '';
  imageSrc = '';

  videoRef: any;
  // ipcRenderer!: typeof ipcRenderer;

  capturedPhotos: WebcamImage[] = [];
  private trigger: Subject<void> = new Subject<void>();
  constructor(private captureService: CaptureService, private api: ApiService) { }

  // public webcamImage!: WebcamImage;
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.api.getAllExams().subscribe((res: any) => {
      this.exams.push(...res.data);
    });

    this.api.getAllStudents().subscribe((res: any) => {
      this.students.push(...res.data);
    });
  }

  //Image upload from file
  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    // console.log(this.imageSrc);
    this.handleImage({ imageAsDataUrl: this.imageSrc });
  }


  //Take snapshot
  triggerSnapshot(): void {
    this.trigger.next();
  }
  handleImage(webcamImage): void {
    // console.info('Saved webcam image', webcamImage);
    // this.webcamImage = webcamImage;
    this.capturedPhotos.push(webcamImage);
    this.captureService.addCapturedPhoto(webcamImage);
    console.log(this.captureService.getPhotos());
  }

  selectExam(examName){
    this.selectedExam = examName;
  }

  scoreExam(){
    this.api.scoreExam(this.captureService.getPhotos(), this.selectedExam).subscribe((res: any) => {
      console.log(res);
      this.allAnswers = res;

      if(res.content.tf){
        res.tf.forEach((rm) => {
          if(rm.score === 'correct') {this.myScore++;}
        });
      }
      if(res.content.choice){
        res.choice.forEach((rm) => {
          if(rm.score === 'correct') {this.myScore++;}
        });
      }
      if(res.content.fill){
        res.fill.forEach((rm) => {
          if(rm.score === 'correct') {this.myScore++;}
        });
      }
      if(res.content.define){
        res.define.forEach((rm) => {
          if(rm.score === 'correct') {this.myScore++;}
        });
      }
      if(res.content.shortans){
        res.shortans.forEach((rm) => {
          if(rm.score === 'correct') {this.myScore++;}
        });
      }
    });

  }

  examName(name){
    this.selectedExamName = name;
  }

  saveScore(){

    const data = {
      studentname: this.selectedStudent,
      examname: this.selectedExamName,
      score: this.myScore
    };

    this.api.saveScore(data).subscribe((res: any) => {
      console.log(res);
    });
  }

}
