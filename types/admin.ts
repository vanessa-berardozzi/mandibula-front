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
