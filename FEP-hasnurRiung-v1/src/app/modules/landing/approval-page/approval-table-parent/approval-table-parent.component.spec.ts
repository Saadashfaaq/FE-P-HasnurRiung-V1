import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTableParentComponent } from './approval-table-parent.component';

describe('ApprovalTableParentComponent', () => {
  let component: ApprovalTableParentComponent;
  let fixture: ComponentFixture<ApprovalTableParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalTableParentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalTableParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
