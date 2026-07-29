import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BackupService } from './backup.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('backup')
@UseGuards(AuthGuard('jwt'))
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('export')
  async exportBackup() {
    return this.backupService.exportData();
  }

  @Post('import')
  async importBackup(@Body() payload: any) {
    return this.backupService.importData(payload);
  }
}
