# Diagnosis Colony
Building a colony of individuals who solve medical mysteries

## Background
What inspired me to come up with this idea was hearing stories about rare diseases that only a handful of people have in the world without there being any research or doctors knowing anything about the condition. This project aims to bring together the symptoms of unseen diseases with scientists, researchers, doctors, and the general public to find out more and reward them for their work in discovering more about the condition.

Not only could this be applicable to rare diseases, this could provide insight on general diseases such as the flu to neighboring countries that don't have direct access to medical professionals.

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

## Workflow Overview
![Overview](http://drive.google.com/uc?id=1l3NBQRbCcCjN6mUJGEsA_1ronVWOQeyu)

## Developer Setup
### Prerequisites
#### Install ColonyJS
User guide to install, setup, and deploy contracts to a test network: https://joincolony.github.io/colonyjs/docs-get-started/

### Project
1. Run `npm install` in the root, server, and client directories
2. Start the application with `npm start`
