export enum AccountRoles {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  VOLUNTEER = 'VOLUNTEER',
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
  password?: string;
  redirectTo?: string;
}