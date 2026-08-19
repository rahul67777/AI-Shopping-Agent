import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'shopping/home',
        pathMatch: 'full'
    },
    {
        path: 'chatbot',
        loadComponent: () => import('./pages/general-chatbot/general-chatbot.component').then(m => m.GeneralChatbotComponent)
    },
    {
        path: 'shopping',
        loadComponent: () => import('./pages/shopping-container/shopping-container.component').then(m => m.ShoppingContainerComponent),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'chat',
                loadComponent: () => import('./pages/ai-chat/ai-chat.component').then(m => m.AiChatComponent)
            },
            {
                path: 'search',
                loadComponent: () => import('./pages/search/search-results.component').then(m => m.SearchResultsComponent)
            },
            {
                path: 'product/:id',
                loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent)
            },
            {
                path: 'comparison',
                loadComponent: () => import('./pages/price-comparison/price-comparison.component').then(m => m.PriceComparisonComponent)
            },
            {
                path: 'cart',
                loadComponent: () => import('./pages/smart-cart/smart-cart.component').then(m => m.SmartCartComponent)
            },
            {
                path: 'checkout',
                loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'shopping/home'
    }
];
