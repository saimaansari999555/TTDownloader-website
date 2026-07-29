import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { DownloaderModule } from './downloader/downloader.module';
import { BlogModule } from './blog/blog.module';
import { SettingsModule } from './settings/settings.module';
import { MediaModule } from './media/media.module';
import { PluginsModule } from './plugins/plugins.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ContactModule } from './contact/contact.module';
import { ApkModule } from './apk/apk.module';
import { PagesModule } from './pages/pages.module';
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule, 
    UsersModule, 
    PrismaModule, 
    DownloaderModule, 
    BlogModule, 
    SettingsModule, 
    MediaModule, 
    PluginsModule, ContactModule, ApkModule, PagesModule, BackupModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
