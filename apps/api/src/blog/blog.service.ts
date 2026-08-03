import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BlogPost, Category, Tag } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async getAdminUser() {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      let role = await this.prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
      if (!role) {
        role = await this.prisma.role.create({
          data: { name: 'SUPER_ADMIN', description: 'Super Administrator' },
        });
      }
      user = await this.prisma.user.create({
        data: {
          email: 'admin@website.com',
          username: 'admin',
          passwordHash: '$2b$10$e8wX0vFm.uG7yK5mX6S7e.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p',
          roleId: role.id,
        },
      });
    }
    return user;
  }

  async createPost(data: any): Promise<BlogPost> {
    let authorId = data.authorId;
    if (!authorId) {
      const admin = await this.getAdminUser();
      authorId = admin.id;
    }

    const { imageUrl, featuredImage, title, slug, content, summary, status, publishedAt } = data;
    const imgUrl = imageUrl || featuredImage?.url || null;

    let featuredImageId: string | undefined = undefined;
    if (imgUrl) {
      const media = await this.prisma.media.create({
        data: {
          filename: `img-${Date.now()}`,
          originalName: 'featured-image',
          mimeType: 'image/jpeg',
          size: 0,
          url: imgUrl,
        },
      });
      featuredImageId = media.id;
    }

    const postData: Prisma.BlogPostCreateInput = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      content: content || '',
      summary: summary || '',
      status: status || 'PUBLISHED',
      publishedAt: status === 'PUBLISHED' ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
      author: { connect: { id: authorId } },
      ...(featuredImageId ? { featuredImage: { connect: { id: featuredImageId } } } : {}),
    };

    return this.prisma.blogPost.create({
      data: postData,
      include: { author: { select: { username: true } }, categories: true, tags: true, featuredImage: true },
    });
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
      orderBy: orderBy || { createdAt: 'desc' },
      include: { author: { select: { username: true } }, categories: true, tags: true, featuredImage: true },
    });
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { username: true } }, categories: true, tags: true, featuredImage: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, data: any): Promise<BlogPost> {
    const { imageUrl, featuredImage, title, slug, content, summary, status, publishedAt } = data;
    const imgUrl = imageUrl || featuredImage?.url || null;

    let featuredImageId: string | undefined = undefined;
    if (imgUrl) {
      const media = await this.prisma.media.create({
        data: {
          filename: `img-${Date.now()}`,
          originalName: 'featured-image',
          mimeType: 'image/jpeg',
          size: 0,
          url: imgUrl,
        },
      });
      featuredImageId = media.id;
    }

    const updateData: Prisma.BlogPostUpdateInput = {
      ...(title ? { title } : {}),
      ...(slug ? { slug } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(summary !== undefined ? { summary } : {}),
      ...(status ? { status } : {}),
      ...(publishedAt !== undefined ? { publishedAt: publishedAt ? new Date(publishedAt) : null } : {}),
      ...(featuredImageId ? { featuredImage: { connect: { id: featuredImageId } } } : {}),
    };

    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: { author: { select: { username: true } }, categories: true, tags: true, featuredImage: true },
    });
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

