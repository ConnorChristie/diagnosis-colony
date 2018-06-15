import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';

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
          Swarm: [
            '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmXeGoXuCuirE9NNJjhfovq76eJ7iT7EaJVUQWpDhV9AMY',
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          ]
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
