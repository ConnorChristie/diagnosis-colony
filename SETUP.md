# Developer Setup
_The backend is not currently being used right now but will eventually provide as the mechanism needed to index the symptoms and allow for efficient query results._

## Prerequisites
### Install ColonyJS
User guide to install, setup, and deploy contracts to a test network: https://joincolony.github.io/colonyjs/docs-get-started/

1. Start `ganache-cli` and ensure it's running
2. Ensure TrufflePig is running and started
3. Redeploy the contracts through TrufflePig
4. (Optional) Start the `jsipfs daemon` and make sure it's accepting websocket connections
   1. Make note of the address for the ws connection, should start with: `/ip4/127.0.0.1/tcp/4003/ws/...`

### MetaMask Configuration
1. Ensure you are connected to `Localhost 8545`
2. Import 3 different wallets using the private keys from TrufflePig: `localhost:3030/accounts`

## Project
1. Clone the project and cd into the project directory
2. Run `npm install` in the root directory
3. Edit the `client/src/environments/environment.ts` file and update the following:
   1. Set `colony.id` to `null` if running for the first time
   2. Set `ipfs.swarm` to contain your local swarm address if running jsipfs, otherwise only keep the discovery swarm address
4. Start the application with `npm start`
5. Once started, navigate to `localhost:4200` and you should be prompted to sign multiple txns for the colony setup
6. After all txns are processed, the colony id will be displayed in the console (id will most likely be 2)
7. Set the `colony.id` to this value in the `environment.ts` file
8. Refresh the browser and everything should be setup!
