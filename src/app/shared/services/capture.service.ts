import { Injectable } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CaptureService{

  photoCaptured = new Subject<WebcamImage[]>();
  capturedPhotos: WebcamImage[] = [];
  isCaptured = false;

  addCapturedPhoto(webcamImage: WebcamImage): void{
    this.capturedPhotos.push(webcamImage);
    this.photoCaptured.next(this.capturedPhotos);
    this.isCaptured = true;
  }
  getPhotos(): WebcamImage[]{
      return this.capturedPhotos;
  }

  removePhoto(i: number){
    this.capturedPhotos.splice(i, 1); // 2nd parameter means remove one item only
  }
}
