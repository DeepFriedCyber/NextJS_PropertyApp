export type UserType = 'individual' | 'agent';

export interface BaseUser {
  id: string;
  email: string;
  password: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndividualUser extends BaseUser {
  userType: 'individual';
  firstName?: string;
  lastName?: string;
}

export interface AgentUser extends BaseUser {
  userType: 'agent';
  companyName: string;
  licenseNumber: string;
  agencyName?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export type User = IndividualUser | AgentUser;

export interface RegisterRequest {
  email: string;
  password: string;
  userType: UserType;
  companyName?: string;
  licenseNumber?: string;
  firstName?: string;
  lastName?: string;
}