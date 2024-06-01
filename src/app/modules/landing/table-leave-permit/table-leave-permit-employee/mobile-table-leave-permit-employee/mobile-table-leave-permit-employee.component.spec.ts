import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTableLeavePermitEmployeeComponent } from './mobile-table-leave-permit-employee.component';

describe('MobileTableLeavePermitEmployeeComponent', () => {
  let component: MobileTableLeavePermitEmployeeComponent;
  let fixture: ComponentFixture<MobileTableLeavePermitEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTableLeavePermitEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileTableLeavePermitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
