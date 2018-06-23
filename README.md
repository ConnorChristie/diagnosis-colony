# Diagnosis Colony
Building a colony of individuals who solve medical mysteries

## Background
What inspired me to come up with this idea was hearing stories about rare diseases that only a handful of people have in the world without there being any research or doctors knowing anything about the condition. This project aims to bring together the symptoms of unseen diseases with scientists, researchers, doctors, and the general public to find out more and reward them for their work in discovering more about the condition.

Not only could this be applicable to rare diseases, this could provide insight on general diseases such as the flu to neighboring countries that don't have direct access to medical professionals.

## Applications
* Someone with a __rare unknown condition__ may post their story and allow contributions of both funds and knowledge to help them.
* A __group or organization__ may come together to share a larger story about planned parenthood for example, where research can be funded and crowdsourced to learn more about the issues.
* Petition monetary support for possible organ donors or artificial limbs.

## Implementation
There are three main parts of the Colony:
* Condition (a task in Colony)
* Diagnoses (task solutions)
* Medical professionals, researchers, etc. (task evaluators and workers)

### Condition Enquiry
Contains a description, symptoms, and information about an unknown condition, possibly including images or what doctors theorized it could possibly be. Once an enquiry is submitted, it may be matched with an already existing condition based on supplied information. However, additional information can be requested if the matched condition / diagnoses does not fully match.

#### Task Details
* __Deliverable:__ Diagnoses, causes, additional information, alternative symptoms, etc.
* __Due date:__ Never? Few months?
* __Payout:__ Funded by condition holder / family or by community, research institute, etc.
* __Domain:__ Physical, psychological, etc.
* __Skills:__ Orthopedics, nervous system, etc.

#### Diagnosis Submission
Many different individuals or groups may collaborate together on figuring out what the condition is and what the causes may be.
The network would also encourage collaboration and provide positions for different specialties, such as a neurosurgeon providing biological possibilities and data scientists / machine learning algorithms to provide statistical analyses.

__Submitters:__
* Open the doors for anyone to contribute
* Allow the _evaluators_ to rate contributions
* Provide integrations into existing solutions such as WebMD or Wikipedia

## Workflow Overview
![Overview](http://drive.google.com/uc?id=1l3NBQRbCcCjN6mUJGEsA_1ronVWOQeyu)

## Developer Setup
_The backend is not currently being used right now but will eventually provide as the mechanism needed to index the symptoms and allow for efficient query results._

### Prerequisites
#### Install ColonyJS
User guide to install, setup, and deploy contracts to a test network: https://joincolony.github.io/colonyjs/docs-get-started/

1. Start `ganache-cli` and ensure it's running
2. Ensure TrufflePig is running and started
3. Redeploy the contracts through TrufflePig
4. (Optional) Start the `jsipfs daemon` and make sure it's accepting websocket connections
   1. Make note of the address for the ws connection, should start with: `/ip4/127.0.0.1/tcp/4003/ws/...`

#### MetaMask Configuration
1. Ensure you are connected to `Localhost 8545`
2. Import 3 different wallets using the private keys from TrufflePig: `localhost:3030/accounts`

### Project
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
