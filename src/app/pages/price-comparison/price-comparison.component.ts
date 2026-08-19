import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ComparisonService } from '../../services/comparison.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-price-comparison-page',
    imports: [],
    templateUrl: './price-comparison.component.html',
    styleUrl: './price-comparison.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceComparisonComponent implements OnInit {
    private productService = inject(ProductService);
    private comparisonService = inject(ComparisonService);
    readonly cartService = inject(CartService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    selectedProduct = signal<Product | undefined>(undefined);
    allProducts = signal<Product[]>([]);

    ngOnInit(): void {
        const list = this.productService.products();
        this.allProducts.set(list);

        this.route.queryParams.subscribe(params => {
            if (params['prodId']) {
                const p = this.productService.getProductById(params['prodId']);
                if (p) this.selectedProduct.set(p);
            } else if (list.length > 0) {
                this.selectedProduct.set(list[0]);
            }
        });
    }

    selectProduct(prod: Product): void {
        this.selectedProduct.set(prod);
    }

    getComparisonSummary() {
        const p = this.selectedProduct();
        if (!p) return null;
        return this.comparisonService.getStoreComparison(p);
    }

    onAddToCart(p?: Product): void {
        const target = p || this.selectedProduct();
        if (target) {
            this.cartService.addItem(target, 1);
            this.router.navigate(['/shopping/cart']);
        }
    }
}
