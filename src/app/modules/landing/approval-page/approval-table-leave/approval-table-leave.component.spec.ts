import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTableLeaveComponent } from './approval-table-leave.component';

describe('ApprovalTableLeaveComponent', () => {
  let component: ApprovalTableLeaveComponent;
  let fixture: ComponentFixture<ApprovalTableLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTableLeaveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalTableLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
