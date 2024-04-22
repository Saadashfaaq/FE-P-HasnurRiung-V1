import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLeavePermitEmployeeComponent } from './table-leave-permit-employee.component';

describe('TableLeavePermitEmployeeComponent', () => {
  let component: TableLeavePermitEmployeeComponent;
  let fixture: ComponentFixture<TableLeavePermitEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLeavePermitEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableLeavePermitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
