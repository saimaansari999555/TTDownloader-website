import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContactMessage } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
    return this.prisma.contactMessage.create({ data });
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async markRead(id: string): Promise<ContactMessage> {
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async delete(id: string): Promise<ContactMessage> {
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
