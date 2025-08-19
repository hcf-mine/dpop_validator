const DPoPValidator = require('./dpop-validator');
const jwt = require('jsonwebtoken');
const { JWK } = require('node-jose');

async function runTests() {
  console.log('Running DPoP Validator Tests...\n');
  
  const validator = new DPoPValidator();
  
  // Generate test key pair
  const keystore = JWK.createKeyStore();
  const key = await keystore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' });
  
  // Test 1: Valid DPoP token
  console.log('Test 1: Valid DPoP token');
  const validPayload = {
    jti: 'test-jti-123',
    htm: 'POST',
    htu: 'https://api.example.com/orders',
    iat: Math.floor(Date.now() / 1000)
  };
  
  const validToken = jwt.sign(validPayload, key.toPEM(true), {
    algorithm: 'RS256',
    header: {
      typ: 'dpop+jwt',
      jwk: key.toJSON()
    }
  });
  
  const result1 = await validator.validateDPoPToken(validToken, 'POST', 'https://api.example.com/orders');
  console.log(result1.valid ? '✅ PASS' : '❌ FAIL:', result1.error || 'Valid token');
  
  // Test 2: Invalid HTTP method
  console.log('\nTest 2: Invalid HTTP method');
  const result2 = await validator.validateDPoPToken(validToken, 'GET', 'https://api.example.com/orders');
  console.log(!result2.valid ? '✅ PASS' : '❌ FAIL:', result2.error);
  
  // Test 3: Invalid URL
  console.log('\nTest 3: Invalid URL');
  const result3 = await validator.validateDPoPToken(validToken, 'POST', 'https://api.different.com/orders');
  console.log(!result3.valid ? '✅ PASS' : '❌ FAIL:', result3.error);
  
  // Test 4: Missing required claim
  console.log('\nTest 4: Missing required claim');
  const invalidPayload = {
    htm: 'POST',
    htu: 'https://api.example.com/orders',
    iat: Math.floor(Date.now() / 1000)
    // Missing jti
  };
  
  const invalidToken = jwt.sign(invalidPayload, key.toPEM(true), {
    algorithm: 'RS256',
    header: {
      typ: 'dpop+jwt',
      jwk: key.toJSON()
    }
  });
  
  const result4 = await validator.validateDPoPToken(invalidToken, 'POST', 'https://api.example.com/orders');
  console.log(!result4.valid ? '✅ PASS' : '❌ FAIL:', result4.error);
  
  console.log('\nAll tests completed!');
}

runTests().catch(console.error);