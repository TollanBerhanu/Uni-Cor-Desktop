import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

//From Material UI
// import {MatFormFieldModule} from '@angular/material/form-field';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Webcam
import { WebcamModule } from 'ngx-webcam';

import { AppComponent } from './app.component';
import { BaseLayoutComponent } from './common/base-layout/base-layout.component';
import { ScoreExamComponent } from './pages/score-exam/score-exam.component';
import { CapturedPhotosComponent } from './pages/score-exam/captured-photos/captured-photos.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { StudentsComponent } from './pages/students/students.component';
import { HelpComponent } from './pages/help/help.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CreateExamComponent } from './pages/exams/create-exam/create-exam.component';
import { TryoutComponent } from './pages/tryout/tryout.component';
import { GenerateQuestionsheetComponent } from './pages/exams/generate-questionsheet/generate-questionsheet.component';
import { GenerateAnswersheetComponent } from './pages/exams/generate-answersheet/generate-answersheet.component';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    BaseLayoutComponent,
    ScoreExamComponent,
    CapturedPhotosComponent,
    ExamsComponent,
    StudentsComponent,
    HelpComponent,
    SettingsComponent,
    CreateExamComponent,
    TryoutComponent,
    GenerateQuestionsheetComponent,
    GenerateAnswersheetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    WebcamModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
