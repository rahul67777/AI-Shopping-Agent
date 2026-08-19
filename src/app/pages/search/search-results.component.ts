import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SpeechService } from '../../services/speech.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, ProductFilters } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-results',
    imports: [ProductCardComponent, FormsModule],
    templateUrl: './search-results.component.html',
    styleUrl: './search-results.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {
    readonly productService = inject(ProductService);
    readonly cartService = inject(CartService);
    readonly speechService = inject(SpeechService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    // Local filter states
    searchQuery = signal<string>('');
    selectedCategory = signal<string>('all');
    selectedBrand = signal<string>('all');
    maxPrice = signal<number>(100000);
    minAiScore = signal<number>(0);
    sortBy = signal<'aiScore' | 'priceLowHigh' | 'priceHighLow' | 'rating'>('aiScore');

    viewMode = signal<'grid' | 'list'>('grid');

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['q']) {
                this.searchQuery.set(params['q']);
                this.applyFilters();
            }
        });
    }

    applyFilters(): void {
        const filters: ProductFilters = {
            searchQuery: this.searchQuery(),
            category: this.selectedCategory(),
            brand: this.selectedBrand(),
            maxPrice: this.maxPrice(),
            minAiScore: this.minAiScore(),
            sortBy: this.sortBy()
        };
        this.productService.setFilters(filters);
    }

    resetFilters(): void {
        this.searchQuery.set('');
        this.selectedCategory.set('all');
        this.selectedBrand.set('all');
        this.maxPrice.set(100000);
        this.minAiScore.set(0);
        this.sortBy.set('aiScore');
        this.productService.clearFilters();
    }

    onAddToCart(product: Product): void {
        this.cartService.addItem(product, 1);
    }

    onCompare(product: Product): void {
        this.router.navigate(['/shopping/comparison'], { queryParams: { prodId: product.id } });
    }

    toggleViewMode(mode: 'grid' | 'list'): void {
        this.viewMode.set(mode);
    }
}
