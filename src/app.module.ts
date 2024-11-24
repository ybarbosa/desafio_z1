import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './domain/auth/auth.module';
import { ProductModule } from './domain/product/product.module';
import { OrderModule } from './domain/order/order.module';
import { CartModule } from './domain/cart/cart.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductModule,
    OrderModule,
    CartModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
      },
      defaultJobOptions: {
        attempts: 3,
      },
    }),
  ],
  controllers: [],
})
export class AppModule {}
