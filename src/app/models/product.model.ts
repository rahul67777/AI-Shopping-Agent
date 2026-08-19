export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface StorePrice {
  storeName: 'Amazon' | 'Flipkart' | 'Croma' | 'Reliance Digital' | 'Vijay Sales' | string;
  price: number;
  inStock: boolean;
  dealTag?: string;
  url?: string;
  isBestDeal: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'laptop' | 'smartphone' | 'monitors' | 'audio' | 'accessories' | 'peripherals';
  brand: string;
  price: number; // Current price in ₹ (INR)
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  aiScore: number; // 0 - 100
  aiScoreReason: string;
  badges: string[]; // e.g. ["Top Pick", "Best Value", "Gaming Special"]
  isRecommended: boolean;
  priceHistory: PriceHistoryPoint[];
  lowestPrice: number;
  highestPrice: number;
  aiRecommendation: 'BUY_NOW' | 'WAIT_FOR_SALE';
  stores: StorePrice[];
}

export interface ProductFilters {
  searchQuery?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  minRating?: number;
  minAiScore?: number;
  sortBy?: 'aiScore' | 'priceLowHigh' | 'priceHighLow' | 'rating';
}

export interface AiShoppingQuery {
  rawQuery: string;
  category?: string;
  budget?: number;
  brand?: string;
  useCase?: string;
  requiredSpecs?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedByAi?: boolean;
}

export interface SmartCartBundle {
  title: string;
  totalBudget: number;
  totalPrice: number;
  estimatedSavings: number;
  remainingBudget: number;
  items: CartItem[];
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  extractedIntent?: AiShoppingQuery;
  recommendedProducts?: Product[];
  smartCartBundle?: SmartCartBundle;
  isLoading?: boolean;
}
