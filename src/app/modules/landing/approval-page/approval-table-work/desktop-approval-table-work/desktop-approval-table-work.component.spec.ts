import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopApprovalTableWorkComponent } from './desktop-approval-table-work.component';

describe('DesktopApprovalTableWorkComponent', () => {
  let component: DesktopApprovalTableWorkComponent;
  let fixture: ComponentFixture<DesktopApprovalTableWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopApprovalTableWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopApprovalTableWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
