import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaykeyComponent } from './paykey.component';

describe('PaykeyComponent', () => {
  let component: PaykeyComponent;
  let fixture: ComponentFixture<PaykeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaykeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaykeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
