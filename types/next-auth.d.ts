import 'next-auth';
import { UserType } from './auth';

declare module 'next-auth' {
  interface User {
    userType: UserType;
    companyName?: string;
    licenseNumber?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    firstName?: string;
    lastName?: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: UserType;
    companyName?: string;
    licenseNumber?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    firstName?: string;
    lastName?: string;
  }
}