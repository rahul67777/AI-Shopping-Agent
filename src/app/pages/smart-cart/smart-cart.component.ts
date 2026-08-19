import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-smart-cart',
    imports: [RouterLink, FormsModule],
    templateUrl: './smart-cart.component.html',
    styleUrl: './smart-cart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartCartComponent {
    readonly cartService = inject(CartService);
    private productService = inject(ProductService);
    private router = inject(Router);

    isEditingBudget = signal<boolean>(false);
    tempBudget = signal<number>(this.cartService.targetBudget());

    updateBudget(): void {
        if (this.tempBudget() > 0) {
            this.cartService.setTargetBudget(this.tempBudget());
            this.isEditingBudget.set(false);
        }
    }

    onQuantityChange(productId: string, qty: number): void {
        this.cartService.updateQuantity(productId, qty);
    }

    onRemove(productId: string): void {
        this.cartService.removeItem(productId);
    }

    getBudgetProgressPercent(): number {
        const budget = this.cartService.targetBudget();
        if (budget <= 0) return 100;
        const pct = (this.cartService.totalPrice() / budget) * 100;
        return Math.min(100, pct);
    }

    getAbsRemainingBudget(): number {
        return Math.abs(this.cartService.remainingBudget());
    }

    optimizeCartWithAi(): void {
        const currentItems = [...this.cartService.items()];
        if (currentItems.length === 0) return;

        let total = this.cartService.totalPrice();
        const budget = this.cartService.targetBudget();

        if (total > budget) {
            const sorted = [...currentItems].sort((a, b) => (b.product.price * b.quantity) - (a.product.price * a.quantity));
            for (const item of sorted) {
                if (total > budget && item.quantity > 1) {
                    item.quantity -= 1;
                    total -= item.product.price;
                } else if (total > budget) {
                    const idx = currentItems.findIndex(i => i.product.id === item.product.id);
                    if (idx > -1) {
                        currentItems.splice(idx, 1);
                        total -= (item.product.price * item.quantity);
                    }
                }
            }
            this.cartService.items.set(currentItems);
        }
    }

    proceedToCheckout(): void {
        this.router.navigate(['/shopping/checkout']);
    }
}
