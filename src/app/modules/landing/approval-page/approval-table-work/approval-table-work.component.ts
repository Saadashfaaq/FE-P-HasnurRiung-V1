import { NgIf } from "@angular/common";
import { Component, HostListener } from "@angular/core";
import { MobileApprovalTableWorkComponent } from "./mobile-approval-table-work/mobile-approval-table-work.component";
import { DesktopApprovalTableWorkComponent } from "./desktop-approval-table-work/desktop-approval-table-work.component";


@Component({
    selector: 'app-approval-table-work',
    standalone: true,
    templateUrl: './approval-table-work.component.html',
    styleUrl: './approval-table-work.component.scss',
    imports: [NgIf, MobileApprovalTableWorkComponent, DesktopApprovalTableWorkComponent]
})
export class ApprovalTableWorkComponent {
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
