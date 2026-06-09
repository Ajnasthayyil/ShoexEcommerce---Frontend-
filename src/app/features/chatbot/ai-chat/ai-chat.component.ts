import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { ProductService } from '../../../core/services/product.service';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  standalone: true,
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AiChatComponent implements AfterViewInit, OnInit {
  messages: ChatMessage[] = [
    { content: 'Hello! I am your ShoeX AI Assistant. Ask me anything, or type a page name (like "cart", "wishlist", "catalog") to go there instantly!', sender: 'bot', timestamp: new Date() }
  ];
  userInput: string = '';
  loading = false;
  isOpen = false;
  products: any[] = [];

  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private chatbotService: ChatbotService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (prods) => {
        this.products = prods;
      },
      error: (err) => {
        console.error('Failed to load products for chatbot recommendations', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  sendMessage(predefinedText?: string): void {
    const textToSubmit = predefinedText || this.userInput;
    const trimmed = textToSubmit.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { content: trimmed, sender: 'user', timestamp: new Date() };
    this.messages.push(userMsg);
    
    if (!predefinedText) {
      this.userInput = '';
    }

    this.loading = true;
    this.scrollToBottom();

    // Check for navigation commands locally first for instant routing
    if (this.handleLocalNavigation(trimmed)) {
      this.loading = false;
      return;
    }

    this.chatbotService.sendMessage(trimmed).subscribe({
      next: (response) => {
        const recommended = this.extractRecommendations(response);
        const botMsg: ChatMessage = { 
          content: response, 
          sender: 'bot', 
          timestamp: new Date(),
          recommendedProducts: recommended
        };
        this.messages.push(botMsg);
        this.loading = false;
        this.scrollToBottom();

        // Also check if the AI response itself instructs navigation
        this.handleLocalNavigation(response);
      },
      error: (err) => {
        const errMsg: ChatMessage = { content: 'Error: could not fetch response.', sender: 'bot', timestamp: new Date() };
        this.messages.push(errMsg);
        this.loading = false;
        this.scrollToBottom();
        console.error(err);
      }
    });
  }

  private extractRecommendations(text: string): any[] {
    if (!text || !this.products || this.products.length === 0) return [];
    const matched: any[] = [];
    const textLower = text.toLowerCase();

    for (const prod of this.products) {
      if (!prod.name || prod.name.length < 3) continue;
      if (textLower.includes(prod.name.toLowerCase())) {
        if (!matched.some(p => p.id === prod.id)) {
          matched.push(prod);
        }
      }
    }
    return matched;
  }

  navigateToProduct(id: number): void {
    this.router.navigate(['/product-details', id]);
    this.isOpen = false;
  }

  private handleLocalNavigation(message: string): boolean {
    const text = message.toLowerCase();
    
    const navRoutes = [
      { keywords: ['cart', 'shopping bag', 'bag'], path: '/cart', pageName: 'Cart' },
      { keywords: ['wishlist', 'favorite', 'favorites'], path: '/wishlist', pageName: 'Wishlist' },
      { keywords: ['checkout', 'payment', 'pay'], path: '/checkout', pageName: 'Checkout' },
      { keywords: ['profile', 'account', 'dossier', 'my details'], path: '/profile', pageName: 'Profile' },
      { keywords: ['order', 'orders', 'purchase', 'history'], path: '/orders', pageName: 'Orders' },
      { keywords: ['home', 'main', 'index', 'welcome'], path: '/home', pageName: 'Home' },
      { keywords: ['about', 'legacy', 'brand', 'info'], path: '/about', pageName: 'About' },
      { keywords: ['contact', 'connect', 'support', 'help'], path: '/contact', pageName: 'Contact' },
      { keywords: ['product', 'catalog', 'selection', 'shop', 'shoes', 'sneakers'], path: '/products', pageName: 'Products' },
      { keywords: ['login', 'signin', 'auth'], path: '/auth/login', pageName: 'Login' },
      { keywords: ['register', 'signup'], path: '/auth/register', pageName: 'Register' }
    ];

    // Detect navigation intent (keywords or direct names if message is short)
    const isNavIntent = text.includes('go to') || 
                        text.includes('navigate') || 
                        text.includes('open') || 
                        text.includes('take me to') || 
                        text.includes('show my') || 
                        text.trim().length < 15;
    
    if (isNavIntent) {
      for (const route of navRoutes) {
        if (route.keywords.some(k => text.includes(k))) {
          this.router.navigateByUrl(route.path);
          const systemMsg: ChatMessage = {
            content: `Redirecting you to the ${route.pageName} page...`,
            sender: 'bot',
            timestamp: new Date()
          };
          this.messages.push(systemMsg);
          this.scrollToBottom();
          return true;
        }
      }
    }
    return false;
  }

  onEnter(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
