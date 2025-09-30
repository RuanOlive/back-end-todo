import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET || 'defaultSecretIfYouWant',
    audience: process.env.JWT_TOKEN_AUDIENCE || 'your-audience',
    issuer: process.env.JWT_TOKEN_ISSUER || 'your-issuer',
    jwtTtl: process.env.JWT_TTL || '30d',  // por exemplo “3600s” ou “1h” ou “30d”
  };
});