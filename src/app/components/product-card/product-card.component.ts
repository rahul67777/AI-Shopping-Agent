import { Component, ChangeDetectionStrategy, input, output, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { AiScoreBadgeComponent } from '../ai-score-badge/ai-score-badge.component';

@Component({
    selector: 'app-product-card',
    imports: [RouterLink, AiScoreBadgeComponent],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
    product = input.required<Product>();
    highlightAi = input<boolean>(false);

    addToCart = output<Product>();
    compare = output<Product>();

    addedSuccess = signal<boolean>(false);

    discountPercent = computed(() => {
        const p = this.product();
        if (!p.originalPrice || p.originalPrice <= p.price) return 0;
        return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    });

    onAddToCart(): void {
        this.addToCart.emit(this.product());
        this.addedSuccess.set(true);
        setTimeout(() => this.addedSuccess.set(false), 1800);
    }

    onCompare(): void {
        this.compare.emit(this.product());
    }

    getSpecsPreview(): string[] {
        const specs = this.product().specs;
        return Object.values(specs).slice(0, 3);
    }
}
