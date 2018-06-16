import { Component, OnInit } from '@angular/core';
import { IAuthor } from '../../components/author-list/author-list.component';
import { ColonyService, ITaskRoles, TaskRole } from '../../services/colony/colony.service';
import { ActivatedRoute } from '@angular/router';
import { filter, flatMap, map, tap } from 'rxjs/operators';
import { IStory, IStoryTask } from '../../models/story';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EthersNetworkService } from '../../services/networks/ethers-network/ethers-network.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  private roles: ITaskRoles;

  public isManager: boolean;

  public authors: IAuthor[] = [];
  public story: IStoryTask;

  public fundingForm = new FormGroup({
    diagAmount: new FormControl(null, Validators.required),
    currencyAmount: new FormControl({ value: null, disabled: true })
  });

  public researcherForm = new FormGroup({
    worker: new FormControl(null, Validators.required),
    evaluator: new FormControl(null, Validators.required)
  });

  constructor(
    private colonyService: ColonyService,
    private ethersNetworkService: EthersNetworkService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loadStory();

    this.fundingForm.controls.diagAmount.valueChanges.subscribe(value => {
      this.fundingForm.controls.currencyAmount.setValue(value / 10);
    });
  }

  onSubmitContribution() {
    const valid = this.fundingForm.valid && this.story;

    // TODO: create txn to send funds to colony
  }

  async onAssignRoles() {
    const valid = this.researcherForm.valid && this.story;
    const data = this.researcherForm.value;

    if (valid) {
      combineLatest(
        this.colonyService.assignUserRole(this.story.id, data.worker, TaskRole.WORKER),
        this.colonyService.assignUserRole(this.story.id, data.evaluator, TaskRole.EVALUATOR)
      ).subscribe(async () => {
        await this.updateParticipants({
          manager: this.roles.manager,
          evaluator: { address: data.evaluator },
          worker: { address: data.worker }
        });

        alert('Successfully assigned the roles.');
      });
    }
  }

  onRequestToResearch() {
    alert('Request sent to story coordinator.');
  }

  private loadStory() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id'))
      )
      .subscribe(id => {
        this.colonyService
          .getStory(id)
          .subscribe(story => (this.story = story));

        this.colonyService.getTaskRoles(id)
          .subscribe(async roles => await this.updateParticipants(roles));
      });
  }

  private async updateParticipants(roles: ITaskRoles) {
    const authors = [];

    if (roles.manager.address) {
      const userAddress = await this.ethersNetworkService.getUserAddress();
      this.isManager = userAddress === roles.manager.address;

      authors.push({
        name: roles.manager.address,
        subtitle: 'Story Coordinator',
        description: 'Doctor at Yale Medical College',
        image:
          '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
        link: '/'
      });
    }

    if (roles.evaluator.address) {
      authors.push({
        name: roles.evaluator.address,
        subtitle: 'Story Evaluator',
        description: 'Doctor at Yale Medical College',
        image:
          'https://www.gravatar.com/avatar/85a47a60d579572601ff74b72fe8b32d?s=250&d=mm&r=x',
        link: '/'
      });

      this.researcherForm.controls.evaluator.setValue(roles.evaluator.address);
    }

    if (roles.worker.address) {
      authors.push({
        name: roles.worker.address,
        subtitle: 'Primary Researcher',
        description: 'Doctor at Yale Medical College',
        image:
          'https://www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&d=mm&r=x',
        link: '/'
      });

      this.researcherForm.controls.worker.setValue(roles.worker.address);
    }

    this.roles = roles;
    this.authors = authors;
  }
}
