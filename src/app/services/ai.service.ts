import { Injectable, inject } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';
import { ProductService } from './product.service';
import { Product, AiShoppingQuery, SmartCartBundle, CartItem } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private productService = inject(ProductService);

    private ai = new GoogleGenAI({
        apiKey: environment.geminiApiKey
    });

    /**
     * Extract intent parameters from raw user prompt (Category, Budget, Brand, Use Case, Specs)
     */
    async extractIntent(userQuery: string): Promise<AiShoppingQuery> {
        const queryLower = userQuery.toLowerCase();

        // Local heuristic parsing for fast instant response
        let budget: number | undefined;
        const budgetMatch = queryLower.match(/(?:under|below|within|budget of|around|less than|for|₹|rs\.?)\s*(\d+[\d,]*)\s*(k|thousand|lakh)?/i);

        if (budgetMatch) {
            let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
            const unit = budgetMatch[2]?.toLowerCase();
            if (unit === 'k' || unit === 'thousand') {
                num = num * 1000;
            } else if (unit === 'lakh') {
                num = num * 100000;
            } else if (num < 500) { // e.g. 60k entered as 60
                num = num * 1000;
            }
            budget = num;
        }

        let category: string | undefined;
        if (queryLower.includes('laptop') || queryLower.includes('macbook') || queryLower.includes('notebook')) {
            category = 'laptop';
        } else if (queryLower.includes('phone') || queryLower.includes('mobile') || queryLower.includes('smartphone')) {
            category = 'smartphone';
        } else if (queryLower.includes('monitor') || queryLower.includes('screen') || queryLower.includes('display')) {
            category = 'monitors';
        } else if (queryLower.includes('headphone') || queryLower.includes('earbud') || queryLower.includes('tws') || queryLower.includes('audio')) {
            category = 'audio';
        } else if (queryLower.includes('keyboard') || queryLower.includes('mouse') || queryLower.includes('setup')) {
            category = 'peripherals';
        }

        let brand: string | undefined;
        const knownBrands = ['asus', 'lenovo', 'apple', 'iqoo', 'oneplus', 'samsung', 'lg', 'logitech', 'keychron', 'sony'];
        for (const b of knownBrands) {
            if (queryLower.includes(b)) {
                brand = b.charAt(0).toUpperCase() + b.slice(1);
                break;
            }
        }

        let useCase: string | undefined;
        if (queryLower.includes('gaming') || queryLower.includes('game') || queryLower.includes('fps')) {
            useCase = 'Gaming & High Performance';
        } else if (queryLower.includes('coding') || queryLower.includes('programming') || queryLower.includes('developer') || queryLower.includes('work')) {
            useCase = 'Software Development & Productivity';
        } else if (queryLower.includes('camera') || queryLower.includes('photo') || queryLower.includes('vlog')) {
            useCase = 'Photography & Content Creation';
        } else if (queryLower.includes('setup') || queryLower.includes('desk')) {
            useCase = 'Complete Workstation Bundle';
        }

        return {
            rawQuery: userQuery,
            category,
            budget,
            brand,
            useCase,
            requiredSpecs: this.extractSpecs(queryLower)
        };
    }

    private extractSpecs(queryLower: string): string[] {
        const specs: string[] = [];
        if (queryLower.includes('rtx') || queryLower.includes('gpu') || queryLower.includes('graphics')) specs.push('Dedicated GPU');
        if (queryLower.includes('16gb') || queryLower.includes('ram')) specs.push('High RAM (16GB+)');
        if (queryLower.includes('144hz') || queryLower.includes('120hz') || queryLower.includes('high refresh')) specs.push('High Refresh Display');
        if (queryLower.includes('anc') || queryLower.includes('noise cancel')) specs.push('Active Noise Cancellation');
        if (queryLower.includes('oled') || queryLower.includes('amoled') || queryLower.includes('ips')) specs.push('OLED/IPS Screen');
        if (queryLower.includes('5g')) specs.push('5G Connectivity');
        if (queryLower.includes('wireless') || queryLower.includes('bluetooth')) specs.push('Wireless Connectivity');
        return specs;
    }

    /**
     * Rank products based on user intent
     */
    rankProducts(products: Product[], intent: AiShoppingQuery): Product[] {
        return products.map(prod => {
            let score = prod.aiScore;

            // Category match
            if (intent.category && prod.category === intent.category) {
                score += 10;
            }

            // Budget fit
            if (intent.budget) {
                if (prod.price <= intent.budget) {
                    score += 15;
                    // Reward coming close to budget without exceeding
                    const ratio = prod.price / intent.budget;
                    if (ratio >= 0.7 && ratio <= 0.98) {
                        score += 10;
                    }
                } else {
                    score -= 25; // Penalty for over-budget
                }
            }

            // Brand match
            if (intent.brand && prod.brand.toLowerCase() === intent.brand.toLowerCase()) {
                score += 15;
            }

            // Rating boost
            score += Math.round(prod.rating * 2);

            const finalScore = Math.max(10, Math.min(99, score));
            return {
                ...prod,
                aiScore: finalScore,
                aiScoreReason: `Rated ${finalScore}% match based on ${intent.useCase || 'your requirements'}, budget allocation (₹${prod.price.toLocaleString('en-IN')}), and ${prod.rating}★ user satisfaction.`
            };
        }).sort((a, b) => b.aiScore - a.aiScore);
    }

    /**
     * Generate a multi-product Smart Cart bundle setup for queries like "Build a gaming setup under ₹80,000"
     */
    generateSmartCartBundle(query: AiShoppingQuery): SmartCartBundle {
        const budget = query.budget || 80000;
        const allProducts = this.productService.products();
        const items: CartItem[] = [];

        let currentCost = 0;
        const isGaming = (query.useCase || '').toLowerCase().includes('gaming') || query.rawQuery.toLowerCase().includes('gaming');

        // 1. Primary device (Laptop)
        const laptop = allProducts.find(p => p.category === 'laptop' && (isGaming ? p.name.includes('Gaming') || p.name.includes('TUF') : true) && p.price <= budget * 0.7)
            || allProducts.find(p => p.category === 'laptop' && p.price <= budget * 0.7);

        if (laptop) {
            items.push({ product: laptop, quantity: 1, addedByAi: true });
            currentCost += laptop.price;
        }

        // 2. Peripheral (Mouse)
        const remBudget1 = budget - currentCost;
        const mouse = allProducts.find(p => p.category === 'peripherals' && p.name.toLowerCase().includes('mouse') && p.price <= remBudget1);
        if (mouse) {
            items.push({ product: mouse, quantity: 1, addedByAi: true });
            currentCost += mouse.price;
        }

        // 3. Peripheral (Keyboard)
        const remBudget2 = budget - currentCost;
        const keyboard = allProducts.find(p => p.category === 'peripherals' && p.name.toLowerCase().includes('keyboard') && p.price <= remBudget2);
        if (keyboard) {
            items.push({ product: keyboard, quantity: 1, addedByAi: true });
            currentCost += keyboard.price;
        }

        // 4. Monitor or Headphones
        const remBudget3 = budget - currentCost;
        const monitor = allProducts.find(p => p.category === 'monitors' && p.price <= remBudget3);
        if (monitor) {
            items.push({ product: monitor, quantity: 1, addedByAi: true });
            currentCost += monitor.price;
        } else {
            const audio = allProducts.find(p => p.category === 'audio' && p.price <= remBudget3);
            if (audio) {
                items.push({ product: audio, quantity: 1, addedByAi: true });
                currentCost += audio.price;
            }
        }

        const estimatedSavings = items.reduce((acc, item) => acc + ((item.product.originalPrice - item.product.price) * item.quantity), 0);

        return {
            title: `${query.useCase || 'AI Smart Setup'} (Budget: ₹${budget.toLocaleString('en-IN')})`,
            totalBudget: budget,
            totalPrice: currentCost,
            estimatedSavings: Math.max(0, estimatedSavings),
            remainingBudget: Math.max(0, budget - currentCost),
            items
        };
    }

    /**
     * Process full natural language query with Gemini API & intelligent AI response formatting
     */
    async processShoppingQuery(userQuery: string): Promise<{
        text: string;
        extractedIntent: AiShoppingQuery;
        recommendedProducts: Product[];
        smartCartBundle?: SmartCartBundle;
    }> {
        const intent = await this.extractIntent(userQuery);
        const rankedProducts = this.rankProducts(this.productService.products(), intent);

        let smartCartBundle: SmartCartBundle | undefined;
        const isSetupQuery = userQuery.toLowerCase().includes('setup') || userQuery.toLowerCase().includes('build') || userQuery.toLowerCase().includes('bundle') || userQuery.toLowerCase().includes('combo');

        if (isSetupQuery) {
            smartCartBundle = this.generateSmartCartBundle(intent);
        }

        let responseText = '';

        try {
            const promptText = `
        You are an expert AI Shopping Agent for Indian E-commerce electronics.
        The user asks: "${userQuery}".
        Extracted Intent:
        - Category: ${intent.category || 'All'}
        - Budget: ${intent.budget ? '₹' + intent.budget.toLocaleString('en-IN') : 'Flexible'}
        - Brand: ${intent.brand || 'Any'}
        - Use Case: ${intent.useCase || 'General'}

        Top matching products from inventory:
        ${rankedProducts.slice(0, 3).map((p, idx) => `${idx + 1}. ${p.name} - Price: ₹${p.price.toLocaleString('en-IN')} (Original: ₹${p.originalPrice.toLocaleString('en-IN')}), Rating: ${p.rating}★, AI Score: ${p.aiScore}%. Highlight: ${p.aiScoreReason}`).join('\n')}

        Provide a friendly, highly persuasive 2-3 paragraph response analyzing why these products fit the budget and specs perfectly.
        Include price insights and store availability tips. Use Markdown formatting.
      `;

            const response = await this.ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: [{ role: 'user', parts: [{ text: promptText }] }]
            });

            responseText = response.text || '';
        } catch (err) {
            console.warn('Gemini API call warning (using AI smart rule generator fallback):', err);
        }

        if (!responseText) {
            const topPick = rankedProducts[0];
            const budgetFormatted = intent.budget ? `₹${intent.budget.toLocaleString('en-IN')}` : 'your budget';

            if (isSetupQuery && smartCartBundle) {
                responseText = `### 🚀 Custom AI Setup Generated within ${budgetFormatted}\n\nI have curated a high-performance **${intent.useCase || 'complete workspace'}** bundle optimized for your budget.\n\n* **Total Setup Price:** ₹${smartCartBundle.totalPrice.toLocaleString('en-IN')}\n* **Total Savings:** ₹${smartCartBundle.estimatedSavings.toLocaleString('en-IN')}\n* **Remaining Budget:** ₹${smartCartBundle.remainingBudget.toLocaleString('en-IN')}\n\nYou can click **"Add All to Smart Cart"** below to instantly load this bundle into your cart!`;
            } else {
                responseText = `### 🤖 AI Product Analysis for "${userQuery}"\n\nBased on your query, I analyzed the top electronics matching ${intent.category ? '**' + intent.category + '**' : 'tech items'} under **${budgetFormatted}**.\n\nOur top recommendation is the **${topPick?.name}** with an AI Match Score of **${topPick?.aiScore}%**. It delivers exceptional specs, high user satisfaction (${topPick?.rating}★), and current price drops across major online retailers!`;
            }
        }

        return {
            text: responseText,
            extractedIntent: intent,
            recommendedProducts: rankedProducts.slice(0, 4),
            smartCartBundle
        };
    }
}
