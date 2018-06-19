import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { environment } from '../../../../environments/environment';

import IPFS from 'ipfs';

interface IFile {
  hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class IpfsNetworkService {
  private ipfs: IPFS;

  constructor() {
    const options = {
      config: {
        Addresses: {
          Swarm: environment.ipfs.swarm
        }
      }
    };

    this.ipfs = new IPFS(options);
  }

  async init() {
    return new Promise((res, rej) => {
      this.ipfs.on('ready', () => res());
      this.ipfs.on('error', err => rej(err));
    });
  }

  async saveData<T>(spec: T): Promise<IFile> {
    const [hash] = await this.ipfs.files.add({
      path: `/task-spec-${Math.random()}`,
      content: Buffer.from(JSON.stringify(spec))
    });

    return hash;
  }

  async getData<T>(hash: string): Promise<T> {
    return JSON.parse((await this.ipfs.files.cat(hash)).toString());
  }
}
