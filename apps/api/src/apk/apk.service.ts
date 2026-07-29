import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppRelease } from '@prisma/client';

@Injectable()
export class ApkService {
  constructor(private prisma: PrismaService) {}

  async getLatest(): Promise<AppRelease | null> {
    return this.prisma.appRelease.findFirst({ where: { isLatest: true }, orderBy: { createdAt: 'desc' } });
  }

  async findAll(): Promise<AppRelease[]> {
    return this.prisma.appRelease.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: { version: string; title: string; description?: string; downloadUrl: string; fileSize?: string; changelog?: string }): Promise<AppRelease> {
    // Mark all previous as not latest
    await this.prisma.appRelease.updateMany({ data: { isLatest: false } });
    return this.prisma.appRelease.create({ data: { ...data, isLatest: true } });
  }

  async delete(id: string): Promise<AppRelease> {
    return this.prisma.appRelease.delete({ where: { id } });
  }
}
