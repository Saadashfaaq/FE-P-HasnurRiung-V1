import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPermitComponent } from './form-permit.component';

describe('FormPermitComponent', () => {
  let component: FormPermitComponent;
  let fixture: ComponentFixture<FormPermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
