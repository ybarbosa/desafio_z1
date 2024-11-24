import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { AuthGuard } from 'src/domain/auth/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  create(@Req() request: Request) {
    const userId = request['userId'];
    return this.orderService.create(userId);
  }

  @Get()
  @HttpCode(200)
  findAll(@Req() request: Request){
    const userId = request['userId'];
    return this.orderService.findByUserId(userId);
  }
}
