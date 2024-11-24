import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RemoveCartItemDto, UpsertCartDto } from './index.dto';
import { Cart, Cart_item, CartStatus, Product } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}
  async upsert(params: UpsertCartDto & { userId: number }): Promise<Cart> {
    const product: Product = await this.prismaService.product.findUnique({
      where: {
        id: params.product_id,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.findByUserId(params.userId);
    if (!cart) {
      return await this.create({
        productId: params.product_id,
        quantity: params.quantity,
        userId: params.userId,
      });
    }

    return await this.update({ ...params, cart });
  }

  async update(params: UpsertCartDto & { cart: Cart }): Promise<Cart> {
    try {
      await this.upsertCartItem({
        cartId: params.cart.id,
        productId: params.product_id,
        quantity: params.quantity,
      });

      return await this.prismaService.cart.update({
        where: {
          id: params.cart.id,
        },
        data: {
          updated_at: new Date(),
        },
      });
    } catch (error) {
      throw new BadRequestException('Erro on cart update');
    }
  }

  async upsertCartItem(params: {
    cartId: number;
    productId: number;
    quantity: number;
  }): Promise<Cart_item> {
    return this.prismaService.cart_item.upsert({
      where: {
        card_id_product_id: {
          card_id: params.cartId,
          product_id: params.productId,
        },
      },
      create: {
        quantity: params.quantity,
        product_id: params.productId,
        card_id: params.cartId,
      },

      update: {
        quantity: params.quantity,
        updated_at: new Date(),
      },
    });
  }

  async remove(params: RemoveCartItemDto & { userId: number }): Promise<void> {
    const cart = await this.findByUserId(params.userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prismaService.cart_item.delete({
      where: {
        card_id_product_id: {
          product_id: params.product_id,
          card_id: cart.id,
        },
      },
    });
  }

  async find(userId: number): Promise<Cart & { quantityItems: number }> {
    const cart = await this.findByUserId(userId);

    if (!cart) {
      throw new NotFoundException('cart not found');
    }

    const {
      _sum: { quantity: sumQuantityItem },
    } = await this.prismaService.cart_item.aggregate({
      where: {
        card_id: cart.id,
      },
      _sum: {
        quantity: true,
      },
    });

    return {
      ...cart,
      quantityItems: sumQuantityItem,
    };
  }
  async findByUserId(userId: number): Promise<Cart> {
    try {
      const cart: Cart = await this.prismaService.cart.findFirst({
        where: {
          user_id: userId,
          status: 'ACTIVE',
        },
        include: {
          cart_item: true,
        },
      });
      return cart;
    } catch {
      throw new BadRequestException('Error on find cart');
    }
  }

  async create(params: {
    productId: number;
    quantity: number;
    userId: number;
  }): Promise<Cart> {
    if (params.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }
    try {
      return await this.prismaService.cart.create({
        data: {
          status: CartStatus.ACTIVE,
          user_id: params.userId,
          cart_item: {
            create: {
              quantity: params.quantity,
              product_id: params.productId,
            },
          },
        },
      });
    } catch {
      throw new BadRequestException('Erro on cart create');
    }
  }
}
