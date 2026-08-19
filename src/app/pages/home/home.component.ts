import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SpeechService } from '../../services/speech.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shopping-home',
    imports: [RouterLink, ProductCardComponent, FormsModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    readonly productService = inject(ProductService);
    readonly cartService = inject(CartService);
    readonly speechService = inject(SpeechService);
    private router = inject(Router);

    promptInput = signal<string>('');

    samplePrompts = [
        { text: 'Gaming laptop under ₹60,000', icon: '💻' },
        { text: 'Best smartphone under ₹20,000', icon: '📱' },
        { text: 'Build a coding setup under ₹80,000', icon: '⚡' },
        { text: 'Wireless ANC headphones for work', icon: '🎧' }
    ];

    onPromptSubmit(): void {
        const q = this.promptInput().trim();
        if (q) {
            this.router.navigate(['/shopping/chat'], { queryParams: { q } });
        }
    }

    useSamplePrompt(promptText: string): void {
        this.router.navigate(['/shopping/chat'], { queryParams: { q: promptText } });
    }

    onAddToCart(product: Product): void {
        this.cartService.addItem(product, 1);
    }

    onCompare(product: Product): void {
        this.router.navigate(['/shopping/comparison'], { queryParams: { prodId: product.id } });
    }

    filterByCategory(catId: string): void {
        this.productService.setFilters({ category: catId });
        this.router.navigate(['/shopping/search']);
    }
}
