import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, flatMap, map, tap } from 'rxjs/operators';

import { ColonyService } from '../../../services/colony/colony.service';
import {
  IResearcherDetails,
  NewStoryService,
  Step
} from '../../../services/new-story/new-story.service';
import { TaskRole } from '../../../models/task-role';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-researchers',
  templateUrl: './researchers.component.html',
  styleUrls: ['./researchers.component.scss']
})
export class ResearchersComponent implements OnInit {
  public detailsForm = new FormGroup({
    researcher: new FormControl(null),
    evaluator: new FormControl(null)
  });

  public storyId: number;

  constructor(
    private newStoryService: NewStoryService,
    private colonyService: ColonyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id'))
      )
      .subscribe(id => {
        this.storyId = id;
      });

    this.newStoryService
      .getDetails<IResearcherDetails>(Step.STEP3)
      .pipe(filter(x => !!x))
      .subscribe(details => {
        this.detailsForm.patchValue(details);
      });
  }

  onSubmit() {
    const details = this.detailsForm.value as IResearcherDetails;
    const isValid = this.detailsForm.valid;

    if (this.storyId) {
      this.newStoryService
        .setDetails(Step.STEP3, details, isValid)
        .pipe(
          filter(success => success && isValid),
          flatMap(() => this.assignUserRoles(this.storyId, details)),
          flatMap(() => this.newStoryService.clearAllDetails())
        )
        .subscribe(async () => {
          await this.router.navigate(['/stories', this.storyId]);
        });
    }
  }

  onSkip() {
    this.newStoryService.clearAllDetails().subscribe(async () => {
      await this.router.navigate(['/stories', this.storyId]);
    });
  }

  private assignUserRoles(storyId: number, details: IResearcherDetails) {
    const roleAssignment$ = [];

    if (details.researcher) {
      roleAssignment$.push(
        this.colonyService.assignUserRole(
          storyId,
          details.researcher,
          TaskRole.WORKER
        )
      );
    }

    if (details.evaluator) {
      roleAssignment$.push(
        this.colonyService.assignUserRole(
          storyId,
          details.evaluator,
          TaskRole.EVALUATOR
        )
      );
    }

    return combineLatest(roleAssignment$);
  }
}
