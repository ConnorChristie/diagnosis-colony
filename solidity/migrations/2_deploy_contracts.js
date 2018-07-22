/* globals artifacts */
/* eslint-disable no-undef, no-console */

module.exports = deployer => {
  if (deployer.network_id === 777) {
    return;
  }

  const colonyNetworkContracts = "./lib/colonyNetwork/contracts/";
  const colonyNetworkBuilt = "./lib/colonyNetwork/build/contracts/";
  const colonyAddress = "0xDf21e0fF5B53a27c52144cbFdD92D3a9586fA6B6";

  const Colony = artifacts.resolver.require(colonyNetworkContracts + "Colony", colonyNetworkBuilt);
  const Authority = artifacts.resolver.require(colonyNetworkContracts + "Authority", colonyNetworkBuilt);

  const ResearchColony = artifacts.require("./ResearchColony");

  var researchColony;
  var authInstance;

  deployer.deploy(ResearchColony, colonyAddress).then(instance => {
    researchColony = instance;
    return Colony.at(colonyAddress);
  }).then(colonyInstance => {
    return colonyInstance.authority.call();
  }).then(auth => {
    return Authority.at(auth);
  }).then(instance => {
    authInstance = instance;
    return authInstance.setUserRole(researchColony.address, 0, true);
  }).then(() => {
    return authInstance.setUserRole(researchColony.address, 1, true);
  }).then(() => {
    console.log("Setup researchColony contracts");
  }).catch(err => {
    console.log("Error:", err);
  });
};
