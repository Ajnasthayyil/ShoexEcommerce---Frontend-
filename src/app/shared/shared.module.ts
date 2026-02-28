import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HideLayoutDirective } from './directives/hide-layout.directive';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HideLayoutDirective],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, HideLayoutDirective]
})
export class SharedModule {}
