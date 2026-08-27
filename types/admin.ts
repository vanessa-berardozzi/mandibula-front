export type AdminDashboardStats = {
  period: "7d" | "30d" | "90d" | "12m" | "all";
  from: string | null;
  revenue: number;
  paidOrders: number;
  averageBasket: number;
  orders: number;
  cancelledOrders: number;
  customers: number;
  products: number;
  lowStock: number;
  pendingOrders: number;
  readyToShip: number;
};
