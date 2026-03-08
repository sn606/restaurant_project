export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryId: number;
  spiciness?: number;
  nuts?: boolean;
  vegeterian?: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface BasketItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface ProductFilters {
  categoryId: string | number;
  spiciness: number | null;
  nuts: boolean | null;
  vegeterian: boolean | null;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}