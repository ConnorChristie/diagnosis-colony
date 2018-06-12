import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { StoryComponent } from './pages/story/story.component';
import { NewStoryComponent } from './pages/new-story/new-story.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'story/:step', component: NewStoryComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'stories/:id', component: StoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
