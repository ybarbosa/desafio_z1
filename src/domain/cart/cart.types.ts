export type upsertCart = {
  product_id: number;
  quantity: number;
  userId: number;
};

export type removeCartItem = {
  product_id: number;
  userId: number;
};
