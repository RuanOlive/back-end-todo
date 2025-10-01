import { Injectable, Inject, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import type { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../constants/auth.constants";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

  
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = this.extractTokenHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }
    console.log("Guard Chamado!")

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload?.sub
        }
      })
      
      if(!user?.active) {
        throw new UnauthorizedException('Acesso não autorizado.');
      }

      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload
      
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractTokenHeader(header: string): string | null {
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }
}
