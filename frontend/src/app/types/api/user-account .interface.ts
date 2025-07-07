export interface UserAccount {
  id: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  details: string;
  joined: string;
}

export interface UserAccountPayload {
  email: string;
  is_active: boolean;
  is_staff?: boolean;
  password?: string;
}

export interface UserAccountDetails {
  email: string;
  isArchived: boolean;
  isAdmin: boolean;
  password?: string;
}
