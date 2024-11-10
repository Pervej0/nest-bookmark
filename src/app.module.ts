import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismadbService } from './prismadb/prismadb.service';
import { ConfigService } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';

@Module({
  imports: [UserModule, AuthModule, BookmarkModule, PrismadbModule],
  providers: [PrismadbService, ConfigService],
})
export class AppModule {}
