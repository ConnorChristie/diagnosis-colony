import { Injectable } from '@angular/core';
import { providers } from 'ethers';
import { environment } from '../../../../environments/environment';

import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import NetworkLoader from '@colony/colony-js-contract-loader-network';

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
  private readonly web3: Web3;

  private address: string;

  constructor() {
    const { network } = environment.ethereum;

    let loader;
    let provider;

    if (typeof web3 !== 'undefined') {
      provider = new providers.Web3Provider(web3.currentProvider, network);
      this.signer = provider.getSigner();
    } else if (!network) {
      provider = new providers.JsonRpcProvider('http://localhost:8545/');
    } else {
      provider = providers.getDefaultProvider(network);
    }

    if (network === null) {
      loader = new TrufflepigLoader();
    } else {
      loader = new NetworkLoader({ network });
    }

    // this.applySyncAddress().then();

    const wallet = this.signer || provider;

    this.adapter = new EthersAdapter({
      loader,
      provider,
      wallet
    });

    this.web3 = new Web3(web3.currentProvider);
  }

  async getUserAddress() {
    if (this.address) {
      return Promise.resolve(this.address);
    }

    this.address = (await this.signer.getAddress()).toLowerCase();

    return this.address;
  }

  getAdapter() {
    return this.adapter;
  }

  getWeb3() {
    return this.web3;
  }

  private async applySyncAddress() {
    const userAddress = await this.getUserAddress();

    Object.defineProperty(this.signer, 'address', {
      enumerable: true,
      value: userAddress,
      writable: false
    });

    Object.defineProperty(this.signer, '_syncAddress', {
      enumerable: true,
      value: true,
      writable: false
    });
  }
}
