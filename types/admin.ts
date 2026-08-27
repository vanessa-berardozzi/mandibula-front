export type AdminDashboardPeriod = "7d" | "30d" | "90d" | "12m" | "all";

export type AdminTopProduct = {
  productId: string;
  name: string;
  quantity: number;
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
  | "PREPARING"
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
