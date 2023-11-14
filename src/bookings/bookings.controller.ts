import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id';

@ApiBearerAuth()
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(
    @GetCurrentUserId() currentUserId: number,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.create(currentUserId, createBookingDto);
  }

  @Get()
  getAll(): Promise<Booking[]> {
    return this.bookingsService.getAll();
  }

  @Get('get-by-user-id/:userId')
  getBookingsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Booking[]> {
    return this.bookingsService.getBookingsByUserId(userId);
  }

  @Get(':bookingId')
  getOne(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<Booking> {
    return this.bookingsService.getOne(bookingId);
  }

  @Patch(':bookingId')
  update(
    @GetCurrentUserId() currentUserId: number,
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.update(
      bookingId,
      currentUserId,
      updateBookingDto,
    );
  }

  @Delete(':bookingId')
  remove(
    @GetCurrentUserId() currentUserId: number,
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ) {
    return this.bookingsService.remove(currentUserId, bookingId);
  }
}
