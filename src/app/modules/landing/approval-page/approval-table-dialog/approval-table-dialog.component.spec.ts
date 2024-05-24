import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTableDialogComponent } from './approval-table-dialog.component';

describe('ApprovalTableDialogComponent', () => {
  let component: ApprovalTableDialogComponent;
  let fixture: ComponentFixture<ApprovalTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTableDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
