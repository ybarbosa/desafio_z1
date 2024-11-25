import { IsArray, IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty, PartialType } from "@nestjs/swagger";

enum cartStatus {
  ACTIVE,
  FINISHED
}

class CartDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: ['ACTIVE', 'FINISHED']
  })
  @IsString()
  status: cartStatus

  @ApiProperty()
  @IsNumber()
  user_id: number

  @ApiProperty()
  @IsDate()
  created_at: Date

  @ApiProperty()
  @IsDate()
  updated_at: Date
}

class CartItem {
  @ApiProperty()
  @IsNumber()
  cart_id: number

  @ApiProperty()
  @IsNumber()
  product_id: number

  @ApiProperty()
  @IsNumber()
  quantity: number

   @ApiProperty()
  @IsDate()
  created_at: Date

  @ApiProperty()
  @IsDate()
  updated_at: Date
}

export class ResponseCreateCartDTO extends PartialType(CartDto){}

export class ResponseGetCartDTO extends PartialType(CartDto){
  @ApiProperty({ type: [CartItem]})
  cart_item: CartItem[]
}

export class RequestCreateCartDto {
  @IsNumber()
  @ApiProperty()
  product_id: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;
}
export class RequestDeleteCartItemDto {
  @IsNumber()
  @ApiProperty()
  product_id: number;
}
