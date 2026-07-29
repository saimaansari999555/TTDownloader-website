import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BlogPost, Category, Tag } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // --- Blog Posts ---
  async createPost(data: Prisma.BlogPostCreateInput): Promise<BlogPost> {
    return this.prisma.blogPost.create({ data });
  }

  async getAllPosts(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BlogPostWhereInput;
    orderBy?: Prisma.BlogPostOrderByWithRelationInput;
  }): Promise<BlogPost[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.blogPost.findMany({
      skip,
      take,
      where,
      orderBy,
      include: { author: { select: { username: true } }, categories: true, tags: true },
    });
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { username: true } }, categories: true, tags: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, data: Prisma.BlogPostUpdateInput): Promise<BlogPost> {
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async deletePost(id: string): Promise<BlogPost> {
    return this.prisma.blogPost.delete({ where: { id } });
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  // --- Tags ---
  async getTags(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }
}
