import { Component, OnInit } from '@angular/core';
import { IStep } from '../../components/stepper/stepper.component';
import { NewStoryService, Step } from '../../services/new-story/new-story.service';
import { ActivationStart, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.scss'],
  providers: [NewStoryService]
})
export class NewStoryComponent implements OnInit {
  public steps: { [x: number]: IStep } = {
    [Step.STEP1]: {
      name: 'Step 1: Story',
      link: NewStoryService.ROUTES[Step.STEP1],
      isActive: false
    },
    [Step.STEP2]: {
      name: 'Step 2: Condition',
      link: NewStoryService.ROUTES[Step.STEP2],
      isActive: false
    },
    [Step.STEP3]: {
      name: 'Step 3: Funding',
      link: NewStoryService.ROUTES[Step.STEP3],
      isActive: false
    }
  };

  public Step = Step;

  constructor(
    private newStoryService: NewStoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(x => x instanceof ActivationStart),
        startWith(null)
      )
      .subscribe(() => this.updateProgress());
  }

  get stepArray() {
    return Object.values<IStep>(this.steps);
  }

  get activeStep() {
    return this.newStoryService.getActiveStep();
  }

  private updateProgress() {
    this.newStoryService
      .getProgress()
      .pipe(filter(x => !!x))
      .subscribe(progress => {
        NewStoryService.getSteps().forEach(step => {
          this.steps[step].isActive = progress[step];
        });
      });
  }
}
