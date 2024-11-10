import { Global, Module } from '@nestjs/common';
import { PrismadbService } from './prismadb.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [PrismadbService, ConfigService],
  exports: [PrismadbService],
})
export class PrismadbModule {}
