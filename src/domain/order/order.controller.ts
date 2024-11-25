import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Request } from 'express';
import { AuthGuard } from 'src/domain/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ResponseCreateOrderDTO, ResponseGetOrderDTO } from './order.dto';

@Controller('orders')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create order',
    type: ResponseCreateOrderDTO
  })
  create(@Req() request: Request) {
    const userId = request['userId'];
    return this.orderService.create(userId);
  }

  @Get()
  @ApiResponse({
    status: 201,
    description: 'Returns all order',
    type: [ResponseGetOrderDTO]
  })
  @HttpCode(200)
  findAll(@Req() request: Request){
    const userId = request['userId'];
    return this.orderService.findByUserId(userId);
  }
}
