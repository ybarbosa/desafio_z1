import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Cart,
  Cart_item,
  CartStatus,
  Inventory,
  Order,
  OrderStatus,
  Prisma,
  Product,
} from '@prisma/client';
import { Job, Queue } from 'bullmq';
import { PrismaService } from 'src/database/prisma/prisma.service';

type DataUpdateOrder = {
  orderId: number;
};

@Injectable()
@Processor('order')
export class OrderService extends WorkerHost {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('order') private readonly queue: Queue,
  ) {
    super();
  }

  private handlerJob = {
    update: (data: DataUpdateOrder) => this.update(data.orderId),
  };

  async create(userId: number): Promise<Order> {
    try {
      const cart = await this.prismaService.cart.findFirstOrThrow({
        where: {
          user_id: userId,
          status: CartStatus.ACTIVE,
        },
      });

      const [order]: [Order, Cart] = await this.prismaService.$transaction([
        this.prismaService.order.create({ data: {
          status: OrderStatus.PENDING,
          cart_id: cart.id,
          user_id: userId
        } }),
        this.prismaService.cart.update({
          where: { id: cart.id },
          data: { status: CartStatus.FINISHED, updated_at: new Date() },
        }),
      ]);

      const payloadEvent: DataUpdateOrder = {
        orderId: order.id,
      };

      await this.queue.add('update', payloadEvent);

      return order;
    } catch (error) {
      throw new BadRequestException('Order creation failed')
    }
  }

  async update(orderId: number) {
    try {
      const { cart } = await this.prismaService.order
        .findUniqueOrThrow({
          where: {
            id: orderId,
            status: OrderStatus.PENDING
          },
          select: {
            id: true,
            cart: {
              select: {
                cart_item: {
                  select: {
                    product_id: true,
                    quantity: true,
                  },
                },
              },
            },
          },
        })

      const cartItem: Partial<Cart_item>[] = cart.cart_item;

      await this.prismaService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          await Promise.all(
            cartItem.map((item) =>
              this.validateAndUpdateInventory(tx, item, orderId),
            ),
          );

          await tx.order.update({
            where: {
              id: orderId
            },
            data: {
              status: OrderStatus.FINISHED,
              updated_at: new Date()
            }
          })
        },
      );
    } catch(error) {
      await this.prismaService.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.ERROR,
          reason_error: error.message,
          updated_at: new Date(),
        },
      });
    }
  }

  async process(job: Job): Promise<void> {
    try {
      return await this.handlerJob[job.name](job.data);
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async validateAndUpdateInventory(
    tx: Prisma.TransactionClient,
    item: Partial<Cart_item>,
    orderId: number,
  ): Promise<void> {
    const currentDate = new Date();
    const inventory: Partial<Inventory> = await tx.inventory.findUnique({
      select: {
        quantity: true,
      },
      where: {
        product_id: item.product_id,
      },
    });

    if (item.quantity > inventory.quantity) {
      throw new Error(
        'Order cannot be processed due to insufficient inventory',
      );
    }

    const product: Product = await tx.product.findUnique({
      where: {
        id: item.product_id
      }
    })

    await tx.inventory.update({
      where: {
        product_id: item.product_id,
      },
      data: {
        quantity: inventory.quantity - item.quantity,
        updated_at: currentDate,
      },
    });

    await tx.order_Item.create({
      data: {
        order_id: orderId,
        priceUnit: product.price,
        product_id: product.id,
        quantity: item.quantity
      }
    })
  }

  async findByUserId(userId: number){
    try {
      const orders = await this.prismaService.order.findMany({
        where: {
          user_id: userId
        },
        include: {
          order_items: true
        }
      })

      return orders
    } catch {
      throw new BadRequestException('Error on find orders')
    }
  }
}
