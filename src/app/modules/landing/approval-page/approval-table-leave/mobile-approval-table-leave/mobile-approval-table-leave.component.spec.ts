import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileApprovalTableLeaveComponent } from './mobile-approval-table-leave.component';

describe('MobileApprovalTableLeaveComponent', () => {
  let component: MobileApprovalTableLeaveComponent;
  let fixture: ComponentFixture<MobileApprovalTableLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileApprovalTableLeaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileApprovalTableLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
