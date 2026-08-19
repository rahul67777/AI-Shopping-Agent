import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StickyCartComponent } from '../../components/sticky-cart/sticky-cart.component';

@Component({
    selector: 'app-shopping-container',
    imports: [RouterOutlet, NavbarComponent, StickyCartComponent],
    template: `
    <app-navbar></app-navbar>
    <main class="shopping-main-content">
      <router-outlet></router-outlet>
    </main>
    <app-sticky-cart></app-sticky-cart>
  `,
    styles: [`
    .shopping-main-content {
      min-height: calc(100vh - 75px);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingContainerComponent { }
