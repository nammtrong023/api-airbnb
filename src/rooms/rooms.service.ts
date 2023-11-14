import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma.service';
import { Role, Room } from '@prisma/client';
import { FilterType, RoomPaginationType } from 'types';
import { parseFilters } from 'utils/filters';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(
    currentUserId: number,
    createRoomDto: CreateRoomDto,
  ): Promise<Room> {
    const hasLocation = await this.prisma.location.findFirst({
      where: {
        id: createRoomDto.location_id,
      },
    });

    if (!hasLocation) {
      throw new HttpException('Location not found', 404);
    }

    await this.prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        role: Role.HOST,
      },
    });

    const room = await this.prisma.room.create({
      data: {
        ...createRoomDto,
        owner_id: currentUserId,
      },
    });

    return room;
  }

  async getAll(): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany();

    return rooms;
  }

  async searchRooms(filters: FilterType): Promise<RoomPaginationType> {
    const { itemsPerPage, search, page, skip } = parseFilters(filters);

    const rooms = await this.prisma.room.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [
          {
            room_name: { contains: search },
            description: { contains: search },
          },
        ],
      },
    });

    return {
      data: rooms,
      itemsPerPage,
      currentPage: page,
      total: rooms.length,
    };
  }

  async getRoomByLocationId(locationId: number): Promise<Room[]> {
    const hasLocation = await this.prisma.location.findFirst({
      where: {
        id: locationId,
      },
    });

    if (!hasLocation) {
      throw new HttpException('No location found', 404);
    }

    const rooms = await this.prisma.room.findMany({
      where: {
        location_id: locationId,
      },
    });

    return rooms;
  }

  async getOne(roomId: number): Promise<Room> {
    const room = await this.prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new HttpException('No room found', 404);
    }

    return room;
  }

  async update(
    roomId: number,
    currentUserId: number,
    updateRoomDto: UpdateRoomDto,
  ) {
    const room = await this.getOne(roomId);

    if (room.owner_id !== currentUserId) {
      throw new ForbiddenException();
    }

    const updatedRoom = await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        ...updateRoomDto,
      },
    });

    return updatedRoom;
  }

  async uploadRoomImg(roomId: number, currentUserId: number, path: string) {
    const room = await this.getOne(roomId);

    if (room.owner_id !== currentUserId) {
      throw new ForbiddenException();
    }

    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        image: path,
      },
    });

    throw new HttpException('Upload room image successfully', 201);
  }

  async remove(currentUserId: number, roomId: number) {
    const room = await this.getOne(roomId);

    if (room.owner_id !== currentUserId) {
      throw new ForbiddenException();
    }

    await this.prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    throw new HttpException('Detele room successfully', 200);
  }
}
