# DPoP Token Validator

A Node.js implementation for validating DPoP (Demonstration of Proof-of-Possession) tokens according to RFC 9449.

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
const DPoPValidator = require('./dpop-validator');

const validator = new DPoPValidator();
const result = validator.validateDPoPToken(
  dpopTokenFromHeader,
  'POST',
  'https://api.example.com/orders',
  accessTokenFromHeader  // optional
);

if (result.valid) {
  console.log('DPoP token is valid');
} else {
  console.log('Invalid DPoP token:', result.error);
}
```

### Express.js Middleware

```javascript
const express = require('express');
const DPoPValidator = require('./dpop-validator');

const app = express();
const validator = new DPoPValidator();

async function validateDPoP(req, res, next) {
  const dpopToken = req.headers['dpop'];
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!dpopToken) {
    return res.status(400).json({ error: 'Missing DPoP header' });
  }
  
  const result = await validator.validateDPoPToken(
    dpopToken,
    req.method,
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    accessToken
  );
  
  if (!result.valid) {
    return res.status(401).json({ error: result.error });
  }
  
  req.dpop = result.payload;
  next();
}

app.use('/api', validateDPoP);
```

### Real-world Usage

```javascript
// In your API route handler
app.post('/api/orders', async (req, res) => {
  const dpopToken = req.headers['dpop'];
  const accessToken = req.headers['authorization']?.replace('Bearer ', '');
  
  const result = await validator.validateDPoPToken(
    dpopToken,
    'POST',
    'https://api.example.com/orders',
    accessToken
  );
  
  if (!result.valid) {
    return res.status(401).json({ error: result.error });
  }
  
  // Process the order...
  res.json({ success: true });
});
```

### What npm start does

`npm start` shows usage instructions and code examples - it's educational, not functional.

### What npm test does

`npm test` runs comprehensive validation tests with real DPoP tokens to verify the validator works correctly.

## Running Tests

```bash
npm test
```

## Features

- Validates DPoP JWT signature using JWK from token header
- Verifies all required claims: `jti`, `htm`, `htu`, `iat`
- Checks HTTP method and URL matching
- Validates token timestamp (60-second window)
- Optional access token binding validation
- Supports RS256 and ES256 algorithms

## DPoP Token Structure

A valid DPoP token must contain:

**Header:**
- `typ`: "dpop+jwt"
- `alg`: Signing algorithm (RS256/ES256)
- `jwk`: Public key in JWK format

**Payload:**
- `jti`: Unique token identifier
- `htm`: HTTP method
- `htu`: HTTP URI (without query/fragment)
- `iat`: Issued at timestamp
- `ath`: Access token hash (optional)

## Important Notes

- The `validateDPoPToken` method is **async** - always use `await`
- Supports RS256 and ES256 signing algorithms
- Validates token timestamp within 60-second window
- Checks HTTP method and URL matching
- Optional access token binding validation
- All validation errors are returned in `result.error`



----------------------------------------------------------------------
## DPoP Validator Project
A separate Node.js project for validating DPoP tokens was created at `C:\construction\zzz\hcf\dpop_validator\`

### Setup DPoP Validator:
1. Navigate to project directory:
```bash
cd C:\construction\zzz\hcf\dpop_validator
```

2. Install dependencies:
```bash
npm install
```

3. Run example:
```bash
npm start
```

4. Run tests:
```bash
npm test
```

### Project Structure:
- `dpop-validator.js` - Main validator class (async)
- `index.js` - Usage examples and module export
- `test.js` - Comprehensive test suite (all tests pass)
- `package.json` - Project configuration
- `README.md` - Complete documentation with examples

### Usage Examples:

#### Basic Usage:
```javascript
const DPoPValidator = require('./dpop-validator');

const validator = new DPoPValidator();
const result = await validator.validateDPoPToken(
  dpopTokenFromHeader,    // From request headers['dpop']
  'POST',                 // HTTP method
  'https://api.example.com/orders',  // Full URL
  accessTokenFromHeader   // Optional: from Authorization header
);

if (result.valid) {
  console.log('✅ Valid DPoP token');
} else {
  console.log('❌ Invalid:', result.error);
}
```

#### Express Middleware:
```javascript
const express = require('express');
const DPoPValidator = require('./dpop-validator');

const app = express();
const validator = new DPoPValidator();

app.use(async (req, res, next) => {
  const dpopToken = req.headers['dpop'];
  if (!dpopToken) return res.status(400).json({ error: 'Missing DPoP header' });
  
  const result = await validator.validateDPoPToken(
    dpopToken,
    req.method,
    `${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  
  if (!result.valid) return res.status(401).json({ error: result.error });
  next();
});
```

### Important Notes:
- The validator method is **async** - always use `await`
- `npm start` shows usage instructions (educational)
- `npm test` runs validation tests with real tokens
- Validates all DPoP requirements per RFC 9449
- Ready for production use