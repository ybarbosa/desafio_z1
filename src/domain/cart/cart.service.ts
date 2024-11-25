import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Cart, Cart_item, CartStatus, Product } from '@prisma/client';
import { upsertCart, removeCartItem } from './cart.types';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}
  async upsert(params: upsertCart ): Promise<Cart> {
    if (params.quantity < 1) {
      throw new BadRequestException('Quantity must be greater than or equal to 1');
    }

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

  async update(params: upsertCart & { cart: Cart }): Promise<Cart> {
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
        cart_id_product_id: {
          cart_id: params.cartId,
          product_id: params.productId,
        },
      },
      create: {
        quantity: params.quantity,
        product_id: params.productId,
        cart_id: params.cartId,
      },

      update: {
        quantity: params.quantity,
        updated_at: new Date(),
      },
    });
  }

  async removeCartItem(params:removeCartItem): Promise<void> {
    const cart = await this.findByUserId(params.userId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prismaService.cart_item.findFirst({
      where: {
        cart_id: cart.id,
        product_id: params.product_id
      },
      select: {
        cart_id: true,
        product_id: true
      }
    })

    if(!cartItem) {
      throw new NotFoundException('cartItem not found');
    }


    await this.prismaService.cart_item.delete({
      where: {
        cart_id_product_id: {
          product_id: cartItem.product_id,
          cart_id: cartItem.cart_id,
        },
      },
    });
  }

  async findByUserId(userId: number): Promise<Cart> {
    try {
      const cart: Cart = await this.prismaService.cart.findFirst({
        where: {
          user_id: userId,
          status: CartStatus.ACTIVE,
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
