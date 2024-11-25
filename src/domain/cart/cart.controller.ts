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
import {
  RequestDeleteCartItemDto,
  RequestCreateCartDto,
  ResponseCreateCartDTO,
  ResponseGetCartDTO,
} from './cart.dto';
import { CartService } from './cart.service';
import { Request } from 'express';
import { Cart } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('carts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Add item in cart',
    type: ResponseCreateCartDTO,
  })
  @ApiBody({
    description: 'Item to be added to cart',
    type: RequestCreateCartDto,
  })
  async upsert(
    @Body() body: RequestCreateCartDto,
    @Req() request: Request,
  ): Promise<Cart> {
    const payload = {
      userId: request['userId'],
      ...body,
    };
    return await this.cartService.upsert(payload);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all cart items',
    type: ResponseGetCartDTO,
  })
  @HttpCode(200)
  async find(@Req() request: Request): Promise<Cart | {}> {
    const userId = request['userId'];
    const result = await this.cartService.findByUserId(userId);
    return result || {};
  }

  @Delete()
  @ApiBody({
    description: 'Item to be removed to cart',
    type: RequestDeleteCartItemDto,
  })
  @HttpCode(204)
  async removeCartItem(
    @Body() body: RequestDeleteCartItemDto,
    @Req() request: Request,
  ): Promise<void> {
    const payload = {
      userId: request['userId'],
      ...body,
    };

    return this.cartService.removeCartItem(payload);
  }
}
