export interface UserAccount {
  id: string;
  email: string;
  is_active: boolean;
  details: string;
  joined: string;
}

export interface UserAccountPayload {
  email: string;
  is_active: boolean;
  password?: string;
}

export interface UserAccountDetails {
  email: string;
  isArchived: boolean;
  password?: string;
}
