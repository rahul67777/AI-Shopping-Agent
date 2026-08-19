import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem, SmartCartBundle } from '../models/product.model';

const STORAGE_KEY = 'ai_shopping_cart_v1';
const BUDGET_KEY = 'ai_shopping_target_budget_v1';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    readonly items = signal<CartItem[]>(this.loadCartFromStorage());
    readonly targetBudget = signal<number>(this.loadBudgetFromStorage());

    // Computed signals
    readonly itemCount = computed(() => {
        return this.items().reduce((total, item) => total + item.quantity, 0);
    });

    readonly totalPrice = computed(() => {
        return this.items().reduce((total, item) => total + (item.product.price * item.quantity), 0);
    });

    readonly originalTotalPrice = computed(() => {
        return this.items().reduce((total, item) => total + ((item.product.originalPrice || item.product.price) * item.quantity), 0);
    });

    readonly estimatedSavings = computed(() => {
        const savings = this.originalTotalPrice() - this.totalPrice();
        return Math.max(0, savings);
    });

    readonly remainingBudget = computed(() => {
        if (this.targetBudget() <= 0) return 0;
        return this.targetBudget() - this.totalPrice();
    });

    readonly isOverBudget = computed(() => {
        return this.targetBudget() > 0 && this.totalPrice() > this.targetBudget();
    });

    constructor() {
        // Persist changes
    }

    addItem(product: Product, quantity = 1, addedByAi = false): void {
        this.items.update(currentItems => {
            const existingIndex = currentItems.findIndex(i => i.product.id === product.id);
            if (existingIndex > -1) {
                const updated = [...currentItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }
            return [...currentItems, { product, quantity, addedByAi }];
        });
        this.saveToStorage();
    }

    removeItem(productId: string): void {
        this.items.update(current => current.filter(i => i.product.id !== productId));
        this.saveToStorage();
    }

    updateQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        this.items.update(current =>
            current.map(item => item.product.id === productId ? { ...item, quantity } : item)
        );
        this.saveToStorage();
    }

    clearCart(): void {
        this.items.set([]);
        this.saveToStorage();
    }

    applyAiBundle(bundle: SmartCartBundle): void {
        this.targetBudget.set(bundle.totalBudget);
        this.items.set(bundle.items);
        this.saveToStorage();
    }

    setTargetBudget(budget: number): void {
        this.targetBudget.set(budget);
        try {
            localStorage.setItem(BUDGET_KEY, budget.toString());
        } catch {
            // Storage unavailable fallback
        }
    }

    private saveToStorage(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
            localStorage.setItem(BUDGET_KEY, this.targetBudget().toString());
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    }

    private loadCartFromStorage(): CartItem[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private loadBudgetFromStorage(): number {
        try {
            const data = localStorage.getItem(BUDGET_KEY);
            return data ? Number(data) : 80000;
        } catch {
            return 80000;
        }
    }
}
