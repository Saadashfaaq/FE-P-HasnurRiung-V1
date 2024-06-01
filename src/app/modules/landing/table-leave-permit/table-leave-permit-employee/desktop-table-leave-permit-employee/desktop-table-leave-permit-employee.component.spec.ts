import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTableLeavePermitEmployeeComponent } from './desktop-table-leave-permit-employee.component';

describe('DesktopTableLeavePermitEmployeeComponent', () => {
  let component: DesktopTableLeavePermitEmployeeComponent;
  let fixture: ComponentFixture<DesktopTableLeavePermitEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopTableLeavePermitEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopTableLeavePermitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
