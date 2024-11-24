import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/domain/auth/auth.guard';
import { RemoveCartItemDto, UpsertCartDto } from './cart.dto';
import { CartService } from './cart.service';
import { Request } from 'express';
import { Cart } from '@prisma/client';

@Controller('carts')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(201)
  async upsert(@Body() body: UpsertCartDto, @Req() request: Request): Promise<Cart> {
    const payload = {
      userId: request['userId'],
      ...body,
    };
    return await this.cartService.upsert(payload);
  }

  @Get()
  @HttpCode(200)
  async find(@Req() request: Request): Promise<Cart | {}> {
    const userId = request['userId'];
    const result = await this.cartService.findByUserId(userId) 
    return result || {};
  }

  @Delete()
  @HttpCode(204)
  async removeCartItem(@Body() body: RemoveCartItemDto, @Req() request: Request): Promise<void> {
    const payload = {
      userId: request['userId'],
      ...body,
    };

    return this.cartService.removeCartItem(payload);
  }
}
