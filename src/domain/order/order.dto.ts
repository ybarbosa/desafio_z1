import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
enum orderStatus {
  ERROR,
  FINISHED,
  PENDING,
}

class OrderDTO {
  @IsNumber()
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: ['PENDING', 'FINISHED', 'ERROR'],
  })
  @IsString()
  status: orderStatus;

  @ApiProperty()
  @IsNumber()
  cart_id: number;

  @ApiProperty()
  @IsNumber()
  user_id: number;

  @ApiProperty()
  @IsString()
  reason_error: string;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;
}

class OrderItems {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  order_id: number;

  @ApiProperty()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  priceUnit: number;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;
}

export class ResponseCreateOrderDTO extends PartialType(OrderDTO) {}

export class ResponseGetOrderDTO extends PartialType(OrderDTO) {
  @ApiProperty()
  @IsObject()
  order_items: OrderItems;
}
