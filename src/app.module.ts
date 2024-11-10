import { Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { BookmarkModule } from './module/bookmark/bookmark.module';
import { PrismadbService } from './prismadb/prismadb.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismadbModule } from './prismadb/prismadb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    BookmarkModule,
    PrismadbModule,
  ],
  providers: [PrismadbService, ConfigService],
})
export class AppModule {}
