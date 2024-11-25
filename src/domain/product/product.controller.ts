import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/domain/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ResponseGetProductDto } from './product.dto';

@Controller('products')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: [ResponseGetProductDto],
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all products',
  })
  findAll() {
    return this.productService.findAll();
  }
}
