import { Injectable } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { CaptureService } from './capture.service';

@Injectable({
  providedIn: 'root'
})
export class ScoreExamService {

  examPhotos: WebcamImage[] = [];

  constructor(private captureService: CaptureService) {}

  scoreExam(){
    console.log(this.captureService.getPhotos()[0].imageAsDataUrl);
  }
}
