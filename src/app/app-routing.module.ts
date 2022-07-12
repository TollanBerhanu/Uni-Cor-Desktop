import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { ScoreExamComponent } from './pages/score-exam/score-exam.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { CreateExamComponent } from './pages/exams/create-exam/create-exam.component';
import { StudentsComponent } from './pages/students/students.component';
import { HelpComponent } from './pages/help/help.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TryoutComponent } from './pages/tryout/tryout.component';
import { BaseLayoutComponent } from './common/base-layout/base-layout.component';

const routes: Routes = [
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'score-exam', component: ScoreExamComponent }
    ]
  },
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'exams', component: ExamsComponent  }
    ]
  },
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'create-exam', component: CreateExamComponent  }
    ]
  },
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'students', component: StudentsComponent }
    ]
  },
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'help', component: HelpComponent }
    ]
  },
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'settings', component: SettingsComponent }
    ]
  },
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'try', component: TryoutComponent }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
