import { Controller, Get, Post, Put, Delete, Param, Body, Request, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  async getPosts(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.blogService.getAllPosts({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Get('posts/:slug')
  async getPost(@Param('slug') slug: string) {
    return this.blogService.getPostBySlug(slug);
  }

  @Post('posts')
  async createPost(@Request() req: any, @Body() data: any) {
    const authorId = req.user?.id;
    return this.blogService.createPost({ ...data, authorId });
  }

  @Put('posts/:id')
  async updatePost(@Param('id') id: string, @Body() data: any) {
    return this.blogService.updatePost(id, data);
  }

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

