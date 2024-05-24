import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTableWorkComponent } from './approval-table-work.component';

describe('ApprovalTableWorkComponent', () => {
  let component: ApprovalTableWorkComponent;
  let fixture: ComponentFixture<ApprovalTableWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTableWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalTableWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
