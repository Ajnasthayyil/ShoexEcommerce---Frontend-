import { ComponentFixture, TestBed } from '@angular/core/testing';

import { contactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: contactComponent;
  let fixture: ComponentFixture<contactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [contactComponent]
    });
    fixture = TestBed.createComponent(contactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
