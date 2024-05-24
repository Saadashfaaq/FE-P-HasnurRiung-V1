import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalGroupComponent } from './approval-group.component';

describe('ApprovalGroupComponent', () => {
  let component: ApprovalGroupComponent;
  let fixture: ComponentFixture<ApprovalGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
