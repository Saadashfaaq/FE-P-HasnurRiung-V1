import { NgIf } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { MobileTableLeavePermitEmployeeComponent } from "./mobile-table-leave-permit-employee/mobile-table-leave-permit-employee.component";
import { DesktopTableLeavePermitEmployeeComponent } from "./desktop-table-leave-permit-employee/desktop-table-leave-permit-employee.component";

@Component({
  selector: 'app-table-leave-permit-employee',
  standalone: true,
  imports: [
    NgIf,
    MobileTableLeavePermitEmployeeComponent,
    DesktopTableLeavePermitEmployeeComponent
  ],
  templateUrl: './table-leave-permit-employee.component.html',
  styleUrl: './table-leave-permit-employee.component.scss'
})
export class TableLeavePermitEmployeeComponent implements OnInit {
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
