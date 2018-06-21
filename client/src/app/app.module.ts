import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorListComponent } from './components/author-list/author-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { SelectComponent } from './components/select/select.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { HomeComponent } from './pages/home/home.component';
import { ConditionDetailsComponent } from './pages/new-story/condition-details/condition-details.component';
import { ResearchersComponent } from './pages/new-story/researchers/researchers.component';
import { NewStoryComponent } from './pages/new-story/new-story.component';
import { StoryDetailsComponent } from './pages/new-story/story-details/story-details.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { ConditionComponent } from './pages/story/condition/condition.component';
import { ResearchComponent } from './pages/story/research/research.component';
import { StoryComponent } from './pages/story/story.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCardComponent,
    HeaderComponent,
    FooterComponent,
    StoriesComponent,
    HomeComponent,
    StoryComponent,
    AuthorListComponent,
    NewStoryComponent,
    StepperComponent,
    StoryDetailsComponent,
    ConditionDetailsComponent,
    SelectComponent,
    ResearchersComponent,
    ConditionComponent,
    ResearchComponent,
    StoryCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
