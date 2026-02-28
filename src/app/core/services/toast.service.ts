import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: { message: string; type: 'success' | 'error' | 'info' }[] = [];

  constructor() {}

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toasts.push({ message, type });
    // For simplicity, log to console. In a real app, you might use a library or custom component.
    console.log(`Toast [${type.toUpperCase()}]: ${message}`);
    // Auto-remove after 2 seconds
    setTimeout(() => {
      this.toasts.shift();
    }, 2000);
  }

  getToasts() {
    return this.toasts;
  }
}
