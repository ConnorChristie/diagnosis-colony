import { Injectable } from '@angular/core';

import { providers, Wallet } from 'ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';

import Web3 from 'web3';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import ColonyNetworkClient from '@colony/colony-js-client';

declare const web3: Web3;

@Injectable({
  providedIn: 'root'
})
export class EthersService {

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

  /**
   * Token address: 0xa6f8431C9eEe4Ac2859207aF4004F7a948924c30
   Colony ID: 3
   Colony address: 0x4479B49eE193E6107Ed2Ad38A9b089Ee362542BA
   Meta Colony address: 0xCa24282be001a428d27FdAC4676561c2EB1DE393
   * @returns {Promise<void>}
   */
  async runExample() {
    // Let's deploy a new ERC20 token for our Colony.
    // You could also skip this step and use a pre-existing/deployed contract.
    const tokenAddress = await this.networkClient.createToken({
      name: 'Diagnosis Colony',
      symbol: 'DIAG',
    });
    console.log('Token address: ' + tokenAddress);

    // Create a cool Colony!
    const {
      eventData: { colonyId, colonyAddress },
    } = await this.networkClient.createColony.send({ tokenAddress });

    // Congrats, you've created a Colony!
    console.log('Colony ID: ' + colonyId);
    console.log('Colony address: ' + colonyAddress);

    // For a colony that exists already, you just need its ID:
    const colonyClient = await this.networkClient.getColonyClient(colonyId);

    // Or alternatively, just its address:
    // const colonyClient = await networkClient.getColonyClientByAddress(colonyAddress);

    // You can also get the Meta Colony:
    const metaColonyClient = await this.networkClient.getMetaColonyClient();
    console.log('Meta Colony address: ' + metaColonyClient.contract.address);
  }
}
