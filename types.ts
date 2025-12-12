export interface ProductVariant {
  finish: string;
  sizes: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string; // Main thumbnail (legacy or primary)
  images?: string[]; // New: Multiple images support
  variants: ProductVariant[]; // New structure for Finish -> Sizes
  sizes: string[]; // Fallback for legacy items or items without specific finishes
  stock: number;
  isAvailable: boolean;
  isNewArrival: boolean;
}

export interface CartItem extends Product {
  selectedSize: string;
  selectedFinish: string;
  quantity: number;
}

export interface FilterState {
  category: string;
  search: string;
}

export const CATEGORIES = [
  "All",
  "Nails",
  "Kitchen Handles",
  "Hinges",
  "Locks",
  "Adhesives/Gum",
  "Wardrobe Accessories",
  "Tandem Boxes",
  "General Hardware"
];