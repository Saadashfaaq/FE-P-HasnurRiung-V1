import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileApprovalTableWorkComponent } from './mobile-approval-table-work.component';

describe('MobileApprovalTableWorkComponent', () => {
  let component: MobileApprovalTableWorkComponent;
  let fixture: ComponentFixture<MobileApprovalTableWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileApprovalTableWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileApprovalTableWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
