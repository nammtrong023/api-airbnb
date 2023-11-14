import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';
import { CommentPaginationType, FilterType } from 'types';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id';

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetCurrentUserId() currentUserId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.create(currentUserId, createCommentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Comment[]> {
    return this.commentsService.getAll();
  }

  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get('by-room-id/:roomId')
  getCommentsByRoomId(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query() filters: FilterType,
  ): Promise<CommentPaginationType> {
    return this.commentsService.getCommentsByRoomId(roomId, filters);
  }

  @Get(':commentId')
  getOne(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment> {
    return this.commentsService.getOne(commentId);
  }

  @Patch(':commentId')
  @HttpCode(HttpStatus.OK)
  update(
    @GetCurrentUserId() currentUserId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      commentId,
      currentUserId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.OK)
  remove(
    @GetCurrentUserId() currentUserId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.remove(commentId, currentUserId);
  }
}
