import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RedirectsService } from './redirects.service';

@Controller('redirects')
export class RedirectsController {
  constructor(private readonly redirectsService: RedirectsService) {}

  @Get()
  async getAllRedirects(@Query('activeOnly') activeOnly?: string) {
    if (activeOnly === 'true') {
      return this.redirectsService.getActiveRedirects();
    }
    return this.redirectsService.getAllRedirects();
  }

  @Post()
  async createRedirect(@Body() body: any) {
    return this.redirectsService.createRedirect(body);
  }

  @Put(':id')
  async updateRedirect(@Param('id') id: string, @Body() body: any) {
    return this.redirectsService.updateRedirect(id, body);
  }

  @Delete(':id')
  async deleteRedirect(@Param('id') id: string) {
    return this.redirectsService.deleteRedirect(id);
  }
}
