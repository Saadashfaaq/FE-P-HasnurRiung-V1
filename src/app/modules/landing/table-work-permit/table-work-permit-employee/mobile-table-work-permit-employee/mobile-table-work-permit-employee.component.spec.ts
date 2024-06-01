import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTableWorkPermitEmployeeComponent } from './mobile-table-work-permit-employee.component';

describe('MobileTableWorkPermitEmployeeComponent', () => {
  let component: MobileTableWorkPermitEmployeeComponent;
  let fixture: ComponentFixture<MobileTableWorkPermitEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTableWorkPermitEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileTableWorkPermitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
