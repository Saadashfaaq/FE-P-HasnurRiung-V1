import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, MatIconModule, MatButtonModule, MatDividerModule,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  userName: string = '';
  subs: SubSink = new SubSink();
  notifList;
  employeeId;
  pageTitle

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private _formLeaveService: FormLeaveService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log("NavigationStart", event)
        if (event.url.includes('form-leave')) {
          this.pageTitle = 'Formulir Permohonan Istirahat'
          this.changeDetectorRef.detectChanges();
        } else if (event.url.includes('approval-group')) {
          this.pageTitle = 'Approval Group'
          this.changeDetectorRef.detectChanges();
        } else if (event.url.includes('approval-table')) {
          this.pageTitle = 'Approval'
          this.changeDetectorRef.detectChanges();
        } else if (event.url.includes('permit-leave')) {
          this.pageTitle = 'Tugas Istirahat'
          this.changeDetectorRef.detectChanges();
        }
      }
    });
  }

  employeeName
  employeeNumber
  employeeDepartement

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.employeeName = localStorage.getItem('name');
    this.employeeNumber = localStorage.getItem('employee_number');
    this.employeeDepartement = localStorage.getItem('department');
    this.getAllNotificationList();
  }

  getAllNotificationList() {
    this.subs.sink = this._formLeaveService
      .GetAllNotifications(this.employeeId)
      .subscribe(
        (resp) => {
          this.notifList = resp;
          this.changeDetectorRef.detectChanges();
        },
        (err) => {
          console.error(err);
        }
      );
  }
  openForm(formId, notifId) {
    this.subs.sink = this._formLeaveService
      .UpdateNotification(notifId, true)
      .subscribe((resp) => {
        if (resp) {
          this.getAllNotificationList();
        }
      });
    this.router.navigate([`/form-leave/preview/${formId}`]);
  }
}
