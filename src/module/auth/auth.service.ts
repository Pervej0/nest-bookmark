import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon2 from 'argon2';
import { access } from 'fs';
import { AuthDto } from 'src/dto';
import { PrismadbService } from 'src/prismadb/prismadb.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismadbService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const matchedPassword = await argon2.verify(user.hash, dto.password);

    if (!matchedPassword) {
      throw new ForbiddenException('Invalid password');
    }

    return this.signInToken(user.id, user.email);
  }
  async signUp(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });
      delete user.hash;
      console.log(user);
      return this.signInToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `Unique constraint failed on the ${error.meta.target} field`,
          );
        }
        throw error;
      }
    }
  }

  signInToken(userId: number, email: string) {
    const secretKey = this.config.get('JWT_SECRET_KEY');
    const payload = { userId, email };
    const token = this.jwt.sign(payload, {
      expiresIn: '15m',
      secret: secretKey,
    });

    return {
      message: 'Successfully signed in',
      accessToken: token,
    };
  }
}
