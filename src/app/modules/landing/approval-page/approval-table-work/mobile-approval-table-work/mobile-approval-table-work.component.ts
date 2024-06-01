import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { UserCardComponent } from '../../../../shared/user-card/user-card.component';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { TimelineDialogComponent } from '../../../timeline-dialog/timeline-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mobile-approval-table-work',
  standalone: true,
  templateUrl: './mobile-approval-table-work.component.html',
  styleUrl: './mobile-approval-table-work.component.scss',
  imports: [
    NgFor,
    UserCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
})
export class MobileApprovalTableWorkComponent {
  private subs = new SubSink();
  employeeId: any;
  isReset = false;

  formList;

  startDateCtrl: UntypedFormControl;
  endDateCtrl: UntypedFormControl;
  isWaitingForResponse;

  constructor(
    private formPermitService: FormPermitService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  filteredValue = {
    work_start_date: null,
    work_end_date: null,
  };

  formControls = {
    work_start_date_ctrl: new UntypedFormControl(null),
    work_end_date_ctrl: new UntypedFormControl(null),
  };

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.GetAllApplicationForms();
    this.SetDatePickerFormat();
  }

  SetDatePickerFormat() {
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  GetAllApplicationForms() {
    const filter = {
      employee_id: this.employeeId,
      is_for_approval: true,
      letter_type: 'work',
      ...this.filteredValue,
    };

    this.subs.sink = this.formPermitService
      .GetAllApplicationForms(filter)
      .subscribe(
        (resp) => {
          if (resp && resp.length) {
            this.formList = _.cloneDeep(resp);
          } else {
            this.formList = [];
          }
          this.isReset = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  OpenFormToCreate() {
    this.router.navigate(['/form-leave/preview']);
  }

  OpenPdfApplicationForm(url: string) {
    window.open(url, '_blank');
  }

  OpenPDFLeaveLetter(url: string) {
    window.open(url, '_blank');
  }

  // Fungsi untuk mendapatkan warna sesuai dengan status
  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting_for_approval_1':
      case 'waiting_for_approval_2':
      case 'waiting_for_approval_3':
      case 'waiting_for_approval_4':
      case 'waiting_for_approval_5':
      case 'waiting_for_approval':
        return '#ffa000'; // kuning keemasan
      case 'rejected':
        return '#ff0100'; // merah
      case 'completed':
      case 'approved':
        return '#01BA6D'; // hijau
      case 'cancelled':
        return '#ff0100'; // merah
      case 'revision':
        return '#fffe00'; // kuning cerah
      default:
        return '#000000'; // hitam jika status tidak diketahui
    }
  }

  // Fungsi untuk mendapatkan teks tooltip sesuai dengan status
  getStatusTooltip(status: string): string {
    switch (status) {
      case 'waiting_for_approval_1':
        return 'Menunggu Persetujuan 1';
      case 'waiting_for_approval_2':
        return 'Menunggu Persetujuan 2';
      case 'waiting_for_approval_3':
        return 'Menunggu Persetujuan 3';
      case 'waiting_for_approval_4':
        return 'Menunggu Persetujuan 4';
      case 'waiting_for_approval_5':
        return 'Menunggu Persetujuan 5';
      case 'rejected':
        return 'Ditolak';
      case 'completed':
        return 'Disetujui';
      case 'approved':
        return 'Disetujui';
      case 'cancelled':
        return 'Dibatalkan';
      case 'revision':
        return 'Perlu Revisi';
      default:
        return 'Status Tidak Diketahui';
    }
  }

  OpenDialogTimeline(formId) {
    const dialogRef = this.dialog.open(TimelineDialogComponent, {
      data: formId,
      width: '1100px',
      height: '540px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  resetTable(from?: string) {
    //resetTable(from?: string) {
    this.isReset = true;
    // Loop through the keys in formControls object
    for (const key in this.formControls) {
      // Check if the key is a property of formControls
      if (this.formControls.hasOwnProperty(key)) {
        // Set the value of each control to null
        this.formControls[key].setValue(null, { emitEvent: false });
      }
    }

    // *************** Fetch the table again if from table
    if (from === 'table') {
      this.GetAllApplicationForms();
    }

    this.isReset = false;
    this._changeDetectorRef.detectChanges();
  }

  PohConfigReturn(resp) {
    if (resp === 'lokal') {
      return `LOKAL`;
    } else if (resp === 'non_lokal') {
      return `NON LOKAL`;
    } else if (resp === 'non_lokal_perumahan') {
      return `NON LOKAL PERUMAHAN`;
    } else {
      return null;
    }
  }

  OpenFormToPreview(formId, employeeId) {
    localStorage.setItem('previousPage', '/permit-work');
    this.router.navigate([`/form-permit/preview/${formId}/${employeeId}`]);
  }

  /**
   * Sweet Alert Functionality
   */
  swalConfirmation(title: string, message: string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'IYA',
      showCancelButton: true,
      cancelButtonText: 'TIDAK',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
  }
}
