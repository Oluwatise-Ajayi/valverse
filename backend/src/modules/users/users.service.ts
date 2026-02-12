import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma-local/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { profile: true, progress: true },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { profile: true, progress: true },
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
            include: { profile: true, progress: true },
        });
    }
}
