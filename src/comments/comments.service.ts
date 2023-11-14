import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';
import { Comment } from '@prisma/client';
import { CommentPaginationType, FilterType } from 'types';
import { parseFilters } from 'utils/filters';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const hasRoom = await this.prisma.room.findFirst({
      where: {
        id: createCommentDto.room_id,
      },
    });

    if (!hasRoom) {
      throw new HttpException('No room found', 404);
    }

    const comment = this.prisma.comment.create({
      data: {
        ...createCommentDto,
        user_id: currentUserId,
      },
    });

    return comment;
  }

  async getAll(): Promise<Comment[]> {
    const comments = this.prisma.comment.findMany();

    return comments;
  }

  async getCommentsByRoomId(
    roomId: number,
    filters: FilterType,
  ): Promise<CommentPaginationType> {
    const { itemsPerPage, page, skip } = parseFilters(filters);

    const hasRoom = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });

    if (!hasRoom) {
      throw new HttpException('No room found', 404);
    }

    const comments = await this.prisma.comment.findMany({
      take: itemsPerPage,
      skip,
      where: {
        room_id: roomId,
      },
    });

    return {
      data: comments,
      itemsPerPage,
      currentPage: page,
      total: comments.length,
    };
  }

  async getOne(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new HttpException('No comment found', 404);
    }

    return comment;
  }

  async update(
    commentId: number,
    currentUserId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.getOne(commentId);

    if (comment.user_id !== currentUserId) {
      throw new ForbiddenException();
    }

    const updatedComment = await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        ...updateCommentDto,
        user_id: currentUserId,
      },
    });

    return updatedComment;
  }

  async remove(commentId: number, currentUserId: number) {
    const comment = await this.getOne(commentId);

    if (comment.user_id !== currentUserId) {
      throw new ForbiddenException();
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    throw new HttpException('Detele comment successfully', 200);
  }
}
