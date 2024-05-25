import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from 'src/app/services/user/user.service';

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
  profilePicture
  notificationCount: number = 5;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private _formLeaveService: FormLeaveService,
    private _userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          if (event.url.includes('form-leave')) {
            this.pageTitle = 'Formulir ST Istirahat'
            this.changeDetectorRef.detectChanges();
          } else if (event.url.includes('approval-group')) {
            this.pageTitle = 'Approval Group'
            this.changeDetectorRef.detectChanges();
          } else if (event.url === '/approval-table') {
            this.pageTitle = 'Approval ST Istirahat'
            this.changeDetectorRef.detectChanges();
          } else if (event.url.includes('approval-table/work')) {
            this.pageTitle = 'Approval ST Dinas'
            this.changeDetectorRef.detectChanges();
          } else if (event.url.includes('permit-leave')) {
            this.pageTitle = 'ST Istirahat'
            this.changeDetectorRef.detectChanges();
          } else if (event.url.includes('permit-work')){
            this.pageTitle = 'ST Dinas'
            this.changeDetectorRef.detectChanges();
          } else if (event.url.includes('form-work')){
            this.pageTitle = 'Formulir ST Dinas'
            this.changeDetectorRef.detectChanges();
          } else if (event.url.includes('data-validation')){
            this.pageTitle = 'barcode'
            this.changeDetectorRef.detectChanges();
          }
      }
    });
  }

  employeeName
  employeeNumber
  employeeDepartement
  employeeData

  ngOnInit(): void {
    this.pageTitle = 'ST Istirahat'
    this.employeeData =  JSON.parse(localStorage.getItem('userData'))
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
          // console.error(err);
        }
      );
  }
  openForm(formId, notifId, employeeId, letterType) {
    this.subs.sink = this._formLeaveService
      .UpdateNotification(notifId, true)
      .subscribe((resp) => {
        if (resp) {
          this.getAllNotificationList();
        }
      });
    if(letterType === 'work'){
      localStorage.setItem("previousPage", '/approval-table/work')
      this.router.navigate([`/form-permit/preview/${formId}/${employeeId}`]);
      setTimeout(() => {
        location.reload()
      }, 100);

    } else {
      localStorage.setItem("previousPage", '/approval-table')
      this.router.navigate([`/form-leave/preview/${formId}/${employeeId}`]);
      setTimeout(() => {
        location.reload()
      }, 100);
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validExtensions.includes(file.type)) {
        alert('Invalid file type. Only JPEG, JPG, and PNG files are allowed.');
        return;
      }


      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const payload = base64String
        console.log("hallo",payload )
        this.updateProfilePicture(payload);
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfilePicture(payload): void {
    console.log("this.employeeData.employee_id", this.employeeData)
    this.subs.sink = this._userService.UpdateEmployee(payload, this.employeeData._id).subscribe(
      (resp: any) => {
        if (resp && resp.profilePictureUrl) {
          this.profilePicture = resp.profilePictureUrl; // Assuming the response contains the URL of the updated profile picture
          console.log('Profile updated successfully:', resp);
        }
      },
      (error: any) => {
        console.error('Error updating profile:', error);
      }
    );
  }


  checkingConditonForUnfoundedDataNotif():boolean{
     if(this.notifList?.length){
      return false
    }
    return true
  }

}
