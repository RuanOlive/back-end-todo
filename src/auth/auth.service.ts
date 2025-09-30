import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(body: LoginDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!foundUser) {
      throw new HttpException(
        'Senha/Usuário incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordIsValid = await this.hashingService.compare(
      body.password,
      foundUser.hashPassword,
    );

    if (!passwordIsValid) {
      throw new HttpException(
        'Senha/Usuário incorretos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      sub: foundUser.id, 
      email: foundUser.email,
      name: foundUser.name,
    };

    // Gera o token usando config tipada
    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      expiresIn: this.jwtConfiguration.jwtTtl,
    });

    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      access_token: token,
    };
  }
}
