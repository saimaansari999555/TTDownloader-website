import { Controller, Post, Get, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public: submit contact form
  @Post()
  async create(@Body() body: { name: string; email: string; subject: string; message: string }) {
    await this.contactService.create(body);
    return { success: true, message: 'Your message has been sent successfully!' };
  }

  // Admin: list all messages
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  // Admin: mark as read
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.contactService.markRead(id);
  }

  // Admin: delete message
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
