import { Injectable } from '@angular/core';

import { providers } from 'ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import Web3 from 'web3';
import EthersAdapter from '@colony/colony-js-adapter-ethers';

declare const web3: Web3;

declare interface ISigner {
  getAddress(): Promise<string>;
}

@Injectable({
  providedIn: 'root'
})
export class EthersNetworkService {
  private readonly signer: ISigner;
  private readonly adapter: EthersAdapter;

  constructor() {
    let provider;

    if (typeof web3 !== 'undefined') {
      provider = new providers.Web3Provider(web3.currentProvider);
      this.signer = provider.getSigner();
    } else {
      provider = providers.getDefaultProvider();
    }

    const loader = new TrufflepigLoader();
    this.adapter = new EthersAdapter({
      loader,
      provider,
      wallet: this.signer
    });
  }

  async getUserAddress() {
    return await this.signer.getAddress();
  }

  getAdapter() {
    return this.adapter;
  }
}
