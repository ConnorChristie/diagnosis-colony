import { Injectable } from '@angular/core';

import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import { providers } from 'ethers';

import EthersAdapter from '@colony/colony-js-adapter-ethers';
import Web3 from 'web3';

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

  private address: string;

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
    if (this.address) {
      return Promise.resolve(this.address);
    }

    this.address = await this.signer.getAddress();

    return this.address;
  }

  getAdapter() {
    return this.adapter;
  }
}
