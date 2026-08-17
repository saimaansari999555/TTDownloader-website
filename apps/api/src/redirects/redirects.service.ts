import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedirectsService {
  constructor(private prisma: PrismaService) {}

  private normalizePath(path: string): string {
    if (!path) return '';
    const trimmed = path.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  private validateNoLoop(source: string, target: string, existingRedirects: any[], currentId?: string) {
    const normSource = this.normalizePath(source).toLowerCase();
    const normTarget = this.normalizePath(target).toLowerCase();

    if (normSource === normTarget) {
      throw new BadRequestException('Source and destination paths cannot be identical.');
    }

    // Direct loop detection
    const reverse = existingRedirects.find(
      (r) => r.id !== currentId && r.isActive && this.normalizePath(r.sourcePath).toLowerCase() === normTarget
    );
    if (reverse && this.normalizePath(reverse.targetPath).toLowerCase() === normSource) {
      throw new BadRequestException(`Redirect loop detected: ${source} redirects to ${target}, but ${target} redirects back to ${source}.`);
    }
  }

  async getAllRedirects() {
    return this.prisma.redirect.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getActiveRedirects() {
    return this.prisma.redirect.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findBySource(sourcePath: string) {
    const normalized = this.normalizePath(sourcePath);
    return this.prisma.redirect.findUnique({
      where: { sourcePath: normalized },
    });
  }

  async createRedirect(data: { sourcePath: string; targetPath: string; statusCode?: number; isActive?: boolean; notes?: string }) {
    const source = this.normalizePath(data.sourcePath);
    const target = this.normalizePath(data.targetPath);

    if (!source || !target) {
      throw new BadRequestException('Source path and target path are required.');
    }

    const all = await this.prisma.redirect.findMany();
    this.validateNoLoop(source, target, all);

    const exists = await this.prisma.redirect.findUnique({ where: { sourcePath: source } });
    if (exists) {
      // Safely update existing rather than failing
      return this.prisma.redirect.update({
        where: { id: exists.id },
        data: {
          targetPath: target,
          statusCode: Number(data.statusCode) || 301,
          isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
          notes: data.notes !== undefined ? data.notes : exists.notes,
        },
      });
    }

    return this.prisma.redirect.create({
      data: {
        sourcePath: source,
        targetPath: target,
        statusCode: Number(data.statusCode) || 301,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        notes: data.notes || null,
      },
    });
  }

  async updateRedirect(id: string, data: { sourcePath?: string; targetPath?: string; statusCode?: number; isActive?: boolean; notes?: string }) {
    const exists = await this.prisma.redirect.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Redirect not found.');
    }

    const source = data.sourcePath ? this.normalizePath(data.sourcePath) : exists.sourcePath;
    const target = data.targetPath ? this.normalizePath(data.targetPath) : exists.targetPath;

    const all = await this.prisma.redirect.findMany();
    this.validateNoLoop(source, target, all, id);

    return this.prisma.redirect.update({
      where: { id },
      data: {
        sourcePath: source,
        targetPath: target,
        statusCode: data.statusCode ? Number(data.statusCode) : exists.statusCode,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : exists.isActive,
        notes: data.notes !== undefined ? data.notes : exists.notes,
      },
    });
  }

  async deleteRedirect(id: string) {
    const exists = await this.prisma.redirect.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Redirect not found.');
    }
    return this.prisma.redirect.delete({ where: { id } });
  }
}
