import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'utils/storage-config';
import { FilterType, LocationPaginationType } from 'types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/users/dto/file-upload.dto';
import { validateFileUpload } from 'utils/validate-file-upload';

@ApiBearerAuth()
@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  getAll(): Promise<Location[]> {
    return this.locationsService.getAll();
  }

  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get('pagination')
  getLocationPagination(
    @Query() filter: FilterType,
  ): Promise<LocationPaginationType> {
    return this.locationsService.getLocationPagination(filter);
  }

  @Get(':locationId')
  getOne(
    @Param('locationId', ParseIntPipe) locationId: number,
  ): Promise<Location> {
    return this.locationsService.getOne(locationId);
  }

  @Patch(':locationId')
  update(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(locationId, updateLocationDto);
  }

  @ApiConsumes('multipart/form-data')
  @Post('upload-location-img/:locationId')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('image/locations') }),
  )
  @ApiBody({
    description: 'Location image',
    type: FileUploadDto,
  })
  uploadLocationImg(
    @Param('locationId', ParseIntPipe) locationId: number,
    @UploadedFile(validateFileUpload()) file: Express.Multer.File,
  ) {
    const path = file.destination + '/' + file.filename;

    return this.locationsService.uploadLocationImg(locationId, path);
  }

  @Delete(':locationId')
  remove(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.locationsService.remove(locationId);
  }
}
