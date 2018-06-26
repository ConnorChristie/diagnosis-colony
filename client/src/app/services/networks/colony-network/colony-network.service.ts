import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

import ColonyNetworkClient from '@colony/colony-js-client';
import { ResearchColony } from '../../../contracts/ResearchColony';
import { EthersNetworkService } from '../ethers-network/ethers-network.service';

// tslint:disable-next-line
export declare type IColonyClient = any;

@Injectable({
  providedIn: 'root'
})
export class ColonyNetworkService {
  private networkClient: ColonyNetworkClient;
  private researchColony: ResearchColony;

  constructor(private ethersNetworkService: EthersNetworkService) {
    const adapter = this.ethersNetworkService.getAdapter();
    const web3 = this.ethersNetworkService.getWeb3();

    this.networkClient = new ColonyNetworkClient({ adapter });
    this.researchColony = new ResearchColony(web3, environment.arbiter.address);
  }

  async init() {
    await this.networkClient.init();
  }

  async createColony(): Promise<number> {
    // Create the token
    const tokenAddress = await this.networkClient.createToken({
      name: environment.colony.token.name,
      symbol: environment.colony.token.symbol
    });

    // Create the colony
    const {
      eventData: { colonyId, colonyAddress }
    } = await this.networkClient.createColony.send({ tokenAddress });

    const colony = await this.getColony(colonyId);
    const userAddress = await this.ethersNetworkService.getUserAddress();

    // Make the colony contract the owner of the token
    await colony.token.setOwner.send({ owner: colony.contract.address });

    // Add yourself as an admin
    await colony.authority.setUserRole.send({
      user: userAddress,
      role: 'ADMIN'
    });

    // Mint some tokens
    // await colony.mintTokens.send({ amount: new BigNumber(1000) });

    console.log(`Token addr: ${tokenAddress}`);
    console.log(`Colony ID: ${colonyId}`);
    console.log(`Colony addr: ${colonyAddress}`);

    return colonyId;
  }

  async getColony(colonyId: number): Promise<IColonyClient> {
    return await this.networkClient.getColonyClient(colonyId);
  }

  getResearchColony() {
    return this.researchColony;
  }

  async getMetaColony(): Promise<IColonyClient> {
    return await this.networkClient.getMetaColonyClient();
  }
}
