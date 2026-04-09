export interface CartItem {
  id?: string;
  productId: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  subtotal: number;
  itemCount: number;
}

export interface CartValidationResponse {
  valid: boolean;
  items: CartItemValidated[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  errors?: string[];
}

export interface CartItemValidated {
  productId: string;
  quantity: number;
  price: number;
  total: number;
  available: boolean;
}
