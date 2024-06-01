import { NgIf } from '@angular/common';
import { DesktopApprovalTableLeaveComponent } from './desktop-approval-table-leave/desktop-approval-table-leave.component';
import { MobileApprovalTableLeaveComponent } from './mobile-approval-table-leave/mobile-approval-table-leave.component';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-approval-table-leave',
  standalone: true,
  imports: [
    MobileApprovalTableLeaveComponent,
    DesktopApprovalTableLeaveComponent,
    NgIf,
  ],
  templateUrl: './approval-table-leave.component.html',
  styleUrl: './approval-table-leave.component.scss',
})
export class ApprovalTableLeaveComponent {
  isShowMobile: boolean = true;

  constructor() {}
  ngOnInit(): void {
    if (window?.innerWidth < 1024) {
      this.isShowMobile = true;
    } else {
      this.isShowMobile = false;
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width < 1024) {
      this.isShowMobile = true;
    } else {
      this.isShowMobile = false;
    }
  }
}
