import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appHideLayout]'
})
export class HideLayoutDirective {
  private excludedRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/admin/dashboard', '/admin/products','/admin/orders','/admin/users','/admin/analytics','/admin'];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateView(event.urlAfterRedirects);
    });
  }

  private updateView(url: string) {
    const shouldHide = this.excludedRoutes.includes(url);
    this.viewContainer.clear();
    if (!shouldHide) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
