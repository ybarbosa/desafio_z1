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
import { RemoveCartItemDto, UpsertCartDto } from './index.dto';
import { CartService } from './cart.service';
import { Request } from 'express';

@Controller('carts')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @HttpCode(201)
  upsert(@Body() body: UpsertCartDto, @Req() request: Request) {
    const payload = {
      userId: request['userId'],
      ...body,
    };
    return this.cartService.upsert(payload);
  }

  @Get()
  @HttpCode(200)
  find(@Req() request: Request) {
    const userId = request['userId'];
    return this.cartService.findByUserId(userId);
  }

  @Delete()
  @HttpCode(204)
  removeCartItem(@Body() body: RemoveCartItemDto, @Req() request: Request) {
    const payload = {
      userId: request['userId'],
      ...body,
    };

    return this.cartService.removeCartItem(payload);
  }
}
