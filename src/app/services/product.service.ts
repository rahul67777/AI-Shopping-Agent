import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductFilters } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    // Master Catalog of Products
    private readonly initialProducts: Product[] = [
        {
            id: 'prod-laptop-1',
            name: 'ASUS TUF Gaming F15 (2024)',
            category: 'laptop',
            brand: 'ASUS',
            price: 54990,
            originalPrice: 74990,
            rating: 4.6,
            reviewCount: 3420,
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
            description: 'High-performance gaming laptop with Intel Core i5-12500H, RTX 3050 graphics, 16GB DDR4 RAM, and 512GB NVMe SSD.',
            specs: {
                'Processor': 'Intel Core i5-12500H (12th Gen)',
                'Graphics': 'NVIDIA GeForce RTX 3050 4GB TGP 95W',
                'RAM': '16GB DDR4 (Expandable to 32GB)',
                'Storage': '512GB PCIe 4.0 NVMe M.2 SSD',
                'Display': '15.6" FHD 144Hz IPS Anti-Glare',
                'Battery': '90Whr Battery (up to 7 hours)'
            },
            aiScore: 96,
            aiScoreReason: 'Best price-to-performance ratio for gaming laptops under ₹60,000 with RTX graphics & 144Hz high refresh display.',
            badges: ['🔥 Top AI Recommendation', 'Best Value Gaming', 'Instant ₹20,000 Off'],
            isRecommended: true,
            lowestPrice: 52990,
            highestPrice: 62990,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 61990 },
                { date: ' Feb', price: 58990 },
                { date: ' Mar', price: 56990 },
                { date: ' Apr', price: 54990 }
            ],
            stores: [
                { storeName: 'Amazon', price: 54990, inStock: true, dealTag: 'Lowest Price', isBestDeal: true },
                { storeName: 'Flipkart', price: 55490, inStock: true, dealTag: 'Bank Offer ₹1,500 Off', isBestDeal: false },
                { storeName: 'Croma', price: 56990, inStock: true, dealTag: 'Free Bag', isBestDeal: false },
                { storeName: 'Reliance Digital', price: 57990, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-laptop-2',
            name: 'Lenovo IdeaPad Gaming 3',
            category: 'laptop',
            brand: 'Lenovo',
            price: 49990,
            originalPrice: 68990,
            rating: 4.4,
            reviewCount: 2150,
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
            description: 'AMD Ryzen 5 5600H power machine with GTX 1650, 16GB RAM and 120Hz display screen.',
            specs: {
                'Processor': 'AMD Ryzen 5 5600H 6-Core',
                'Graphics': 'NVIDIA GeForce GTX 1650 4GB',
                'RAM': '16GB DDR4 3200MHz',
                'Storage': '512GB SSD',
                'Display': '15.6" FHD 120Hz'
            },
            aiScore: 91,
            aiScoreReason: 'Budget gaming champ under ₹50,000 with rock solid thermals & dual fan cooling.',
            badges: ['Budget Champion', 'High Rated'],
            isRecommended: true,
            lowestPrice: 48990,
            highestPrice: 55990,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 55990 },
                { date: ' Feb', price: 52990 },
                { date: ' Mar', price: 50990 },
                { date: ' Apr', price: 49990 }
            ],
            stores: [
                { storeName: 'Amazon', price: 49990, inStock: true, dealTag: 'Best Price', isBestDeal: true },
                { storeName: 'Flipkart', price: 50990, inStock: true, isBestDeal: false },
                { storeName: 'Croma', price: 51990, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-laptop-3',
            name: 'Apple MacBook Air M2 (8GB / 256GB)',
            category: 'laptop',
            brand: 'Apple',
            price: 79900,
            originalPrice: 99900,
            rating: 4.9,
            reviewCount: 5840,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
            description: 'Ultra-thin, whisper-quiet MacBook Air with Apple M2 chip, Liquid Retina display, and up to 18 hours battery life.',
            specs: {
                'Processor': 'Apple M2 8-Core CPU / 8-Core GPU',
                'RAM': '8GB Unified Memory',
                'Storage': '256GB Superfast SSD',
                'Display': '13.6" Liquid Retina True Tone',
                'Battery Life': 'Up to 18 Hours All Day'
            },
            aiScore: 98,
            aiScoreReason: 'Unbeatable battery life, build quality, and raw efficiency for developers, students, and creative pros.',
            badges: ['⭐ Overall Winner', 'Pro Choice', 'Longest Battery'],
            isRecommended: true,
            lowestPrice: 78900,
            highestPrice: 92900,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 89900 },
                { date: ' Feb', price: 84900 },
                { date: ' Mar', price: 81900 },
                { date: ' Apr', price: 79900 }
            ],
            stores: [
                { storeName: 'Amazon', price: 79900, inStock: true, dealTag: 'HDFC Card ₹5,000 Off', isBestDeal: true },
                { storeName: 'Flipkart', price: 80900, inStock: true, isBestDeal: false },
                { storeName: 'Reliance Digital', price: 82900, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-phone-1',
            name: 'iQOO Z9 5G (8GB RAM / 128GB)',
            category: 'smartphone',
            brand: 'iQOO',
            price: 18999,
            originalPrice: 24999,
            rating: 4.5,
            reviewCount: 4200,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
            description: 'MediaTek Dimensity 7200 processor, 120Hz Sony OIS camera smartphone under ₹20,000.',
            specs: {
                'Processor': 'MediaTek Dimensity 7200 4nm',
                'Camera': '50MP Sony IMX882 OIS + 2MP',
                'Display': '6.67" AMOLED 120Hz 1800 nits Peak',
                'Battery': '5000mAh with 44W FlashCharge',
                'OS': 'Funtouch OS 14 (Android 14)'
            },
            aiScore: 97,
            aiScoreReason: 'Fastest benchmark score in the sub-₹20,000 segment with OIS Sony camera.',
            badges: ['⚡ Fastest Sub-20k Phone', 'Best Camera Deal'],
            isRecommended: true,
            lowestPrice: 17999,
            highestPrice: 21999,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 20999 },
                { date: ' Feb', price: 19999 },
                { date: ' Mar', price: 18999 },
                { date: ' Apr', price: 18999 }
            ],
            stores: [
                { storeName: 'Amazon', price: 18999, inStock: true, dealTag: 'Best Price', isBestDeal: true },
                { storeName: 'Flipkart', price: 19499, inStock: true, isBestDeal: false },
                { storeName: 'Croma', price: 19999, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-phone-2',
            name: 'OnePlus Nord CE4 5G',
            category: 'smartphone',
            brand: 'OnePlus',
            price: 24999,
            originalPrice: 28999,
            rating: 4.6,
            reviewCount: 3900,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
            description: 'Snapdragon 7 Gen 3, 100W SUPERVOOC fast charging, 5500mAh monster battery and Sony LYT-600 OIS camera.',
            specs: {
                'Processor': 'Snapdragon 7 Gen 3',
                'Charging': '100W SUPERVOOC Fast Charge (1-100% in 29m)',
                'Battery': '5500 mAh battery',
                'Camera': '50MP Sony LYT-600 OIS + 8MP Ultra-wide',
                'Display': '6.7" Fluid AMOLED 120Hz'
            },
            aiScore: 94,
            aiScoreReason: 'Insanely fast 100W charging and clean OxygenOS interface.',
            badges: ['🔋 100W SuperFast Charge', 'Popular Choice'],
            isRecommended: true,
            lowestPrice: 23999,
            highestPrice: 26999,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 26999 },
                { date: ' Feb', price: 25999 },
                { date: ' Mar', price: 24999 },
                { date: ' Apr', price: 24999 }
            ],
            stores: [
                { storeName: 'Amazon', price: 24999, inStock: true, dealTag: 'Instant ₹1000 ICICI Off', isBestDeal: true },
                { storeName: 'Flipkart', price: 25499, inStock: true, isBestDeal: false },
                { storeName: 'Reliance Digital', price: 25999, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-phone-3',
            name: 'Samsung Galaxy S23 FE 5G',
            category: 'smartphone',
            brand: 'Samsung',
            price: 38999,
            originalPrice: 59999,
            rating: 4.4,
            reviewCount: 1890,
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
            description: 'Flagship experience with Nightography camera, Dynamic AMOLED 2X, and IP68 water resistance.',
            specs: {
                'Processor': 'Exynos 2200 4nm',
                'Camera': '50MP OIS Telephoto 3X Optical Zoom',
                'Display': '6.4" Dynamic AMOLED 2X 120Hz Vision Booster',
                'Durability': 'IP68 Water & Dust Resistant, Gorilla Glass 5'
            },
            aiScore: 89,
            aiScoreReason: 'Flagship camera features & IP68 build now available under ₹40,000.',
            badges: ['📸 Telephoto Zoom', 'IP68 Waterproof'],
            isRecommended: false,
            lowestPrice: 35999,
            highestPrice: 44999,
            aiRecommendation: 'WAIT_FOR_SALE',
            priceHistory: [
                { date: ' Jan', price: 44999 },
                { date: ' Feb', price: 41999 },
                { date: ' Mar', price: 38999 },
                { date: ' Apr', price: 38999 }
            ],
            stores: [
                { storeName: 'Amazon', price: 38999, inStock: true, dealTag: 'Lowest in 30 days', isBestDeal: true },
                { storeName: 'Flipkart', price: 39999, inStock: true, isBestDeal: false },
                { storeName: 'Samsung Official', price: 40999, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-mon-1',
            name: 'LG Ultragear 24-inch FHD Gaming Monitor',
            category: 'monitors',
            brand: 'LG',
            price: 11499,
            originalPrice: 17000,
            rating: 4.7,
            reviewCount: 6500,
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
            description: '144Hz IPS display panel, 1ms response rate, AMD FreeSync Premium, sRGB 99%.',
            specs: {
                'Screen Size': '24 inch Full HD (1920 x 1080)',
                'Refresh Rate': '144Hz',
                'Response Time': '1ms MBR',
                'Panel Type': 'IPS sRGB 99% Color Accuracy'
            },
            aiScore: 95,
            aiScoreReason: 'Gold standard budget gaming & coding monitor with true IPS color accuracy.',
            badges: ['🎯 144Hz 1ms IPS', 'Bestseller'],
            isRecommended: true,
            lowestPrice: 10999,
            highestPrice: 13999,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 13499 },
                { date: ' Feb', price: 12499 },
                { date: ' Mar', price: 11999 },
                { date: ' Apr', price: 11499 }
            ],
            stores: [
                { storeName: 'Amazon', price: 11499, inStock: true, dealTag: 'Free Delivery', isBestDeal: true },
                { storeName: 'Flipkart', price: 11999, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-acc-1',
            name: 'Logitech MX Master 3S Wireless Mouse',
            category: 'peripherals',
            brand: 'Logitech',
            price: 8995,
            originalPrice: 10995,
            rating: 4.8,
            reviewCount: 7800,
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
            description: 'Ultimate ergonomics mouse with MagSpeed Electromagnetic scrolling, quiet clicks, and 8K DPI tracking.',
            specs: {
                'Sensor': '8,000 DPI Darkfield Precision',
                'Connectivity': 'Bluetooth + Logi Bolt USB Receiver',
                'Battery': 'Up to 70 days on full charge',
                'Buttons': '7 Customizable Buttons + Thumb Wheel'
            },
            aiScore: 99,
            aiScoreReason: 'Unmatched ergonomic comfort and productivity features for programmers, editors & multitaskers.',
            badges: ['👑 Ultimate Productivity Tool', '99% AI Choice'],
            isRecommended: true,
            lowestPrice: 8495,
            highestPrice: 9995,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 9995 },
                { date: ' Feb', price: 9495 },
                { date: ' Mar', price: 8995 },
                { date: ' Apr', price: 8995 }
            ],
            stores: [
                { storeName: 'Amazon', price: 8995, inStock: true, isBestDeal: true },
                { storeName: 'Flipkart', price: 9290, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-acc-2',
            name: 'Keychron K2 V2 Wireless Mechanical Keyboard',
            category: 'peripherals',
            brand: 'Keychron',
            price: 6999,
            originalPrice: 8999,
            rating: 4.7,
            reviewCount: 3100,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
            description: '75% layout wireless mechanical keyboard with Gateron Brown tactile switches and Mac/Windows double keycaps.',
            specs: {
                'Switch Type': 'Gateron Mechanical Brown Tactile',
                'Layout': '75% (84 Keys)',
                'Battery': '4000mAh Big Battery',
                'Compatibility': 'Mac & Windows OS Native'
            },
            aiScore: 94,
            aiScoreReason: 'The best mechanical keyboard under ₹7,000 for tactile feel & dual Mac/Windows setup.',
            badges: ['⌨️ Coder Favorite', 'Tactile Switches'],
            isRecommended: true,
            lowestPrice: 6499,
            highestPrice: 7999,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 7999 },
                { date: ' Feb', price: 7499 },
                { date: ' Mar', price: 6999 },
                { date: ' Apr', price: 6999 }
            ],
            stores: [
                { storeName: 'Amazon', price: 6999, inStock: true, isBestDeal: true },
                { storeName: 'Keychron India', price: 6999, inStock: true, isBestDeal: true }
            ]
        },
        {
            id: 'prod-audio-1',
            name: 'Sony WH-1000XM4 Noise Canceling Headphones',
            category: 'audio',
            brand: 'Sony',
            price: 19990,
            originalPrice: 29990,
            rating: 4.8,
            reviewCount: 9400,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
            description: 'Industry-leading noise canceling over-ear headphones with Dual Noise Sensor technology and 30-hour battery life.',
            specs: {
                'ANC': 'HD Noise Canceling Processor QN1',
                'Battery': '30 Hours (Quick charge 10 mins = 5 hrs)',
                'Sound': 'LDAC Hi-Res Audio + DSEE Extreme',
                'Features': 'Speak-to-Chat, Multipoint Bluetooth Connection'
            },
            aiScore: 97,
            aiScoreReason: 'Top notch active noise cancellation for focus, work, travel, and studio-grade sound.',
            badges: ['🎧 Industry Leading ANC', '30hr Battery'],
            isRecommended: true,
            lowestPrice: 18490,
            highestPrice: 24990,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 23990 },
                { date: ' Feb', price: 21990 },
                { date: ' Mar', price: 19990 },
                { date: ' Apr', price: 19990 }
            ],
            stores: [
                { storeName: 'Amazon', price: 19990, inStock: true, dealTag: 'Best Price', isBestDeal: true },
                { storeName: 'Flipkart', price: 20490, inStock: true, isBestDeal: false },
                { storeName: 'Croma', price: 21990, inStock: true, isBestDeal: false }
            ]
        },
        {
            id: 'prod-audio-2',
            name: 'OnePlus Buds 3 TWS Earbuds',
            category: 'audio',
            brand: 'OnePlus',
            price: 4999,
            originalPrice: 6499,
            rating: 4.5,
            reviewCount: 3800,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
            description: '49dB Smart Adaptive Noise Cancellation, Dual Drivers, Hi-Res Audio LHDC 5.0, up to 44 hrs playback.',
            specs: {
                'ANC': '49dB Smart Adaptive ANC',
                'Driver': '10.4mm Woofer + 6mm Tweeter Dual Drivers',
                'Battery': '44 Hours total battery',
                'Latency': '94ms Ultra Low Latency'
            },
            aiScore: 92,
            aiScoreReason: 'Dual driver clarity & 49dB active noise cancellation at an affordable ₹5,000 price point.',
            badges: ['🎵 Dual Driver Sound', '49dB ANC'],
            isRecommended: true,
            lowestPrice: 4499,
            highestPrice: 5499,
            aiRecommendation: 'BUY_NOW',
            priceHistory: [
                { date: ' Jan', price: 5499 },
                { date: ' Feb', price: 5199 },
                { date: ' Mar', price: 4999 },
                { date: ' Apr', price: 4999 }
            ],
            stores: [
                { storeName: 'Amazon', price: 4999, inStock: true, isBestDeal: true },
                { storeName: 'Flipkart', price: 5199, inStock: true, isBestDeal: false }
            ]
        }
    ];

    // Signals
    readonly products = signal<Product[]>(this.initialProducts);
    readonly activeFilters = signal<ProductFilters>({});

    // Computed signals
    readonly filteredProducts = computed(() => {
        let list = [...this.products()];
        const filters = this.activeFilters();

        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase().trim();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                Object.values(p.specs).some(val => val.toLowerCase().includes(q))
            );
        }

        if (filters.category && filters.category !== 'all') {
            list = list.filter(p => p.category === filters.category);
        }

        if (filters.brand && filters.brand !== 'all') {
            list = list.filter(p => p.brand.toLowerCase() === filters.brand?.toLowerCase());
        }

        if (filters.minPrice !== undefined) {
            list = list.filter(p => p.price >= (filters.minPrice ?? 0));
        }

        if (filters.maxPrice !== undefined) {
            list = list.filter(p => p.price <= (filters.maxPrice ?? Infinity));
        }

        if (filters.minRating !== undefined) {
            list = list.filter(p => p.rating >= (filters.minRating ?? 0));
        }

        if (filters.minAiScore !== undefined) {
            list = list.filter(p => p.aiScore >= (filters.minAiScore ?? 0));
        }

        // Sort
        if (filters.sortBy === 'aiScore') {
            list.sort((a, b) => b.aiScore - a.aiScore);
        } else if (filters.sortBy === 'priceLowHigh') {
            list.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'priceHighLow') {
            list.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === 'rating') {
            list.sort((a, b) => b.rating - a.rating);
        }

        return list;
    });

    readonly topRecommended = computed(() => {
        return [...this.products()]
            .sort((a, b) => b.aiScore - a.aiScore)
            .slice(0, 4);
    });

    readonly categories = [
        { id: 'all', label: 'All Products', icon: 'grid_view' },
        { id: 'laptop', label: 'Laptops', icon: 'laptop' },
        { id: 'smartphone', label: 'Smartphones', icon: 'smartphone' },
        { id: 'monitors', label: 'Monitors', icon: 'desktop_windows' },
        { id: 'peripherals', label: 'Keyboards & Mice', icon: 'mouse' },
        { id: 'audio', label: 'Audio & ANC', icon: 'headphones' }
    ];

    getProductById(id: string): Product | undefined {
        return this.products().find(p => p.id === id);
    }

    setFilters(filters: Partial<ProductFilters>): void {
        this.activeFilters.update(prev => ({ ...prev, ...filters }));
    }

    clearFilters(): void {
        this.activeFilters.set({});
    }

    getAllBrands(): string[] {
        const brandsSet = new Set(this.products().map(p => p.brand));
        return Array.from(brandsSet);
    }
}
