import { PrismaClient, MembershipLevel, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testRegister() {
  try {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      membershipLevel: MembershipLevel.BASIC,
      role: UserRole.MEMBER
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });

    if (existingUser) {
      console.log('User already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        ...testUser,
        password: hashedPassword
      }
    });

    console.log('User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      membershipLevel: newUser.membershipLevel,
      role: newUser.role
    });
  } catch (error) {
    console.error('Error in test registration:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testRegister(); 