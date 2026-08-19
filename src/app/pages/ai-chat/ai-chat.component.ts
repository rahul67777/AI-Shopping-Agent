import { Component, ChangeDetectionStrategy, inject, signal, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AiService } from '../../services/ai.service';
import { CartService } from '../../services/cart.service';
import { SpeechService } from '../../services/speech.service';
import { AiChatMessage, Product, SmartCartBundle } from '../../models/product.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { effect } from '@angular/core';

@Component({
    selector: 'app-ai-chat-page',
    imports: [ProductCardComponent, FormsModule],
    templateUrl: './ai-chat.component.html',
    styleUrl: './ai-chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiChatComponent implements OnInit {
    @ViewChild('chatBody') chatBody!: ElementRef;

    private aiService = inject(AiService);
    readonly cartService = inject(CartService);
    readonly speechService = inject(SpeechService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    userInput = signal<string>('');
    messages = signal<AiChatMessage[]>([
        {
            id: 'welcome-msg',
            sender: 'ai',
            text: "👋 Hi! I am your **AI Shopping Agent**. I can help you search, compare, rank electronics, or build complete PC/gaming/coding setups within your budget.\n\n*What are you looking for today?*",
            timestamp: new Date()
        }
    ]);
    loading = signal<boolean>(false);

    quickQueries = [
        'I need a gaming laptop under ₹60,000.',
        'Find the best smartphone under ₹20,000.',
        'Build a complete coding setup within ₹80,000.',
        'Best wireless noise-canceling headphones.'
    ];

    constructor() {
        // Listen for speech transcript changes
        effect(() => {
            const text = this.speechService.transcript();
            if (text && this.speechService.isListening()) {
                this.userInput.set(text);
            }
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['q']) {
                this.userInput.set(params['q']);
                this.sendQuery(params['q']);
            }
        });
    }

    async sendQuery(queryText?: string): Promise<void> {
        const prompt = (queryText || this.userInput()).trim();
        if (!prompt || this.loading()) return;

        // Add user message
        const userMsg: AiChatMessage = {
            id: 'usr-' + Date.now(),
            sender: 'user',
            text: prompt,
            timestamp: new Date()
        };

        const loadingAiMsg: AiChatMessage = {
            id: 'ai-temp-' + Date.now(),
            sender: 'ai',
            text: 'Thinking...',
            timestamp: new Date(),
            isLoading: true
        };

        this.messages.update(prev => [...prev, userMsg, loadingAiMsg]);
        this.userInput.set('');
        this.loading.set(true);
        this.scrollToBottom();

        try {
            const res = await this.aiService.processShoppingQuery(prompt);

            const realAiMsg: AiChatMessage = {
                id: 'ai-' + Date.now(),
                sender: 'ai',
                text: res.text,
                timestamp: new Date(),
                extractedIntent: res.extractedIntent,
                recommendedProducts: res.recommendedProducts,
                smartCartBundle: res.smartCartBundle,
                isLoading: false
            };

            this.messages.update(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = realAiMsg;
                return updated;
            });
        } catch (err) {
            console.error('Chat AI process error:', err);
            this.messages.update(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    id: 'ai-err-' + Date.now(),
                    sender: 'ai',
                    text: 'Sorry, I ran into an error processing your query. Please try asking again!',
                    timestamp: new Date(),
                    isLoading: false
                };
                return updated;
            });
        } finally {
            this.loading.set(false);
            this.scrollToBottom();
        }
    }

    onAddToCart(product: Product): void {
        this.cartService.addItem(product, 1);
    }

    onCompare(product: Product): void {
        this.router.navigate(['/shopping/comparison'], { queryParams: { prodId: product.id } });
    }

    applyBundle(bundle: SmartCartBundle): void {
        this.cartService.applyAiBundle(bundle);
        this.router.navigate(['/shopping/cart']);
    }

    formatMarkdown(text: string): string {
        return marked.parse(text) as string;
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.chatBody) {
                this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
            }
        }, 100);
    }
}
