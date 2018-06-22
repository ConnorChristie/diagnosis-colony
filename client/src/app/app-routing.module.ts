import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { NewStoryComponent } from './pages/new-story/new-story.component';
import { ResearchComponent } from './pages/research/research.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { StoryComponent } from './pages/story/story.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'story/:step', component: NewStoryComponent },
  { path: 'story/:step/:id', component: NewStoryComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'stories/:id', component: StoryComponent },
  { path: 'stories/:id/research', component: ResearchComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
