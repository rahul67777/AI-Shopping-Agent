import { Injectable, inject } from '@angular/core';
import { Product, StorePrice } from '../models/product.model';
import { ProductService } from './product.service';

export interface ComparisonSummary {
    bestDealStore: StorePrice;
    cheapestPrice: number;
    highestStorePrice: number;
    maxSavingsAmount: number;
    stores: StorePrice[];
}

@Injectable({
    providedIn: 'root'
})
export class ComparisonService {
    private productService = inject(ProductService);

    getStoreComparison(product: Product): ComparisonSummary {
        const stores = [...product.stores].sort((a, b) => a.price - b.price);
        const bestDealStore = stores[0] || {
            storeName: 'Amazon',
            price: product.price,
            inStock: true,
            isBestDeal: true
        };

        const cheapestPrice = bestDealStore.price;
        const highestStorePrice = stores.length > 0 ? stores[stores.length - 1].price : product.originalPrice;
        const maxSavingsAmount = Math.max(0, highestStorePrice - cheapestPrice);

        return {
            bestDealStore,
            cheapestPrice,
            highestStorePrice,
            maxSavingsAmount,
            stores
        };
    }

    getBestDealsAcrossProducts(): Product[] {
        return this.productService.products()
            .filter(p => p.originalPrice > p.price)
            .sort((a, b) => {
                const discountA = (a.originalPrice - a.price) / a.originalPrice;
                const discountB = (b.originalPrice - b.price) / b.originalPrice;
                return discountB - discountA;
            });
    }

    getBuyRecommendation(product: Product): { decision: 'BUY_NOW' | 'WAIT_FOR_SALE'; reason: string } {
        const isNearLowest = product.price <= product.lowestPrice * 1.03;
        if (isNearLowest) {
            return {
                decision: 'BUY_NOW',
                reason: `Price is near all-time low (₹${product.lowestPrice.toLocaleString('en-IN')}). AI predicts minimal additional discount in next 30 days.`
            };
        } else {
            return {
                decision: 'WAIT_FOR_SALE',
                reason: `Current price (₹${product.price.toLocaleString('en-IN')}) is higher than historical low (₹${product.lowestPrice.toLocaleString('en-IN')}). Expect ₹${(product.price - product.lowestPrice).toLocaleString('en-IN')} price drop during upcoming sale.`
            };
        }
    }
}
