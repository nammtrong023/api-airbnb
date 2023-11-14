import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma.service';
import { Booking } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(
    currentUserId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const hasRoom = await this.prisma.room.findFirst({
      where: {
        id: createBookingDto.room_id,
      },
    });

    if (!hasRoom) {
      throw new HttpException('Room not found', 404);
    }

    const booking = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        user_id: currentUserId,
      },
    });

    return booking;
  }

  async getAll(): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany();

    return bookings;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    const hasUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!hasUser) {
      throw new HttpException('No user found', 404);
    }

    const bookings = await this.prisma.booking.findMany({
      where: {
        user_id: userId,
      },
    });

    return bookings;
  }

  async getOne(bookingId: number): Promise<Booking> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      throw new HttpException('No booking found', 404);
    }

    return booking;
  }

  async update(
    bookingId: number,
    currentUserId: number,
    updateBookingDto: UpdateBookingDto,
  ) {
    const booking = await this.getOne(bookingId);

    if (booking.user_id !== currentUserId) {
      throw new ForbiddenException();
    }

    const updatedBooking = await this.prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        ...updateBookingDto,
      },
    });

    return updatedBooking;
  }

  async remove(currentUserId: number, bookingId: number) {
    const booking = await this.getOne(bookingId);

    if (booking.user_id !== currentUserId) {
      throw new ForbiddenException();
    }

    await this.prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    throw new HttpException('Delete booking successfully', 200);
  }
}
