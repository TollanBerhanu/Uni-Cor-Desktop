import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { ScoreExamComponent } from './score-exam/score-exam.component';
import { BaseLayoutComponent } from './common/base-layout/base-layout.component';

const routes: Routes = [
  {
    path: '', component: BaseLayoutComponent, children: [
      { path: 'score-exam', component: ScoreExamComponent }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HomeRoutingModule,
    DetailRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
