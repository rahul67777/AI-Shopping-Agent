import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SpeechService } from '../../services/speech.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, FormsModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
    readonly cartService = inject(CartService);
    readonly speechService = inject(SpeechService);
    private router = inject(Router);

    searchQuery = signal<string>('');
    mobileMenuOpen = signal<boolean>(false);

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update(v => !v);
    }

    onSearchSubmit(): void {
        const q = this.searchQuery().trim();
        if (q) {
            this.router.navigate(['/shopping/search'], { queryParams: { q } });
            this.searchQuery.set('');
        }
    }

    triggerVoiceSearch(): void {
        this.speechService.toggleListening();
    }
}
