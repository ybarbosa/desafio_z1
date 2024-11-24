import { IsNumber } from 'class-validator';

export class UpsertCartDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  quantity: number;
}

export class RemoveCartItemDto {
  @IsNumber()
  product_id: number;
}
