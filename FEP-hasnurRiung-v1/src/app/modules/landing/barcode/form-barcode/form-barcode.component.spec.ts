import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBarcodeComponent } from './form-barcode.component';

describe('FormBarcodeComponent', () => {
  let component: FormBarcodeComponent;
  let fixture: ComponentFixture<FormBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBarcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
