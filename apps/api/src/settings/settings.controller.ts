import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Get(':key')
  async getSetting(@Param('key') key: string) {
    return this.settingsService.getSetting(key);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':key')
  async updateSetting(@Param('key') key: string, @Body('value') value: string) {
    return this.settingsService.updateSetting(key, value);
  }
}
