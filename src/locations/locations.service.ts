import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/prisma.service';
import { Location } from '@prisma/client';
import { FilterType, LocationPaginationType } from 'types';
import { parseFilters } from 'utils/filters';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = await this.prisma.location.create({
      data: createLocationDto,
    });

    return location;
  }

  async getAll(): Promise<Location[]> {
    const locations = await this.prisma.location.findMany();

    if (!locations) {
      throw new HttpException('Location not found', 404);
    }

    return locations;
  }

  async getLocationPagination(
    filters: FilterType,
  ): Promise<LocationPaginationType> {
    const { itemsPerPage, page, search, skip } = parseFilters(filters);

    const location = await this.prisma.location.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          { location_name: { contains: search } },
          { country: { contains: search } },
          { province: { contains: search } },
        ],
      },
    });

    return {
      data: location,
      itemsPerPage,
      currentPage: page,
      total: location.length,
    };
  }

  async getOne(locationId: number): Promise<Location> {
    const location = await this.prisma.location.findFirst({
      where: {
        id: locationId,
      },
    });

    if (!location) {
      throw new HttpException('No location found', 404);
    }

    return location;
  }

  async update(
    locationId: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    await this.getOne(locationId);

    const updatedLocation = await this.prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        ...updateLocationDto,
      },
    });

    return updatedLocation;
  }

  async uploadLocationImg(locationId: number, path: string) {
    await this.getOne(locationId);

    await this.prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        image: path,
      },
    });

    throw new HttpException('Upload location image successfully', 201);
  }

  async remove(locationId: number): Promise<void> {
    await this.getOne(locationId);

    await this.prisma.location.delete({
      where: {
        id: locationId,
      },
    });

    throw new HttpException('Detele location successfully', 200);
  }
}
