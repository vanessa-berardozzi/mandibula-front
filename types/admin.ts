export type AdminDashboardPeriod = "7d" | "30d" | "90d" | "12m" | "all";

export type AdminTopProduct = {
  productId: string;
  name: string;
  quantity: number;
};

export type AdminStockAlert = {
  productId: string;
  name: string;
  currentStock: number;
  minThreshold: number;
  status: 'LOW_STOCK' | 'OUT_OF_STOCK';
};

export type AdminDashboardStats = {
  period: AdminDashboardPeriod;
  from: string | null;
  revenue: number;
  paidOrders: number;
  averageBasket: number;
  orders: number;
  ordersToday: number;
  cancelledOrders: number;
  customers: number;
  products: number;
  lowStock: number;
  pendingOrders: number;
  readyToShip: number;
  topProducts: AdminTopProduct[];
};

export type AdminOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "TO_PREPARE"
  | "PREPARING"
  | "READY"
  | "HELD_WEATHER"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type AdminPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type AdminPaymentMethod = "SUM_UP" | "PAYPAL" | "BANK_TRANSFER" | "CASH";

export type AdminOrderItem = {
  id: string;
  productName: string;
  variantName: string;
  image: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type AdminOrderListItem = {
  id: string;
  reference: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: AdminOrderStatus;
  paymentStatus: AdminPaymentStatus;
  paymentMethod: AdminPaymentMethod;
  itemCount: number;
  containsLive: boolean;
  items: AdminOrderItem[];
};

export type AdminOrderDetail = AdminOrderListItem & {
  subtotal: number;
  shippingCost: number;
  tax: number | null;
  billingAddress: string | null;
  shippingAddress: string | null;
  notes: string | null;
};

export type AdminOrdersPage = {
  orders: AdminOrderListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type AdminCustomerSortKey = "name" | "orders" | "spent";

export type AdminCustomerListItem = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  orderCount: number;
  cancelledCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  orders: AdminOrderListItem[];
};

export type AdminCustomersPage = {
  customers: AdminCustomerListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type AdminProductVariant = {
  id: string;
  name: string;
  price: number;
  lotSize: number;
  isActive: boolean;
  totalStock?: number | null;
  reservedStock?: number | null;
  availableStock?: number;
  minThreshold?: number;
  stockStatus?: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  totalStock: number;
  stockMode?: 'SHARED_POOL' | 'PER_VARIANT';
  vatCategory?: 'STANDARD_GOODS' | 'LIVE_ANIMALS';
  variantCount: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
  minThreshold: number;
  isPublished: boolean;
};

export type AdminProductDetail = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  totalStock: number;
  reservedStock: number;
  stockMode?: 'SHARED_POOL' | 'PER_VARIANT';
  vatCategory?: 'STANDARD_GOODS' | 'LIVE_ANIMALS';
  category: {
    id: string;
    name: string;
  };
  variants: AdminProductVariant[];
  stockInfo: {
    minThreshold: number;
    status: string;
  } | null;
  promotionType?: "NONE" | "PERCENTAGE" | "FIXED_AMOUNT";
  promotionValue?: number | null;
  featured?: boolean;
  shippingWeight: number | null;
  isPublished: boolean;
};

export type AdminProductsPage = {
  products: AdminProduct[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};
