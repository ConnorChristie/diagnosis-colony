import { Injectable } from '@angular/core';

import { providers, Wallet } from 'ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import Web3 from 'web3';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import ColonyNetworkClient from '@colony/colony-js-client';

declare const web3: Web3;

// tslint:disable-next-line
declare type IColonyClient = any;

@Injectable({
  providedIn: 'root'
})
export class ColonyNetworkService {
  private networkClient: ColonyNetworkClient;

  constructor() {
    let provider: providers.Provider;
    let signer: providers.JsonRpcProvider.JsonRpcSigner;

    if (typeof web3 !== 'undefined') {
      provider = new providers.Web3Provider(web3.currentProvider);
      signer = provider.getSigner();
    } else {
      provider = providers.getDefaultProvider();
    }

    const loader = new TrufflepigLoader();
    const adapter = new EthersAdapter({
      loader,
      provider,
      wallet: signer
    });

    this.networkClient = new ColonyNetworkClient({ adapter });
  }

  async init() {
    await this.networkClient.init();
  }

  async createColony(): Promise<number> {
    const tokenAddress = await this.networkClient.createToken({
      name: 'Diagnosis Colony',
      symbol: 'DIAG'
    });

    const {
      eventData: { colonyId }
    } = await this.networkClient.createColony.send({ tokenAddress });

    return colonyId;
  }

  async getColony(colonyId: number): Promise<IColonyClient> {
    return await this.networkClient.getColonyClient(colonyId);
  }

  async getMetaColony(): Promise<IColonyClient> {
    return await this.networkClient.getMetaColonyClient();
  }
}
