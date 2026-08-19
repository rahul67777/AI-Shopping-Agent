import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-checkout',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
    readonly cartService = inject(CartService);
    private fb = inject(FormBuilder);
    private router = inject(Router);

    orderSuccess = signal<boolean>(false);
    orderId = signal<string>('');

    checkoutForm = this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        address: ['', [Validators.required, Validators.minLength(10)]],
        city: ['', [Validators.required]],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
        paymentMethod: ['upi', [Validators.required]]
    });

    submitOrder(): void {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        const randomId = 'ORD-AI-' + Math.floor(100000 + Math.random() * 900000);
        this.orderId.set(randomId);
        this.orderSuccess.set(true);
        this.cartService.clearCart();
    }
}
