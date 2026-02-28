import { ComponentFixture, TestBed } from '@angular/core/testing';

import { userOrdersComponent } from './user-orders.component';

describe('UserOrdersComponent', () => {
  let component: userOrdersComponent;
  let fixture: ComponentFixture<userOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [userOrdersComponent]
    });
    fixture = TestBed.createComponent(userOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
