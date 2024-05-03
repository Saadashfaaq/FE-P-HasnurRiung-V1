import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWorkPermitEmployeeComponent } from './table-work-permit-employee.component';

describe('TableWorkPermitEmployeeComponent', () => {
  let component: TableWorkPermitEmployeeComponent;
  let fixture: ComponentFixture<TableWorkPermitEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWorkPermitEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableWorkPermitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
