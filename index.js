const DPoPValidator = require('./dpop-validator');

// Example usage
const validator = new DPoPValidator();

// Example usage demonstration
function showUsage() {
  console.log('DPoP Validator is ready to use!');
  console.log('\nTo validate a real DPoP token:');
  console.log('\nconst result = await validator.validateDPoPToken(');
  console.log('  dpopTokenFromHeader,');
  console.log('  "POST",');
  console.log('  "https://api.example.com/orders",');
  console.log('  accessTokenFromHeader');
  console.log(');');
  console.log('\nif (result.valid) {');
  console.log('  console.log("Valid DPoP token");');
  console.log('} else {');
  console.log('  console.log("Invalid:", result.error);');
  console.log('}');
  console.log('\nRun "npm test" to see validation tests with real tokens.');
}

// Export for use as module
module.exports = { DPoPValidator };

// Run example if called directly
if (require.main === module) {
  console.log('DPoP Validator Example');
  console.log('======================');
  showUsage();
}