import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/domain/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
   try {
    const product = await this.prismaService.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        picture: true,
        updated_at: true,
        created_at: true,
        inventory: {
          select: {
            quantity: true,
          },
        },
      },
    });

    return product;
   } catch {
      throw new BadRequestException('Error on find products')
   }
  }
}
