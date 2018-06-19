import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { IAuthor } from '../../components/author-list/author-list.component';
import { IStoryTask } from '../../models/story';
import { ITaskRole, ITaskRoles, TaskRole } from '../../models/task-role';
import { ApiService } from '../../services/api/api.service';
import { ColonyService } from '../../services/colony/colony.service';
import { EthersNetworkService } from '../../services/networks/ethers-network/ethers-network.service';

enum ViewState {
  STORY = 1,
  CONDITION = 2,
  RESEARCH = 3
}

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  private roles: ITaskRoles;

  public story: IStoryTask;
  public participants: IAuthor[] = [];
  public userRoles: TaskRole[] = [];

  public researchRequests: string[];

  public TaskRole = TaskRole;
  public ViewState = ViewState;
  public viewState: ViewState = ViewState.STORY;

  public fundingCardDetails = {
    title: 'Fund this Story',
    description:
      'The funds raised for this story will be allocated to the researchers and medical professionals working on solving this mystery.'
  };
  public researchCardDetails = {
    title: 'Research this Condition',
    description:
      'We need students, medical professionals, and hobbyists alike who take a great interest in the medical field to provide ' +
      'expertise for this story.\n\nResearchers are compensated for working together and finding more information regarding this condition.'
  };
  public inputRolesCardDetails = {
    title: 'Assign Researcher and Evaluator',
    description:
      'Supply an address for both the primary researcher and evaluator.'
  };
  public selectRolesCardDetails = {
    title: 'Select Researcher and Evaluator',
    description:
      'The following individuals have requested to research this story. You may assign them as either a researcher or an evaluator.'
  };

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
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id'))
      )
      .subscribe(id => {
        this.loadStory(id);
        this.loadResearchRequests(id);
      });

    this.fundingForm.controls.diagAmount.valueChanges.subscribe(value => {
      this.fundingForm.controls.currencyAmount.setValue(value / 10);
    });
  }

  canSeeConditionDetails() {
    // If the user has any role, they are allowed to see the details
    return !!this.userRoles.length;
  }

  canSubmitResearch() {
    return this.userRoles.some(x => x === TaskRole.WORKER);
  }

  canAssignRoles() {
    return this.userRoles.some(x => x === TaskRole.MANAGER);
  }

  hasResearchRequests() {
    return !!this.researchRequests.length;
  }

  onSubmitContribution() {
    const valid = this.fundingForm.valid && this.story;

    // TODO: create txn to send funds to colony
  }

  onAssignRoles() {
    const valid = this.researcherForm.valid && this.story;
    const data = this.researcherForm.value;

    if (valid) {
      this.onAssignRole(data.worker, TaskRole.WORKER);
      this.onAssignRole(data.evaluator, TaskRole.EVALUATOR);
    }
  }

  onAssignRole(user: string, role: TaskRole) {
    this.colonyService
      .assignUserRole(this.story.id, user, role)
      .subscribe(async () => {
        const roles: ITaskRoles = { ...this.roles };

        switch (role) {
          case TaskRole.WORKER:
            roles.worker = { address: user };
            break;
          case TaskRole.EVALUATOR:
            roles.evaluator = { address: user };
            break;
        }

        this.researchRequests.splice(this.researchRequests.indexOf(user), 1);

        await this.updateParticipants(roles);
        await this.apiService.removeResearchInterest(this.story.id, user);
      });
  }

  async onRequestToResearch() {
    if (!this.story) {
      return;
    }

    const userAddress = await this.ethersNetworkService.getUserAddress();

    this.apiService
      .submitResearchInterest(this.story.id, userAddress)
      .subscribe(
        () => {
          alert('Request sent to story coordinator.');
        },
        err => {
          alert(
            'Could not complete your request to become a researcher at this moment.'
          );

          console.log(err);
        }
      );
  }

  private loadStory(id: number) {
    this.colonyService.getStory(id).subscribe(story => (this.story = story));

    this.colonyService
      .getTaskRoles(id)
      .subscribe(async roles => await this.updateParticipants(roles));
  }

  private async updateParticipants(roles: ITaskRoles) {
    this.userRoles = [];
    this.participants = [];

    await this.addParticipant(roles.manager, TaskRole.MANAGER);
    await this.addParticipant(roles.worker, TaskRole.WORKER);
    await this.addParticipant(roles.evaluator, TaskRole.EVALUATOR);

    this.roles = roles;
  }

  private async addParticipant(roleDetails: ITaskRole, role: TaskRole) {
    if (roleDetails.address) {
      const userAddress = await this.ethersNetworkService.getUserAddress();

      if (roleDetails.address === userAddress) {
        this.userRoles.push(role);
      }

      // TODO: Replace placeholder info with uPort identity details
      let subtitle = 'Story Coordinator';
      let image =
        '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x';

      switch (role) {
        case TaskRole.WORKER:
          subtitle = 'Primary Researcher';
          image =
            'https://www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&d=mm&r=x';
          break;
        case TaskRole.EVALUATOR:
          subtitle = 'Research Evaluator';
          image =
            'https://www.gravatar.com/avatar/85a47a60d579572601ff74b72fe8b32d?s=250&d=mm&r=x';
          break;
      }

      this.participants.push({
        name: roleDetails.address,
        subtitle: subtitle,
        description: 'Teacher at Elementary School',
        image: image,
        link: '/'
      });
    }

    switch (role) {
      case TaskRole.WORKER:
        this.researcherForm.controls.worker.setValue(roleDetails.address);
        break;
      case TaskRole.EVALUATOR:
        this.researcherForm.controls.evaluator.setValue(roleDetails.address);
        break;
    }
  }

  private loadResearchRequests(id: number) {
    this.apiService
      .getResearchInterests(id)
      .subscribe(interested => (this.researchRequests = interested));
  }
}
