import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFormPermitComponent } from './mobile-form-permit.component';

describe('MobileFormPermitComponent', () => {
  let component: MobileFormPermitComponent;
  let fixture: ComponentFixture<MobileFormPermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFormPermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileFormPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
