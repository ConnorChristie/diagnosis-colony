import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ColonyNetworkService } from '../networks/colony-network/colony-network.service';
import { IpfsNetworkService } from '../networks/ipfs-network/ipfs-network.service';
import { IStory } from '../../models/story';
import { ReplaySubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

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

  createStory(story: IStory) {
    return this.getColony().pipe(
      flatMap(async colony => {
        const { hash } = await this.ipfsNetworkService.saveData(story);

        const {
          eventData: { taskId }
        } = await colony.createTask.send({
          specificationHash: hash,
          domainId: this.domainId
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
    return Array.from({ length: take }, (v, k) =>
      ColonyService.toStoryId(skip, k)
    ).map(id => this.getStory(id));
  }

  getStoryCount() {
    return this.getColony().pipe(
      flatMap(async colony => {
        return (await colony.getTaskCount.call()).count as number;
      })
    );
  }
}
