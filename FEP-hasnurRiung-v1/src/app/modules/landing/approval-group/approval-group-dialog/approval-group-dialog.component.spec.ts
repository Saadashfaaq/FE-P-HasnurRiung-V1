import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalGroupDialogComponent } from './approval-group-dialog.component';

describe('ApprovalGroupDialogComponent', () => {
  let component: ApprovalGroupDialogComponent;
  let fixture: ComponentFixture<ApprovalGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalGroupDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
