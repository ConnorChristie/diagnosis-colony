import { Injectable } from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IResearch } from '../../models/research';
import { IStory, IStoryTask } from '../../models/story';
import { ITaskRoles, TaskRole } from '../../models/task-role';

import BigNumber from 'bn.js';

import {
  ColonyNetworkService,
  IColonyClient
} from '../networks/colony-network/colony-network.service';
import { IpfsNetworkService } from '../networks/ipfs-network/ipfs-network.service';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private colonyId = environment.colony.id;
  private domainId = 1;

  private initialized = new ReplaySubject<boolean>();

  constructor(
    private colonyNetworkService: ColonyNetworkService,
    private ipfsNetworkService: IpfsNetworkService
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

    // Create colony if it doesn't exist
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
      flatMap<IColonyClient, number>(
        async colony => (await colony.getToken.call()).address
      )
    );
  }

  createStory(story: IStory) {
    return this.getColony().pipe(
      flatMap<IColonyClient, number>(async colony => {
        const { hash } = await this.ipfsNetworkService.saveData(story);

        const {
          eventData: { taskId }
        } = await colony.createTask.send({
          specificationHash: hash,
          domainId: this.domainId
        });

        return taskId;
      })
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

  getStory(id: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, IStoryTask>(async colony => {
        const {
          specificationHash,
          deliverableHash,
          potId,
          dueDate
        } = await colony.getTask.call({
          taskId: id
        });

        if (specificationHash === null) {
          throw new Error(`Could not find story with id ${id}`);
        }

        return {
          id: id,
          story: await this.ipfsNetworkService.getData<IStory>(
            specificationHash
          ),
          potId: potId,
          dueDate: dueDate,
          delivered: !!deliverableHash
        };
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

  getPotBalance(potId: number) {
    return combineLatest(this.getColony(), this.getToken()).pipe(
      flatMap<IColonyClient, BigNumber>(
        async ([colony, token]) =>
          (await colony.getPotBalance.call({
            potId,
            source: token
          })).balance
      )
    );
  }

  getStoryRoles(storyId: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, ITaskRoles>(async colony => ({
        manager: await colony.getTaskRole.call({
          taskId: storyId,
          role: TaskRole.MANAGER
        }),
        evaluator: await colony.getTaskRole.call({
          taskId: storyId,
          role: TaskRole.EVALUATOR
        }),
        worker: await colony.getTaskRole.call({
          taskId: storyId,
          role: TaskRole.WORKER
        })
      }))
    );
  }

  assignUserRole(storyId: number, user: string, role: TaskRole) {
    return this.getColony().pipe(
      flatMap<IColonyClient, void>(async colony => {
        await colony.setTaskRoleUser.send({
          taskId: storyId,
          role: role,
          user: user
        });
      })
    );
  }

  setStoryDuration(storyId: number, duration: number) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + duration);

    return this.getColony().pipe(
      flatMap<IColonyClient, any>(async colony => {
        const op = await colony.setTaskDueDate.startOperation({
          taskId: storyId,
          dueDate: dueDate
        });

        await op.sign();

        return op;
      })
    );
  }

  finishSetStoryDuration(operation) {
    return this.getColony().pipe(
      flatMap<IColonyClient, boolean>(async colony => {
        const op = await colony.setTaskDueDate.restoreOperation(operation);

        await op.sign();
        const { successful } = await op.send();

        return successful;
      })
    );
  }

  submitRating(storyId: number, role: TaskRole, rating: number) {
    return this.getColony().pipe(
      flatMap<IColonyClient, string>(async colony => {
        const salt = ColonyService.generateSalt();

        const { secret } = await colony.generateSecret.call({
          salt: salt,
          value: new BigNumber(rating * 10)
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

  revealRating(storyId: number, role: TaskRole, rating: number, salt: string) {
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

        return count >= 2;
      })
    );
  }
}
