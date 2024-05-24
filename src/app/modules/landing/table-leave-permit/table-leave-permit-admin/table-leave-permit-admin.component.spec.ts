import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLeavePermitAdminComponent } from './table-leave-permit-admin.component';

describe('TableLeavePermitAdminComponent', () => {
  let component: TableLeavePermitAdminComponent;
  let fixture: ComponentFixture<TableLeavePermitAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLeavePermitAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableLeavePermitAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
