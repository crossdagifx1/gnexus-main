import axios from 'axios';

const BASE_URL = 'http://localhost:8081';

// Test 1: Verify email with invalid token
async function testInvalidToken() {
    console.log('Test 1: Verifying email with invalid token');
    try {
        const response = await axios.post(`${BASE_URL}/api.php?action=verify-email`, {
            token: 'invalid-token-123'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Error (expected):', error.response?.data?.error || error.message);
    }
    console.log('');
}

// Test 2: Check if login requires verified email
async function testLoginRequiresVerification() {
    console.log('Test 2: Checking if login requires verified email');
    try {
        const response = await axios.post(`${BASE_URL}/api.php?action=login`, {
            email: 'unverified@example.com',
            password: 'password123'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Error (expected if email not verified):', error.response?.data?.error || error.message);
    }
    console.log('');
}

// Run all tests
async function runAllTests() {
    console.log('=== Email Verification API Tests ===\n');

    await testInvalidToken();
    await testLoginRequiresVerification();

    console.log('=== Tests completed ===');
}

runAllTests();
