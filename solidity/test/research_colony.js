/* globals artifacts */
/* eslint-disable no-undef, no-console */

const ResearchColony = artifacts.require('ResearchColony');

contract('ResearchColony', async ([owner, researcher, evaluator]) => {

  // it('should create new story', async () => {
  //   const instance = await ResearchColony.deployed();
  //   const txn = await instance.createStory('fd8g7fg79dfg', 1);
  //
  //   assert.equal(false, true);
  // });

  it('should fund specified pot', async () => {
    const instance = await ResearchColony.deployed();
    const { logs } = await instance.fundStory.sendTransaction(25, 60000, { value: 60000 });

    assert.equal(false, true);
  });

  // it('should submit research request', async () => {
  //   const instance = await ResearchColony.deployed();
  //   const { logs } = await instance.submitResearchRequest(1);
  //
  //   assert.equal(logs[0].event, 'ResearchInterest');
  // });

});
