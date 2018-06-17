import { Component, OnInit } from '@angular/core';
import { IAuthor } from '../../components/author-list/author-list.component';
import {
  ColonyService,
  ITaskRole,
  ITaskRoles,
  TaskRole
} from '../../services/colony/colony.service';
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

  public story: IStoryTask;
  public participants: IAuthor[] = [];

  public isShowingCondition: boolean;
  public userRoles: TaskRole[] = [];

  public fundingCardDetails = {
    title: 'Fund this Story',
    description:
      'The funds raised for this story will be allocated to the researchers and medical professionals working on solving this mystery.'
  };
  public researchCardDetails = {
    title: 'Assign Researcher and Evaluator',
    description:
      'We need students, medical professionals, and hobbyists alike who take a great interest in the medical field to provide ' +
      'expertise for this story.\n\nResearchers are compensated for working together and finding more information regarding this condition.'
  };
  public rolesCardDetails = {
    title: 'Assign Researcher and Evaluator',
    description:
      'Supply an address for both the main story researcher and evaluator.'
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
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.loadStory();

    this.fundingForm.controls.diagAmount.valueChanges.subscribe(value => {
      this.fundingForm.controls.currencyAmount.setValue(value / 10);
    });
  }

  allowedConditionDetails() {
    // If the user has any role, they are allowed to see the details
    return !!this.userRoles.length;
  }

  allowedSubmitResearch() {
    return this.userRoles.some(x => x === TaskRole.WORKER);
  }

  allowedAssignRoles() {
    return this.userRoles.some(x => x === TaskRole.MANAGER);
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
        this.colonyService.assignUserRole(
          this.story.id,
          data.worker,
          TaskRole.WORKER
        ),
        this.colonyService.assignUserRole(
          this.story.id,
          data.evaluator,
          TaskRole.EVALUATOR
        )
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

        this.colonyService
          .getTaskRoles(id)
          .subscribe(async roles => await this.updateParticipants(roles));
      });
  }

  private async addParticipant(roleDetails: ITaskRole, role: TaskRole) {
    if (roleDetails.address) {
      const userAddress = await this.ethersNetworkService.getUserAddress();

      if (roleDetails.address === userAddress) {
        this.userRoles.push(role);
      }

      this.participants.push({
        name: roleDetails.address,
        subtitle: 'Story Coordinator',
        // subtitle: 'Primary Researcher',
        // subtitle: 'Research Evaluator',
        description: 'Teacher at Elementary School',
        image:
          '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
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

  private async updateParticipants(roles: ITaskRoles) {
    await this.addParticipant(roles.manager, TaskRole.MANAGER);
    await this.addParticipant(roles.worker, TaskRole.WORKER);
    await this.addParticipant(roles.evaluator, TaskRole.EVALUATOR);

    this.roles = roles;
  }
}
