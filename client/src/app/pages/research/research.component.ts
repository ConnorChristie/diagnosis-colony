import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, Observable } from 'rxjs';
import { filter, flatMap, map, tap } from 'rxjs/operators';

import { IStoryTask } from '../../models/story';
import { ITaskRoles, TaskRole } from '../../models/task-role';
import { ColonyService } from '../../services/colony/colony.service';
import { EthersNetworkService } from '../../services/networks/ethers-network/ethers-network.service';
import { RatingService } from '../../services/rating/rating.service';

enum ViewState {
  CONDITION = 1,
  SYMPTOMS = 2,
  IMAGES = 3,
  QUESTIONS = 4,
  SUBMIT = 5
}

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {
  public story: IStoryTask;
  public userRoles: TaskRole[] = [];

  public viewState = ViewState.CONDITION;
  public ViewState = ViewState;

  public canRate$: Observable<boolean>;
  public allRated$: Observable<boolean>;

  @ViewChild('ratingModal') private ratingModal;

  constructor(
    private colonyService: ColonyService,
    private ethersNetworkService: EthersNetworkService,
    private ratingService: RatingService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id'))
      )
      .subscribe(id => this.loadStory(id));
  }

  canView() {
    return !this.story || (this.story && !!this.userRoles.length);
  }

  isResearching() {
    return this.userRoles.some(x => x === TaskRole.WORKER);
  }

  isEvaluating() {
    return this.userRoles.some(x => x === TaskRole.EVALUATOR);
  }

  async onRate() {
    const rating: number = await this.modalService.open(this.ratingModal)
      .result;

    const role = this.ratingRole();

    this.colonyService
      .submitRating(this.story.id, role, rating)
      .pipe(
        flatMap(salt =>
          this.ratingService.saveRatingSecret(this.story.id, role, rating, salt)
        )
      )
      .subscribe(() => {
        alert(
          'Successfully sent rating. After all rating are in, we are going to ask you to reveal your rating.'
        );
      });
  }

  onRevealRating() {
    const role = this.ratingRole();

    this.ratingService
      .getRatingSecret(this.story.id, role)
      .pipe(
        flatMap(rating =>
          this.colonyService.revealRating(
            this.story.id,
            role,
            rating.rating,
            rating.secret
          )
        ),
        flatMap(() => this.ratingService.removeRatingSecret(this.story.id, role))
      )
      .subscribe(() => {
        alert(
          'Successfully revealed your rating.'
        );
      });
  }

  private loadStory(id: number) {
    combineLatest(
      this.colonyService.getStory(id).pipe(tap(story => (this.story = story))),
      this.colonyService
        .getStoryRoles(id)
        .pipe(
          flatMap(roles => this.toUserRoles(roles)),
          tap(roles => (this.userRoles = roles))
        )
    ).subscribe(() => {
      this.allRated$ = combineLatest(
        this.didRate(),
        this.colonyService.allRatingsSubmitted(id)
      ).pipe(
        map(([didRate, allRated]) => (didRate && allRated))
      );

      this.canRate$ = combineLatest(
        this.didRate().pipe(
          map(rated => !rated && this.story.delivered && this.isResearching())
        ),
        this.colonyService.allRatingsSubmitted(id)
      ).pipe(
        map(([canRate, ratingsSubmitted]) => (canRate && !ratingsSubmitted))
      );
    });
  }

  private async toUserRoles(roles: ITaskRoles) {
    const userRoles: TaskRole[] = [];
    const userAddress = await this.ethersNetworkService.getUserAddress();

    if (roles.manager.address === userAddress) {
      userRoles.push(TaskRole.MANAGER);
    }

    if (roles.worker.address === userAddress) {
      userRoles.push(TaskRole.WORKER);
    }

    if (roles.evaluator.address === userAddress) {
      userRoles.push(TaskRole.EVALUATOR);
    }

    return userRoles;
  }

  private didRate() {
    return this.ratingService
      .getRatingSecret(this.story.id, this.ratingRole())
      .pipe(map(x => !!x));
  }

  private ratingRole() {
    return this.isResearching() ? TaskRole.MANAGER : TaskRole.WORKER;
  }
}
