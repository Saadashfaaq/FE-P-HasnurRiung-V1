import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWorkPermitAdminComponent } from './table-work-permit-admin.component';

describe('TableWorkPermitAdminComponent', () => {
  let component: TableWorkPermitAdminComponent;
  let fixture: ComponentFixture<TableWorkPermitAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWorkPermitAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableWorkPermitAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
