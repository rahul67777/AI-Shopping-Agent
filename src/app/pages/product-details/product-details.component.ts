import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ComparisonService, ComparisonSummary } from '../../services/comparison.service';
import { Product } from '../../models/product.model';
import { AiScoreBadgeComponent } from '../../components/ai-score-badge/ai-score-badge.component';
import { PriceHistoryChartComponent } from '../../components/price-history-chart/price-history-chart.component';

@Component({
    selector: 'app-product-details',
    imports: [RouterLink, AiScoreBadgeComponent, PriceHistoryChartComponent],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private productService = inject(ProductService);
    readonly cartService = inject(CartService);
    private comparisonService = inject(ComparisonService);

    product = signal<Product | undefined>(undefined);
    comparison = signal<ComparisonSummary | undefined>(undefined);
    addedSuccess = signal<boolean>(false);

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                const prod = this.productService.getProductById(id);
                if (prod) {
                    this.product.set(prod);
                    this.comparison.set(this.comparisonService.getStoreComparison(prod));
                } else {
                    this.router.navigate(['/shopping/search']);
                }
            }
        });
    }

    onAddToCart(): void {
        const p = this.product();
        if (p) {
            this.cartService.addItem(p, 1);
            this.addedSuccess.set(true);
            setTimeout(() => this.addedSuccess.set(false), 2000);
        }
    }

    buyNow(): void {
        const p = this.product();
        if (p) {
            this.cartService.addItem(p, 1);
            this.router.navigate(['/shopping/checkout']);
        }
    }

    getSpecsArray(): { key: string; value: string }[] {
        const specs = this.product()?.specs || {};
        return Object.entries(specs).map(([key, value]) => ({ key, value }));
    }
}
