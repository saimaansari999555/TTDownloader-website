import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // Public endpoint: List all published page links
  @Get('public')
  async findAllPublished() {
    return this.pagesService.findAllPublished();
  }

  // Public endpoint: Find page by slug
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);
    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }
    return page;
  }

  // Admin endpoint: List all pages (including drafts)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.pagesService.findAll();
  }

  // Admin endpoint: Find page by ID
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findOne(id);
    if (!page) {
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    }
    return page;
  }

  // Admin endpoint: Create custom page
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body()
    body: {
      title: string;
      slug: string;
      layout: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      featuredImage?: string;
      isPublished?: boolean;
    },
  ) {
    return this.pagesService.create(body);
  }

  // Admin endpoint: Update custom page
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      slug?: string;
      layout?: string;
      seoTitle?: string;
      seoDescription?: string;
      seoKeywords?: string;
      featuredImage?: string;
      isPublished?: boolean;
    },
  ) {
    return this.pagesService.update(id, body);
  }

  // Admin endpoint: Delete custom page
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }
}
