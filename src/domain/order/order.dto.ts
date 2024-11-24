import { IsNumber } from 'class-validator';

export class createOrderDto {
  @IsNumber()
  cart_id: number;
}
