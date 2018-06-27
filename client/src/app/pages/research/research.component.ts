import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';

import { IConditionDetails, IStoryDetails, IStoryTask } from '../../models/story';
import { ITaskRoles, StoryRole } from '../../models/story-role';
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
  public storyDetails: IStoryDetails;
  public conditionDetails: IConditionDetails;

  public userRoles: StoryRole[] = [];

  public viewState = ViewState.CONDITION;
  public ViewState = ViewState;

  public canRate: boolean;
  public allRated: boolean;

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
    return this.userRoles.some(x => x === StoryRole.RESEARCHER);
  }

  isEvaluating() {
    return this.userRoles.some(x => x === StoryRole.EVALUATOR);
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
        this.canRate = false;

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
        flatMap(() =>
          this.ratingService.removeRatingSecret(this.story.id, role)
        )
      )
      .subscribe(() => {
        this.allRated = false;

        alert('Successfully revealed your rating.');
      });
  }

  private loadStory(id: number) {
    this.colonyService.getStoryDetails(id).subscribe(({ storyDetails, conditionDetails }) => {
      this.storyDetails = storyDetails;
      this.conditionDetails = conditionDetails;
    });

    combineLatest(
      this.colonyService.getStory(id),
      this.colonyService
        .getStoryRoles(id)
        .pipe(flatMap(roles => this.toUserRoles(roles)))
    ).subscribe(async ([story, userRoles]) => {
      if (story.author === await this.ethersNetworkService.getUserAddress()) {
        userRoles.push(StoryRole.AUTHOR);
      }

      this.story = story;
      this.userRoles = userRoles;

      this.updateRatings();
    });
  }

  private async toUserRoles(roles: ITaskRoles) {
    const userRoles: StoryRole[] = [];
    const userAddress = await this.ethersNetworkService.getUserAddress();

    if (roles.researchers.some(x => x.address === userAddress)) {
      userRoles.push(StoryRole.RESEARCHER);
    }

    if (roles.evaluators.some(x => x.address === userAddress)) {
      userRoles.push(StoryRole.EVALUATOR);
    }

    return userRoles;
  }

  private updateRatings() {
    combineLatest(
      this.didRate(),
      this.colonyService.allRatingsSubmitted(this.story.id)
    ).subscribe(([didRate, allRated]) => {
      const canRate =
        !didRate &&
        this.story.delivered &&
        (this.isResearching() || this.isEvaluating());

      this.canRate = canRate && !allRated;
      this.allRated = didRate && allRated;
    });
  }

  private didRate() {
    return this.ratingService
      .getRatingSecret(this.story.id, this.ratingRole())
      .pipe(map(x => !!x));
  }

  private ratingRole() {
    return this.isResearching() ? StoryRole.AUTHOR : StoryRole.RESEARCHER;
  }
}
