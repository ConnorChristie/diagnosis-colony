import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { flatMap, map } from 'rxjs/operators';

import { IResearch } from '../../../models/research';
import { IStoryTask } from '../../../models/story';
import { TaskRole } from '../../../models/task-role';
import { ColonyService } from '../../../services/colony/colony.service';
import { RatingService } from '../../../services/rating/rating.service';

@Component({
  selector: 'app-research-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  @Input() public story: IStoryTask;
  @Input() public roles: TaskRole[] = [];

  public didRate: boolean;
  private delivered: boolean;

  @ViewChild('evaluateResearchModal') private evaluateResearchModal;

  public researchForm = new FormGroup({
    causes: new FormControl(null, Validators.required),
    treatments: new FormControl(null, Validators.required),
    symptoms: new FormControl(null, Validators.required),
    references: new FormControl(null, Validators.required)
  });

  constructor(
    private colonyService: ColonyService,
    private ratingService: RatingService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.colonyService
      .getStoryDeliverable(this.story.id)
      .subscribe(deliverable => {
        this.delivered = true;

        this.researchForm.disable();
        this.researchForm.patchValue(deliverable);
      });

    this.ratingService
      .getRatingSecret(this.story.id, this.ratingRole())
      .pipe(map(x => !!x))
      .subscribe(didRate => (this.didRate = didRate));
  }

  isResearching() {
    return this.roles.some(x => x === TaskRole.WORKER);
  }

  isEvaluating() {
    return this.roles.some(x => x === TaskRole.EVALUATOR);
  }

  isDelivered() {
    return this.delivered;
  }

  onSubmit() {
    const details = this.researchForm.value as IResearch;
    const valid = this.researchForm.valid && this.story;

    // TODO: Save intermittent research data
    if (valid) {
      this.colonyService
        .submitResearch(this.story.id, details)
        .subscribe(() => {
          this.delivered = true;
          this.researchForm.disable();
          alert('Successfully submitted research.');
        });
    }
  }

  async onEvaluate() {
    const rating: number = await this.modalService.open(
      this.evaluateResearchModal
    ).result;

    const role = this.ratingRole();

    this.colonyService
      .submitRating(this.story.id, role, rating)
      .pipe(
        flatMap(salt =>
          this.ratingService.saveRatingSecret(this.story.id, role, rating, salt)
        )
      )
      .subscribe(() => {
        this.didRate = true;

        alert(
          'Successfully sent rating. After all rating are in, we are going to ask you to reveal your rating.'
        );
      });
  }

  private ratingRole() {
    return this.isResearching() ? TaskRole.MANAGER : TaskRole.WORKER;
  }
}
