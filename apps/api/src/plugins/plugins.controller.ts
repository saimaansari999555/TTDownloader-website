import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  // Public endpoint: Fetch active script injections for head/footer layout
  @Get('active')
  async getActivePlugins() {
    return this.pluginsService.findAllActive();
  }

  // Admin endpoint: List all installed plugins
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllPlugins() {
    return this.pluginsService.findAll();
  }

  // Admin endpoint: Toggle plugin status
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/toggle')
  async toggleActive(@Param('id') id: string) {
    return this.pluginsService.toggleActive(id);
  }

  // Admin endpoint: Install a custom plugin
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPlugin(
    @Body()
    body: {
      name: string;
      slug: string;
      description?: string;
      version?: string;
      headCode?: string;
      footerCode?: string;
      configJson?: string;
    },
  ) {
    return this.pluginsService.create(body);
  }

  // Admin endpoint: Configure plugin details
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updatePlugin(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      version?: string;
      headCode?: string;
      footerCode?: string;
      configJson?: string;
    },
  ) {
    return this.pluginsService.update(id, body);
  }

  // Admin endpoint: Uninstall plugin
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePlugin(@Param('id') id: string) {
    return this.pluginsService.delete(id);
  }
}
