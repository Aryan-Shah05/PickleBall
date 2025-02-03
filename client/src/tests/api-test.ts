import { authService } from '../api/auth.service';
import { userService } from '../api/user.service';
import { courtService } from '../api/court.service';
import { bookingService } from '../api/booking.service';
import { AxiosError } from 'axios';

const testAuth = async () => {
  try {
    console.log('Testing Auth Service...');
    
    // Test login first (assuming user exists)
    console.log('Testing login...');
    try {
      const loginResponse = await authService.login({
        email: 'test@example.com',
        password: 'Test123!'
      });
      console.log('✓ Login successful', loginResponse);
    } catch (err) {
      // If login fails, try registration
      console.log('Login failed, attempting registration...');
      const registerData = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890'
      };
      const registerResponse = await authService.register(registerData);
      console.log('✓ Registration successful', registerResponse);
      
      // Try login again after registration
      const loginResponse = await authService.login({
        email: 'test@example.com',
        password: 'Test123!'
      });
      console.log('✓ Login successful after registration', loginResponse);
    }

    // Test token verification
    console.log('Testing token verification...');
    const verifyResponse = await authService.verifyToken();
    console.log('✓ Token verification successful', verifyResponse);

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
    throw error; // Propagate error to stop further tests
  }
};

const testUserProfile = async () => {
  try {
    console.log('\nTesting User Service...');
    
    // Test get profile
    console.log('Testing get profile...');
    const profile = await userService.getProfile();
    console.log('✓ Get profile successful', profile);

    // Test update profile
    console.log('Testing update profile...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'User',
      phoneNumber: '0987654321',
      notificationPreferences: {
        email: true,
        sms: true,
        bookingReminders: true,
        promotionalOffers: false
      }
    };
    const updateResponse = await userService.updateProfile(updateData);
    console.log('✓ Update profile successful', updateResponse);

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};

const testCourts = async () => {
  try {
    console.log('\nTesting Court Service...');
    
    // Test get all courts
    console.log('Testing get all courts...');
    const courts = await courtService.getCourts();
    console.log('✓ Get courts successful', courts);

    if (courts.length > 0) {
      // Test get court availability
      console.log('Testing court availability...');
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0];
      const availability = await courtService.getCourtAvailability(courts[0].id, formattedDate);
      console.log('✓ Get court availability successful', availability);
    }

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};

const testBookings = async () => {
  try {
    console.log('\nTesting Booking Service...');
    
    // Test get all bookings
    console.log('Testing get all bookings...');
    const bookings = await bookingService.getBookings();
    console.log('✓ Get bookings successful', bookings);

    // Test create booking
    console.log('Testing create booking...');
    const courts = await courtService.getCourts();
    if (courts.length > 0) {
      const bookingData = {
        courtId: courts[0].id,
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: 1
      };
      const createResponse = await bookingService.createBooking(bookingData);
      console.log('✓ Create booking successful', createResponse);

      // Test cancel booking
      if (createResponse.id) {
        console.log('Testing cancel booking...');
        const cancelResponse = await bookingService.cancelBooking(createResponse.id);
        console.log('✓ Cancel booking successful', cancelResponse);
      }
    }

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};

export const runApiTests = async () => {
  console.log('Starting API Tests...\n');
  
  try {
    // First ensure we have authentication
    await testAuth();
    
    // Wait a bit for token to be properly set
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run the rest of the tests in sequence
    const tests = [
      { name: 'User Profile', fn: testUserProfile },
      { name: 'Courts', fn: testCourts },
      { name: 'Bookings', fn: testBookings }
    ];

    for (const test of tests) {
      try {
        console.log(`\nRunning ${test.name} tests...`);
        await test.fn();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.error(`✗ ${test.name} tests failed: API Error:`, error.response?.data);
        } else {
          console.error(`✗ ${test.name} tests failed: Unknown error:`, error);
        }
        // Continue with next test instead of breaking
      }
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('✗ Test suite failed: API Error:', error.response?.data);
    } else {
      console.error('✗ Test suite failed: Unknown error:', error);
    }
  } finally {
    console.log('\nAPI Tests Completed');
  }
}; 