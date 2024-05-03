import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLeavePermitComponent } from './table-leave-permit.component';

describe('TableLeavePermitComponent', () => {
  let component: TableLeavePermitComponent;
  let fixture: ComponentFixture<TableLeavePermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLeavePermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableLeavePermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
