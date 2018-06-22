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
import { NewStoryComponent } from './pages/new-story/new-story.component';
import { ResearchersComponent } from './pages/new-story/researchers/researchers.component';
import { StoryDetailsComponent } from './pages/new-story/story-details/story-details.component';
import { ConditionComponent } from './pages/research/condition/condition.component';
import { ResearchComponent } from './pages/research/research.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { FundingComponent } from './pages/story/funding/funding.component';
import { StoryComponent } from './pages/story/story.component';
import { SymptomsComponent } from './pages/research/symptoms/symptoms.component';
import { ImagesComponent } from './pages/research/images/images.component';
import { SubmitComponent } from './pages/research/submit/submit.component';
import { QuestionsComponent } from './pages/research/questions/questions.component';

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
    StoryCardComponent,
    FundingComponent,
    SymptomsComponent,
    ImagesComponent,
    SubmitComponent,
    QuestionsComponent
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
