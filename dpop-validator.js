const jwt = require('jsonwebtoken');
const { JWK } = require('node-jose');
const crypto = require('crypto');

class DPoPValidator {
  
  async validateDPoPToken(dpopToken, httpMethod, url, accessToken = null) {
    try {
      // Decode without verification first to get header
      const decoded = jwt.decode(dpopToken, { complete: true });
      
      if (!decoded || decoded.header.typ !== 'dpop+jwt') {
        throw new Error('Invalid DPoP token type');
      }

      // Extract JWK from header
      const jwk = decoded.header.jwk;
      if (!jwk) {
        throw new Error('Missing JWK in DPoP token header');
      }

      // Convert JWK to PEM for verification
      const key = await JWK.asKey(jwk);
      const publicKey = key.toPEM();

      // Verify JWT signature
      const payload = jwt.verify(dpopToken, publicKey, { algorithms: ['RS256', 'ES256'] });

      // Validate required claims
      this.validateClaims(payload, httpMethod, url, accessToken, jwk);

      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  validateClaims(payload, httpMethod, url, accessToken, jwk) {
    // Check required claims
    if (!payload.jti) throw new Error('Missing jti claim');
    if (!payload.htm) throw new Error('Missing htm claim');
    if (!payload.htu) throw new Error('Missing htu claim');
    if (!payload.iat) throw new Error('Missing iat claim');

    // Validate HTTP method
    if (payload.htm !== httpMethod) {
      throw new Error('HTTP method mismatch');
    }

    // Validate URL (without query/fragment)
    const cleanUrl = url.split('?')[0].split('#')[0];
    if (payload.htu !== cleanUrl) {
      throw new Error('URL mismatch');
    }

    // Validate timestamp (within 60 seconds)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - payload.iat) > 60) {
      throw new Error('Token timestamp too old');
    }

    // Validate access token binding if provided
    if (accessToken && payload.ath) {
      const hash = crypto.createHash('sha256').update(accessToken).digest('base64url');
      if (payload.ath !== hash) {
        throw new Error('Access token hash mismatch');
      }
    }
  }
}

module.exports = DPoPValidator;