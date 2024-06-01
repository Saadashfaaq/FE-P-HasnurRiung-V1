import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTableWorkPermitEmployeeComponent } from './desktop-table-work-permit-employee.component';

describe('DesktopTableWorkPermitEmployeeComponent', () => {
  let component: DesktopTableWorkPermitEmployeeComponent;
  let fixture: ComponentFixture<DesktopTableWorkPermitEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopTableWorkPermitEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopTableWorkPermitEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
