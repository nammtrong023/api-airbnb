import { hash } from 'bcryptjs';
import { User } from '@prisma/client';
import { parseFilters } from 'utils/filters';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterType, UserPaginationType } from 'types';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExistingEmail = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (isExistingEmail) {
      throw new HttpException('This email has been used.', 400);
    }

    const hashPassword = await hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashPassword },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users;
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  async searchUsers(filters: FilterType): Promise<UserPaginationType> {
    const { itemsPerPage, page, search, skip } = parseFilters(filters);

    const users = await this.prisma.user.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [{ name: { contains: search } }, { email: { contains: search } }],
      },
    });

    return {
      data: users,
      itemsPerPage,
      currentPage: page,
      total: users.length,
    };
  }

  async searchUsername(
    filters: FilterType,
    username: string,
  ): Promise<UserPaginationType> {
    const { itemsPerPage, page, skip } = parseFilters(filters);

    const users = await this.prisma.user.findMany({
      take: itemsPerPage,
      skip,
      where: {
        OR: [{ name: { contains: username } }],
      },
    });

    return {
      data: users,
      itemsPerPage,
      currentPage: page,
      total: users.length,
    };
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.getUser(userId);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });

    return user;
  }

  async uploadUserAvatar(path: string, currentUserId: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        avatar: path,
      },
    });

    throw new HttpException('Upload avatar successfully', 201);
  }

  async remove(userId: number): Promise<void> {
    await this.getUser(userId);

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    throw new HttpException('Delete user successfully', 200);
  }
}
