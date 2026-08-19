import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-price-history-chart',
    templateUrl: './price-history-chart.component.html',
    styleUrl: './price-history-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceHistoryChartComponent {
    product = input.required<Product>();

    maxPriceVal = computed(() => {
        const p = this.product();
        const historyMax = Math.max(...(p.priceHistory?.map(h => h.price) || [p.price]), p.highestPrice || p.price);
        return Math.max(historyMax, p.originalPrice || p.price);
    });

    getBarHeight(price: number): number {
        const max = this.maxPriceVal();
        if (!max || max <= 0) return 50;
        const pct = Math.round((price / max) * 100);
        return Math.max(20, Math.min(100, pct));
    }
}
