import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  async getPosts(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.blogService.getAllPosts({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      where: { status: 'PUBLISHED' }
    });
  }

  @Get('posts/:slug')
  async getPost(@Param('slug') slug: string) {
    return this.blogService.getPostBySlug(slug);
  }

  @Post('posts')
  async createPost(@Request() req: any, @Body() data: any) {
    let authorId = req.user?.id;
    if (!authorId) {
      const adminUser = await this.blogService.getAdminUser();
      authorId = adminUser?.id;
    }
    const postData: any = { ...data };
    if (authorId) {
      postData.author = { connect: { id: authorId } };
    }
    return this.blogService.createPost(postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('posts/:id')
  async updatePost(@Param('id') id: string, @Body() data: Prisma.BlogPostUpdateInput) {
    return this.blogService.updatePost(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    return this.blogService.deletePost(id);
  }

  @Get('categories')
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Get('tags')
  async getTags() {
    return this.blogService.getTags();
  }
}
