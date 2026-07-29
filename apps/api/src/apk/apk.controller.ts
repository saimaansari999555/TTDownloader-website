import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApkService } from './apk.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('apk')
export class ApkController {
  constructor(private readonly apkService: ApkService) {}

  @Get('latest')
  getLatest() {
    return this.apkService.getLatest();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.apkService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: { version: string; title: string; description?: string; downloadUrl: string; fileSize?: string; changelog?: string }) {
    return this.apkService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.apkService.delete(id);
  }
}
