pragma solidity ^0.4.23;

import "../lib/colonyNetwork/contracts/IColony.sol";

contract ResearchColony {

  IColony colony;

  mapping (uint => Story) stories;

  mapping (uint => mapping (uint => ResearchRequest)) requests;
  mapping (uint => mapping (uint => RoleAssignment)) assignments;

  struct Story {
    address author;

    uint requestCount;
    uint assignmentCount;

    mapping (address => uint) participants;
  }

  struct ResearchRequest {
    address user;
    uint duration;
  }

  struct RoleAssignment {
    address user;
    uint8 role;
  }

  uint8 constant MANAGER = 0;
  uint8 constant EVALUATOR = 1;
  uint8 constant WORKER = 2;

  event Deposit(address indexed sender, uint storyId, uint value);
  event StoryCreated(uint indexed storyId);

  event ResearcherInterested(uint indexed storyId, address user);
  event RoleAssigned(uint indexed storyId, address indexed user, uint8 role);

  constructor(address _colony) public {
    colony = IColony(_colony);
  }

  function createStory(bytes32 _specificationHash, uint256 _domainId) public {
    colony.makeTask(_specificationHash, _domainId);

    uint storyId = colony.getTaskCount();

    Story memory story;
    story.author = msg.sender;
    stories[storyId] = story;

    colony.setTaskRoleUser(storyId, WORKER, address(this));
    colony.setTaskRoleUser(storyId, EVALUATOR, address(this));

    emit StoryCreated(storyId);
  }

  function getStory(uint _storyId) public view returns (address) {
    Story storage story = stories[_storyId];
    return (story.author);
  }

  function fundStory(uint _storyId, uint _amount) public payable {
    require(_amount == msg.value);

    address _token = colony.getToken();
    var (,,,,,,potId,,,) = colony.getTask(_storyId);

    colony.mintTokens(_amount);
    colony.claimColonyFunds(_token);
    colony.moveFundsBetweenPots(1, potId, _amount, _token);

    uint totalPayout = colony.getPotBalance(potId, _token);
    colony.setTaskManagerPayout(_storyId, _token, totalPayout);

    emit Deposit(msg.sender, _storyId, _amount);
  }

  function submitResearchRequest(uint _storyId, uint duration) public {
    Story storage story = stories[_storyId];
    require(story.participants[msg.sender] == 0);

    ResearchRequest memory request;
    request.user = msg.sender;
    request.duration = duration;

    story.requestCount += 1;
    story.participants[msg.sender] = story.requestCount;

    requests[_storyId][story.requestCount] = request;

    emit ResearcherInterested(_storyId, msg.sender);
  }

  function getResearchRequest(uint _storyId, uint _id) public view returns (address, uint) {
    ResearchRequest storage request = requests[_storyId][_id];
    return (request.user, request.duration);
  }

  function getRequestCount(uint _storyId) public view returns (uint) {
    return stories[_storyId].requestCount;
  }

  function assignUserRole(uint _storyId, uint _requestId, address _user, uint8 _role) public {
    Story storage story = stories[_storyId];
    uint index = story.participants[_user];

    require(index != 0);
    require(assignments[_storyId][index].user != _user);

    RoleAssignment memory assignment;
    assignment.user = _user;
    assignment.role = _role;

    story.assignmentCount += 1;
    story.participants[msg.sender] = story.assignmentCount;

    assignments[_storyId][story.assignmentCount] = assignment;

    delete requests[_storyId][_requestId];
    emit RoleAssigned(_storyId, _user, _role);
  }

  function getRoleAssignment(uint _storyId, uint _id) public view returns (address, uint8) {
    RoleAssignment storage assignment = assignments[_storyId][_id];
    return (assignment.user, assignment.role);
  }

  function getAssignmentCount(uint _storyId) public view returns (uint) {
    return stories[_storyId].assignmentCount;
  }
}
