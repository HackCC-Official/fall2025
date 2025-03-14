export enum AccountRoles {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  JUDGE = 'JUDGE',
  USER = 'USER'
}

export interface AccountDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: AccountRoles[];
  createdAt?: string;
}