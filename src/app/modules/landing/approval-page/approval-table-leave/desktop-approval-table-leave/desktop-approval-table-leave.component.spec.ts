import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopApprovalTableLeaveComponent } from './desktop-approval-table-leave.component';

describe('DesktopApprovalTableLeaveComponent', () => {
  let component: DesktopApprovalTableLeaveComponent;
  let fixture: ComponentFixture<DesktopApprovalTableLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopApprovalTableLeaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopApprovalTableLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
