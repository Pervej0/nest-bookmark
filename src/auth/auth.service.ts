import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon2 from 'argon2';
import { AuthDto } from 'src/dto';
import { PrismadbService } from 'src/prismadb/prismadb.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismadbService) {}
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

    return user;
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
      return user;
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
}
