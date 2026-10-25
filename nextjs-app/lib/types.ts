export type OrderStatus =
  | "waiting"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Product {
  id: number;
  category_id: number;
  product_name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  sku: string;
  images: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Category {
  id: number;
  category_name: string;
  description: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export type UserRole = "customer" | "admin";

export interface User {
  id: number;
  username: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  deleted_at: string | null;
}
