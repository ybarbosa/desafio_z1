import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.registerQueue({ name: 'order' })],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
