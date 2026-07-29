import { Global, Module } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { PluginsController } from './plugins.controller';

@Global()
@Module({
  providers: [PluginsService],
  exports: [PluginsService],
  controllers: [PluginsController]
})
export class PluginsModule {}
