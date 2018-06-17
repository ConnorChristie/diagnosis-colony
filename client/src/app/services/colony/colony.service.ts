import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ColonyNetworkService,
  IColonyClient
} from '../networks/colony-network/colony-network.service';
import { IpfsNetworkService } from '../networks/ipfs-network/ipfs-network.service';
import { IStory, IStoryTask } from '../../models/story';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { IResearch } from '../../models/research';

export enum TaskRole {
  MANAGER = 'MANAGER',
  EVALUATOR = 'EVALUATOR',
  WORKER = 'WORKER'
}

export interface ITaskRole {
  address: string;
}

export interface ITaskRoles {
  manager: ITaskRole;
  evaluator: ITaskRole;
  worker: ITaskRole;
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
    private ipfsNetworkService: IpfsNetworkService
  ) {}

  static toStoryId(offset: number, index: number) {
    return offset + index + 1;
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
        const { specificationHash, potId, dueDate } = await colony.getTask.call(
          {
            taskId: id
          }
        );

        return {
          id: id,
          story: await this.ipfsNetworkService.getData<IStory>(
            specificationHash
          ),
          potId: potId,
          dueDate: dueDate
        };
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
      flatMap(
        async colony => (await colony.getTaskCount.call()).count as number
      )
    );
  }

  getPotBalance(potId: number) {
    return combineLatest(this.getColony(), this.getToken()).pipe(
      flatMap(
        async ([colony, token]) =>
          (await colony.getPotBalance.call({
            potId,
            source: token
          })).balance
      )
    );
  }

  getTaskRoles(storyId: number): Observable<ITaskRoles> {
    return this.getColony().pipe(
      flatMap(async colony => ({
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
      flatMap(async colony => {
        return await colony.setTaskRoleUser.send({
          taskId: storyId,
          role: role,
          user: user
        });
      })
    );
  }
}
