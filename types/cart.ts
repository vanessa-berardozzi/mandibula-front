export interface CartItem {
  id?: string;
  variantId: string;
  variant?: {
    id: string;
    name: string;
    price: number;
    lotSize: number;
    stock: number;
    product: {
      id: string;
      name: string;
      image?: string;
    };
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
  discount: number;
  total: number;
  promoCode?: string;
  errors?: string[];
}

export interface PromoValidationResponse {
  valid: boolean;
  code?: string;
  description?: string;
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  error?: string;
}

export interface CartItemValidated {
  variantId: string;
  quantity: number;
  price: number;
  total: number;
  available: boolean;
}
