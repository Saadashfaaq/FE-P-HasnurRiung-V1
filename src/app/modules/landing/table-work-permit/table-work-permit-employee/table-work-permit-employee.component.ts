import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { DesktopTableWorkPermitEmployeeComponent } from './desktop-table-work-permit-employee/desktop-table-work-permit-employee.component';
import { MobileTableWorkPermitEmployeeComponent } from './mobile-table-work-permit-employee/mobile-table-work-permit-employee.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-table-work-permit-employee',
  standalone: true,
  imports: [
    NgIf,
    DesktopTableWorkPermitEmployeeComponent,
    MobileTableWorkPermitEmployeeComponent
  ],
  templateUrl: './table-work-permit-employee.component.html',
  styleUrl: './table-work-permit-employee.component.scss',
})
export class TableWorkPermitEmployeeComponent implements OnInit {
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
