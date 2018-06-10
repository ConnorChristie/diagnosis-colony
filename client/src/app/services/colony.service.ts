import { Injectable } from '@angular/core';
import { ColonyNetworkService } from './networks/colony-network.service';
import { IpfsNetworkService } from './networks/ipfs-network.service';
import { ITaskSpecification } from '../models/task-specification';

@Injectable({
  providedIn: 'root'
})
export class ColonyService {
  private colonyId: number = 2;

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
  }

  async getColony() {
    return await this.colonyNetworkService.getColony(this.colonyId);
  }

  async createTask(): Promise<number> {
    const colony = await this.getColony();
    const spec: ITaskSpecification = {
      name: 'First one',
      description: 'way to be first!'
    };

    const { hash } = await this.ipfsNetworkService.addTaskData(spec);

    // const {
    //   eventData: { taskId }
    // } = await colony.createTask.send({ specificationHash: hash, domainId: 1 });

    return 1; //taskId;
  }
}
