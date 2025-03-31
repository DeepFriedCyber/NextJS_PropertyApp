import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getXataClient } from '@/lib/xata';
import { RegisterRequest } from '@/types/auth';

export async function POST(req: Request) {
  try {
    const body: RegisterRequest = await req.json();
    const { email, password, userType, companyName, licenseNumber, firstName, lastName } = body;

    // Basic validation
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const xata = getXataClient();

    // Check if user already exists
    const existingUser = await xata.db.users.filter({ email }).getFirst();
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create base user object
    const baseUserData = {
      email,
      password: hashedPassword,
      userType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create user based on type
    let userData;
    if (userType === 'agent') {
      // Additional validation for agent
      if (!companyName || !licenseNumber) {
        return NextResponse.json(
          { error: 'Company name and license number are required for agents' },
          { status: 400 }
        );
      }

      userData = {
        ...baseUserData,
        companyName,
        licenseNumber,
        verificationStatus: 'pending',
      };
    } else {
      // Individual user
      userData = {
        ...baseUserData,
        firstName,
        lastName,
      };
    }

    // Create user in database
    const newUser = await xata.db.users.create(userData);

    // Remove sensitive data before sending response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}