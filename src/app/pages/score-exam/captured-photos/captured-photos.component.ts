import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subscription } from 'rxjs';

import { CaptureService } from '../../../shared/services/capture.service';

@Component({
  selector: 'app-captured-photos',
  templateUrl: './captured-photos.component.html',
  styleUrls: ['./captured-photos.component.scss']
})
export class CapturedPhotosComponent implements OnInit, OnDestroy {

  capturedPhotos: WebcamImage[] = [];
  private photoCapturedSubscription: Subscription = new Subscription();

  constructor(private captureService: CaptureService) {}

  ngOnInit(): void {
    this.capturedPhotos = this.captureService.getPhotos();
    this.photoCapturedSubscription = this.captureService.photoCaptured.subscribe(
      (capturedPhotos: WebcamImage[]) => this.capturedPhotos = capturedPhotos
    );

    // Creates a client
    // this.client = new vision.ImageAnnotatorClient({
    //   keyFilename: './resources/wired-cogency-327519-c5e368fcaf37.json'
    // })
  }

  ngOnDestroy(){
    this.photoCapturedSubscription.unsubscribe();
  }

}
