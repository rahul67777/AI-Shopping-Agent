import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-sticky-cart',
    imports: [RouterLink],
    templateUrl: './sticky-cart.component.html',
    styleUrl: './sticky-cart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyCartComponent {
    readonly cartService = inject(CartService);
    expanded = signal<boolean>(false);

    toggleDrawer(): void {
        this.expanded.update(v => !v);
    }
}
