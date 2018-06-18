export enum TaskRole {
  MANAGER = 'MANAGER',
  EVALUATOR = 'EVALUATOR',
  WORKER = 'WORKER'
}

export interface ITaskRole {
  address: string;
}

export interface ITaskRoles {
  manager: ITaskRole;
  evaluator: ITaskRole;
  worker: ITaskRole;
}
