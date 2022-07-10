import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

import { ipcRenderer } from 'electron';
import { CaptureService } from '../../shared/services/capture.service';

@Component({
  selector: 'app-score-exam',
  templateUrl: './score-exam.component.html',
  styleUrls: ['./score-exam.component.scss']
})
export class ScoreExamComponent {

  videoRef: any;
  // ipcRenderer!: typeof ipcRenderer;

  capturedPhotos: WebcamImage[] = [];
  private trigger: Subject<void> = new Subject<void>();
  constructor(private captureService: CaptureService) { }

  // public webcamImage!: WebcamImage;
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }
  handleImage(webcamImage: WebcamImage): void {
    // console.info('Saved webcam image', webcamImage);
    // this.webcamImage = webcamImage;
    this.capturedPhotos.push(webcamImage);
    this.captureService.addCapturedPhoto(webcamImage);
    console.log(this.captureService.getPhotos());
  }

}
