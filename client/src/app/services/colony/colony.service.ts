import { Injectable } from '@angular/core';
import { combineLatest, range, ReplaySubject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { filter, flatMap, map, reduce } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IResearch } from '../../models/research';
import { IStory, IStoryTask } from '../../models/story';
import {
  toRoleNumber,
  toTaskRole,
  IParticipant,
  ITaskRoles,
  StoryRole
} from '../../models/story-role';

import {
  ColonyNetworkService,
  IColonyClient
} from '../networks/colony-network/colony-network.service';
import { EthersNetworkService } from '../networks/ethers-network/ethers-network.service';
import { IpfsNetworkService } from '../networks/ipfs-network/ipfs-network.service';

import BN from 'bn.js';
import bs58 from 'bs58';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface IResearchRequest {
  requestId: number;
  user: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private colonyId = environment.colony.id;
  private domainId = 1;

  private initialized = new ReplaySubject<boolean>();

  constructor(
    private colonyNetworkService: ColonyNetworkService,
    private ipfsNetworkService: IpfsNetworkService,
    private ethersNetworkService: EthersNetworkService
  ) {}

  static toStoryId(offset: number, index: number) {
    return offset + index + 1;
  }

  static generateSalt() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  async init() {
    await this.colonyNetworkService.init();
    await this.ipfsNetworkService.init();

    if (!this.colonyId) {
      this.colonyId = await this.colonyNetworkService.createColony();
    }

    this.initialized.next(true);
  }

  getColony() {
    return this.initialized.pipe(
      flatMap(() => this.colonyNetworkService.getColony(this.colonyId))
    );
  }

  getToken() {
    return this.getColony().pipe(
      flatMap<IColonyClient, string>(
        async colony => (await colony.getToken.call()).address
      )
    );
  }

  get researchColony() {
    return this.colonyNetworkService.getResearchColony();
  }

  createStory(story: IStory) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 180);

    return fromPromise(this.ipfsNetworkService.saveData(story)).pipe(
      flatMap(
        async ({ hash }) =>
          await this.researchColony
            .createStoryTx(
              // TODO: Refactor this into a convenience method
              '0x' +
                bs58
                  .decode(hash)
                  .slice(2)
                  .toString('hex'),
              new BN(this.domainId)
            )
            .send({
              from: await this.ethersNetworkService.getUserAddress()
            })
      ),
      map(({ events: { StoryCreated: { returnValues } } }) => +returnValues.storyId),
      flatMap(storyId =>
        this.getColony().pipe(
          flatMap(async colony => {
            const op = await colony.setTaskDueDate.startOperation({
              taskId: storyId,
              dueDate: dueDate
            });

            await op.sign();
            await op.send();

            return storyId;
          })
        )
      ),
      flatMap(storyId =>
        this.getColony().pipe(
          flatMap(async colony => {
            await colony.setTaskRoleUser.send({
              taskId: storyId,
              role: StoryRole.AUTHOR,
              user: environment.arbiter.address
            });

            return storyId;
          })
        )
      ),
      flatMap<number, number>(async storyId => {
        await this.researchColony.claimStoryTx(new BN(storyId)).send({
          from: await this.ethersNetworkService.getUserAddress()
        });

        return storyId;
      })
    );
  }

  getStory(id: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, IStoryTask>(async colony => {
        const [
          { specificationHash, deliverableHash, potId, dueDate },
          author
        ] = await Promise.all([
          colony.getTask.call({
            taskId: id
          }),
          this.researchColony.getStory(id)
        ]);

        if (specificationHash === null) {
          throw new Error(`Could not find story with id ${id}`);
        }

        return {
          id: id,
          author: author.toLowerCase(),
          potId: potId,
          dueDate: dueDate,
          delivered: !!deliverableHash
        };
      })
    );
  }

  getStoryDetails(id: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, IStory>(async colony => {
        const { specificationHash } = await colony.getTask.call({
          taskId: id
        });

        return await this.ipfsNetworkService.getData<IStory>(specificationHash);
      })
    );
  }

  getStoryDeliverable(id: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, IResearch>(async colony => {
        const { deliverableHash } = await colony.getTask.call({
          taskId: id
        });

        if (deliverableHash === null) {
          throw new Error(`Story ${id} has no deliverables submitted yet`);
        }

        return await this.ipfsNetworkService.getData<IResearch>(
          deliverableHash
        );
      })
    );
  }

  getStories(skip: number, take: number) {
    return Array.from({ length: take }, (v, k) =>
      ColonyService.toStoryId(skip, k)
    ).map(id => this.getStory(id));
  }

  getStoryCount() {
    return this.getColony().pipe(
      flatMap<IColonyClient, number>(
        async colony => (await colony.getTaskCount.call()).count
      )
    );
  }

  getStoryPayout(storyId: number) {
    return combineLatest(this.getColony(), this.getToken()).pipe(
      flatMap<[IColonyClient, string], BN>(
        async ([colony, token]) =>
          (await colony.getTaskPayout.call({
            taskId: storyId,
            role: StoryRole.AUTHOR,
            source: token
          })).amount
      )
    );
  }

  getStoryRoles(storyId: number) {
    return fromPromise(this.researchColony.getAssignmentCount(new BN(storyId))).pipe(
      flatMap(assignmentCount =>
        range(1, new BN(assignmentCount).toNumber()).pipe(
          flatMap(id => this.researchColony.getRoleAssignment(new BN(storyId), new BN(id))),
          map(([user, role]) => [
            { address: user.toLowerCase() },
            toTaskRole(role)
          ]),
          reduce<[IParticipant, StoryRole], {}>((acc, [user, role]) => {
            acc[role] = [...(acc[role] || []), user];
            return acc;
          }, {}),
          map<{}, ITaskRoles>(roles => ({
            researchers: roles[StoryRole.RESEARCHER] || [],
            evaluators: roles[StoryRole.EVALUATOR] || []
          }))
        )
      )
    );
  }

  async assignUserRole(
    storyId: number,
    requestId: number,
    user: string,
    role: StoryRole
  ) {
    await this.researchColony
      .assignUserRoleTx(new BN(storyId), new BN(requestId), user, toRoleNumber(role))
      .send({
        from: await this.ethersNetworkService.getUserAddress(),
        gas: 2000000
      });
  }

  async submitResearchRequest(storyId: number, duration: number) {
    await this.colonyNetworkService
      .getResearchColony()
      .submitResearchRequestTx(new BN(storyId), new BN(duration))
      .send({
        from: await this.ethersNetworkService.getUserAddress()
      });
  }

  async getResearchRequests(storyId: number) {
    const requestCount = await this.researchColony.getRequestCount(new BN(storyId));

    return range(1, new BN(requestCount).toNumber()).pipe(
      flatMap(async id => ({
        requestId: id,
        request: await this.colonyNetworkService
          .getResearchColony()
          .getResearchRequest(new BN(storyId), new BN(id))
      })),
      map<{ requestId; request }, IResearchRequest>(request => ({
        requestId: request.requestId,
        user: request.request[0],
        duration: request.request[1].toNumber()
      })),
      filter<IResearchRequest>(request => request.user !== ZERO_ADDRESS)
    );
  }

  submitResearch(storyId: number, research: IResearch) {
    return this.getColony().pipe(
      flatMap<IColonyClient, void>(async colony => {
        const { hash } = await this.ipfsNetworkService.saveData(research);

        await colony.submitTaskDeliverable.send({
          taskId: storyId,
          deliverableHash: hash
        });
      })
    );
  }

  submitRating(storyId: number, role: StoryRole, rating: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, string>(async colony => {
        const salt = ColonyService.generateSalt();

        const { secret } = await colony.generateSecret.call({
          salt: salt,
          value: new BN(rating * 10)
        });

        await colony.submitTaskWorkRating.send({
          taskId: storyId,
          role: role,
          ratingSecret: secret
        });

        return salt;
      })
    );
  }

  revealRating(storyId: number, role: StoryRole, rating: number, salt: string) {
    return this.getColony().pipe(
      flatMap<IColonyClient, void>(async colony => {
        await colony.revealTaskWorkRating.send({
          taskId: storyId,
          role: role,
          rating: rating * 10,
          salt: salt
        });
      })
    );
  }

  allRatingsSubmitted(storyId: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, boolean>(async colony => {
        const { count } = await colony.getTaskWorkRatings.call({
          taskId: storyId
        });

        return count === 2;
      })
    );
  }
}
