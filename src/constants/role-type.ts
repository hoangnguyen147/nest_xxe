export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  MASTER = 'MASTER',
}

export const AdminPageRole: Array<RoleType> = [
  RoleType.MASTER,
  RoleType.ADMIN,
  RoleType.EDITOR,
];

export const AllRole: Array<RoleType> = [
  RoleType.MASTER,
  RoleType.ADMIN,
  RoleType.EDITOR,
  RoleType.USER,
];
