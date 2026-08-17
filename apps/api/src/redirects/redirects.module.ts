import { Module } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { RedirectsController } from './redirects.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RedirectsController],
  providers: [RedirectsService],
  exports: [RedirectsService],
})
export class RedirectsModule {}
