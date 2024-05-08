import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  userName: string = '';
  subs: SubSink = new SubSink();
  notifList;
  employeeId;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private _formLeaveService: FormLeaveService
  ) {}

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
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
