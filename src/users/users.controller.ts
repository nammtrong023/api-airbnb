import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { FilterType, UserPaginationType } from 'types';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'utils/storage-config';
import { FileUploadDto } from './dto/file-upload.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id';
import { validateFileUpload } from 'utils/validate-file-upload';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchUsers(@Query() filter: FilterType): Promise<UserPaginationType> {
    return this.userService.searchUsers(filter);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUser(userId);
  }

  @Get('search-username/:username')
  @HttpCode(HttpStatus.OK)
  searchUsername(
    @Query() filters: FilterType,
    @Param('username') username: string,
  ): Promise<UserPaginationType> {
    return this.userService.searchUsername(filters, username);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiConsumes('multipart/form-data')
  @Post('upload-avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('image/avatar') }),
  )
  @ApiBody({
    description: 'User avatar',
    type: FileUploadDto,
  })
  uploadUserAvatar(
    @GetCurrentUserId() currentUserId: number,
    @UploadedFile(validateFileUpload())
    file: Express.Multer.File,
  ) {
    const path = file.destination + '/' + file.filename;

    return this.userService.uploadUserAvatar(path, currentUserId);
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.remove(userId);
  }
}
