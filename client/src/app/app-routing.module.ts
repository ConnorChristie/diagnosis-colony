import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { StoriesComponent } from './pages/stories/stories.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stories', component: StoriesComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
