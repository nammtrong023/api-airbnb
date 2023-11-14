import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilterType, RoomPaginationType } from 'types';
import { Room } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'utils/storage-config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/users/dto/file-upload.dto';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { validateFileUpload } from 'utils/validate-file-upload';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Roles(['HOST', 'GUEST'])
  @Post()
  create(
    @GetCurrentUserId() currentUserId: number,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    return this.roomsService.create(currentUserId, createRoomDto);
  }

  @Roles(['HOST', 'GUEST'])
  @Get()
  getAll(): Promise<Room[]> {
    return this.roomsService.getAll();
  }

  @Roles(['HOST', 'GUEST'])
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get('search-rooms')
  searchRooms(@Query() filters: FilterType): Promise<RoomPaginationType> {
    return this.roomsService.searchRooms(filters);
  }

  @Roles(['HOST', 'GUEST'])
  @Get('by-location-id/:locationId')
  getRoomByLocationId(
    @Param('locationId', ParseIntPipe) locationId: number,
  ): Promise<Room[]> {
    return this.roomsService.getRoomByLocationId(locationId);
  }

  @Roles(['HOST', 'GUEST'])
  @Get(':roomId')
  getOne(@Param('roomId', ParseIntPipe) roomId: number): Promise<Room> {
    return this.roomsService.getOne(roomId);
  }

  @Roles(['HOST'])
  @ApiConsumes('multipart/form-data')
  @Post('upload-room-img/:roomId')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('image/rooms') }),
  )
  @ApiBody({
    description: 'Room image',
    type: FileUploadDto,
  })
  uploadUserAvatar(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetCurrentUserId() currentUserId: number,
    @UploadedFile(validateFileUpload())
    file: Express.Multer.File,
  ) {
    const path = file.destination + '/' + file.filename;

    return this.roomsService.uploadRoomImg(roomId, currentUserId, path);
  }

  @Roles(['HOST'])
  @Patch(':roomId')
  update(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetCurrentUserId() currentUserId: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    return this.roomsService.update(currentUserId, roomId, updateRoomDto);
  }

  @Roles(['HOST'])
  @Delete(':roomId')
  remove(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetCurrentUserId() currentUserId: number,
  ) {
    return this.roomsService.remove(currentUserId, roomId);
  }
}
