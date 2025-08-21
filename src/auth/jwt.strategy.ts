import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const customExtractor = (req: any): string | null => {
  if (!req || !req.headers) return null;
  let token = req.headers['authorization'];
  if (!token) return null;


  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  return token; 
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: customExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!, 
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      division_id: payload.division_id,
    };
  }
}
