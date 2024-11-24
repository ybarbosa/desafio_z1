import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async generateToken(phone: string) {
    const user = await this.prismaService.user.findFirst({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const payloadJwt = { sub: user.id };

    const token = await this.jwtService.signAsync(payloadJwt);

    return {
      token,
    };
  }
}
