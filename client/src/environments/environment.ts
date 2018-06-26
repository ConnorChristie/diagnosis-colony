// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  colony: {
    id: 4,
    token: {
      name: 'Diagnosis Colony',
      symbol: 'DIAG'
    }
  },
  arbiter: {
    address: '0x0dffdbdddda1a71f2c18eaff33ca592334da9650'
  },
  ethereum: {
    network: null
  },
  ipfs: {
    swarm: [
      '/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmXeGoXuCuirE9NNJjhfovq76eJ7iT7EaJVUQWpDhV9AMY',
      '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
    ]
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.
