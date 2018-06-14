import { Injectable } from '@angular/core';
import { ColonyNetworkService } from '../networks/colony-network/colony-network.service';
import { IpfsNetworkService } from '../networks/ipfs-network/ipfs-network.service';
import { IStory } from '../../models/story';
import { ReplaySubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private initialized = new ReplaySubject<boolean>();
  private colonyId = 2;

  constructor(
    private colonyNetworkService: ColonyNetworkService,
    private ipfsNetworkService: IpfsNetworkService
  ) {}

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

  createStory(story: IStory) {
    return this.getColony().pipe(
      flatMap(async colony => {
        const { hash } = await this.ipfsNetworkService.saveData(story);

        const {
          eventData: { taskId }
        } = await colony.createTask.send({
          specificationHash: hash,
          domainId: 1
        });

        return taskId as number;
      })
    );
  }

  getStory(id: number) {
    return this.getColony().pipe(
      flatMap(async colony => {
        const { specificationHash } = await colony.getTask.call({
          taskId: id
        });

        return this.ipfsNetworkService.getData<IStory>(specificationHash);
      })
    );
  }

  getStories(skip: number, take: number) {
    return Array.from({ length: take }, (v, k) => k + skip + 1).map(id =>
      this.getStory(id)
    );
  }

  getStoryCount() {
    return this.getColony().pipe(
      flatMap(async colony => {
        return (await colony.getTaskCount.call()).count as number;
      })
    );
  }
}
