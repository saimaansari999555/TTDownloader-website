import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

function getDatasourceUrl() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const candidatePaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'apps', 'api', 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
      ];
      for (const srcPath of candidatePaths) {
        if (fs.existsSync(srcPath)) {
          try {
            fs.copyFileSync(srcPath, tmpDbPath);
            break;
          } catch (e) {
            console.error('Failed to copy db to /tmp:', e);
          }
        }
      }
    }
    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }
  return process.env.DATABASE_URL || 'file:./dev.db';
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: getDatasourceUrl(),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
