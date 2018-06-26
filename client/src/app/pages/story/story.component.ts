import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, map } from 'rxjs/operators';

import { IAuthor } from '../../components/author-list/author-list.component';
import { IStoryTask } from '../../models/story';
import { IParticipant, ITaskRoles, StoryRole } from '../../models/story-role';
import { ApiService, IResearchRequest } from '../../services/api/api.service';
import { ColonyService } from '../../services/colony/colony.service';
import { EthersNetworkService } from '../../services/networks/ethers-network/ethers-network.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  private isAuthor: boolean;
  private roles: ITaskRoles;

  public story: IStoryTask;
  public participants: IAuthor[] = [];
  public userRoles: StoryRole[] = [];

  public researchRequests: { [user: string]: IResearchRequest } = {};

  public TaskRole = StoryRole;

  public researchCardDetails = {
    title: 'Research this Condition',
    description:
      'We need students, medical professionals, and hobbyists alike who take a great interest in the medical field to provide ' +
      'expertise for this story.\n\nResearchers are compensated for working together and finding more information regarding this condition.'
  };
  public inputRolesCardDetails = {
    title: 'Researchers and Evaluators',
    description:
      'Requests for becoming a researcher will be shown here once this story begins to receive them. You may then appoint ' +
      'different people as either a Researcher (performs the work) or an Evaluator (evaluates and rates the research work). Please be ' +
      'patient as it may take some time to find the right people to perform the research!'
  };
  public selectRolesCardDetails = {
    title: 'Select Researcher and Evaluator',
    description:
      'The following individuals have requested to research this story. You may assign them as either a researcher or an evaluator.'
  };

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
      .subscribe(async id => {
        await this.loadStory(id);
        await this.loadResearchRequests(id);
      });
  }

  canSeeConditionDetails() {
    // If the user has any role, they are allowed to see the details
    return !!this.userRoles.length;
  }

  canSubmitResearch() {
    return this.userRoles.some(x => x === StoryRole.WORKER);
  }

  canEvaluateResearch() {
    return this.userRoles.some(x => x === StoryRole.EVALUATOR);
  }

  canAssignRoles() {
    return this.isAuthor;
  }

  canSubmitResearchRequest() {
    return !this.userRoles.some(
      x => x === StoryRole.WORKER || x === StoryRole.EVALUATOR
    );
  }

  hasResearchRequests() {
    return !!this.getObjectKeys(this.researchRequests).length;
  }

  async onAssignRole(user: string, role: StoryRole) {
    const { requestId } = this.researchRequests[user];

    await this.colonyService.assignUserRole(
      this.story.id,
      requestId,
      user,
      role
    );

    await this.addParticipant({ address: user }, role);

    delete this.researchRequests[user];
  }

  async onRequestToResearch() {
    if (!this.story) {
      return;
    }

    const duration: number = await this.modalService.open(
      this.researchRequestModal
    ).result;

    await this.colonyService.submitResearchRequest(this.story.id, duration);

    alert('Request sent to story coordinator.');
  }

  getObjectKeys(obj) {
    return Object.keys(obj);
  }

  private async loadStory(id: number) {
    this.colonyService.getStory(id).subscribe(async story => {
      this.story = story;
      this.isAuthor =
        story.author.toLowerCase() ===
        (await this.ethersNetworkService.getUserAddress()).toLowerCase();

      await this.addParticipant(
        { address: this.story.author },
        StoryRole.MANAGER
      );
    });

    (await this.colonyService.getStoryRoles(id)).subscribe(roles =>
      this.updateParticipants(roles)
    );
  }

  private updateParticipants(roles: ITaskRoles) {
    this.userRoles = [];
    this.participants = [];

    this.addParticipants(roles.researchers, StoryRole.WORKER);
    this.addParticipants(roles.evaluators, StoryRole.EVALUATOR);

    this.roles = roles;
  }

  private addParticipants(participants: IParticipant[], role: StoryRole) {
    participants.forEach(
      async participant => await this.addParticipant(participant, role)
    );
  }

  private async addParticipant(participant: IParticipant, role: StoryRole) {
    const userAddress = await this.ethersNetworkService.getUserAddress();

    if (participant.address === userAddress) {
      this.userRoles.push(role);
    }

    // TODO: Replace placeholder info with uPort identity details
    let subtitle = 'Story Coordinator';
    let image = '/assets/profile-me.png';

    switch (role) {
      case StoryRole.WORKER:
        subtitle = 'Researcher';
        image =
          'https://www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&d=mm&r=x';
        break;
      case StoryRole.EVALUATOR:
        subtitle = 'Evaluator';
        image =
          'https://www.gravatar.com/avatar/85a47a60d579572601ff74b72fe8b32d?s=250&d=mm&r=x';
        break;
    }

    const user: IAuthor = {
      name: participant.address,
      subtitle: subtitle,
      description: 'Teacher at Elementary School',
      image: image,
      link: '/'
    };

    if (role === StoryRole.MANAGER) {
      this.participants = [user, ...this.participants];
    } else {
      this.participants.push(user);
    }
  }

  private async loadResearchRequests(id: number) {
    (await this.colonyService.getResearchRequests(id)).subscribe(
      request => (this.researchRequests[request.user] = request)
    );
  }
}
