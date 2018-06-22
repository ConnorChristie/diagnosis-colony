import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';

import { IAuthor } from '../../components/author-list/author-list.component';
import { IStoryTask } from '../../models/story';
import { ITaskRole, ITaskRoles, TaskRole } from '../../models/task-role';
import { ApiService, IResearchRequest } from '../../services/api/api.service';
import { ColonyService } from '../../services/colony/colony.service';
import { EthersNetworkService } from '../../services/networks/ethers-network/ethers-network.service';

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

  public researchRequests: { [user: string]: IResearchRequest };

  public TaskRole = TaskRole;

  public researchCardDetails = {
    title: 'Research this Condition',
    description:
      'We need students, medical professionals, and hobbyists alike who take a great interest in the medical field to provide ' +
      'expertise for this story.\n\nResearchers are compensated for working together and finding more information regarding this condition.'
  };
  public inputRolesCardDetails = {
    title: 'Assign Researcher and Evaluator',
    description:
      "Either supply an address for both the primary researcher and evaluator if you know who you'd like to research this story " +
      'otherwise you may wait for submissions to appear here.'
  };
  public selectRolesCardDetails = {
    title: 'Select Researcher and Evaluator',
    description:
      'The following individuals have requested to research this story. You may assign them as either a researcher or an evaluator.'
  };

  public researcherForm = new FormGroup({
    worker: new FormControl(null, Validators.required),
    evaluator: new FormControl(null, Validators.required)
  });

  @ViewChild('researchRequestModal') private researchRequestModal;

  constructor(
    private colonyService: ColonyService,
    private ethersNetworkService: EthersNetworkService,
    private modalService: NgbModal,
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

  canSubmitResearchRequest() {
    return !this.userRoles.some(x => x === TaskRole.WORKER || x === TaskRole.EVALUATOR);
  }

  hasResearchRequests() {
    return !!this.getObjectKeys(this.researchRequests).length;
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
      .pipe(flatMap(() => {
        const { durationSig } = this.researchRequests[user];

        if (durationSig && role === TaskRole.WORKER) {
          return this.colonyService.finishSetStoryDuration(durationSig);
        }

        return of();
      }))
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

        delete this.researchRequests[user];
        await this.updateParticipants(roles);

        this.apiService.removeResearchInterest(this.story.id, user).subscribe();
      });
  }

  async onRequestToResearch() {
    if (!this.story) {
      return;
    }

    const duration: number = await this.modalService.open(
      this.researchRequestModal
    ).result;
    const userAddress = await this.ethersNetworkService.getUserAddress();

    this.colonyService
      .setStoryDuration(this.story.id, duration)
      .pipe(
        flatMap(op =>
          this.apiService.submitResearchInterest(
            this.story.id,
            userAddress,
            duration,
            op.toJSON()
          )
        )
      )
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

  getObjectKeys(obj) {
    return Object.keys(obj);
  }

  private loadStory(id: number) {
    this.colonyService.getStory(id).subscribe(story => this.story = story);

    this.colonyService
      .getStoryRoles(id)
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
