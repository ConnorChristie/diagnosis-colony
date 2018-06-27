import BigNumber from 'bn.js';

export enum StoryRole {
  AUTHOR = 'MANAGER',
  EVALUATOR = 'EVALUATOR',
  RESEARCHER = 'WORKER'
}

export interface IParticipant {
  address: string;
}

export interface ITaskRoles {
  researchers: IParticipant[];
  evaluators: IParticipant[];
}

const ROLE_MAP = {
  [StoryRole.AUTHOR]: 0,
  [StoryRole.EVALUATOR]: 1,
  [StoryRole.RESEARCHER]: 2
};

export function toTaskRole(role: number | BigNumber) {
  let roleNumber = role;

  if (role.toNumber !== undefined) {
    roleNumber = role.toNumber();
  }

  switch (roleNumber) {
    case 0:
      return StoryRole.AUTHOR;
    case 1:
      return StoryRole.EVALUATOR;
    case 2:
      return StoryRole.RESEARCHER;
  }
}

export function toRoleNumber(role: StoryRole) {
  return ROLE_MAP[role];
}
