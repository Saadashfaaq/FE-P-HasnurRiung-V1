import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { startWith, tap, debounceTime, map } from 'rxjs';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { TimelineDialogComponent } from '../../../timeline-dialog/timeline-dialog.component';
import { UserCardComponent } from 'src/app/modules/shared/user-card/user-card.component';
import { NgFor } from '@angular/common';
import * as _ from 'lodash';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
    selector: 'app-mobile-table-work-permit-employee',
    standalone: true,
    templateUrl: './mobile-table-work-permit-employee.component.html',
    styleUrl: './mobile-table-work-permit-employee.component.scss',
    imports: [UserCardComponent, NgFor, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule]
})
export class MobileTableWorkPermitEmployeeComponent implements OnInit {
  private subs = new SubSink();
  employeeId: any;
  isReset = false;
  isWaitingForResponse = false;

  formList;

  startDateCtrl: UntypedFormControl;
  endDateCtrl: UntypedFormControl;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,
    private formPermitService: FormPermitService
  ) {}

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.GetAllApplicationFormsEmployee();
    this.initFilter();
    this.SetDatePickerFormat();
  }

  displayedColumns: string[] = [
    'none',
    'work_letter_number',
    'work_letter_month',
    'work_letter_year',
    'work_start_date',
    'work_end_date',
    'form_status',
    'action',
  ];
  filterCols: string[] = this.displayedColumns.map((col) => `${col}_filter`);
  formControls = {
    work_start_date_ctrl: new UntypedFormControl(null),
    work_end_date_ctrl: new UntypedFormControl(null),
  };

  filteredValue = {
    work_start_date: null,
    work_end_date: null,
  };

  SetDatePickerFormat() {
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  initFilter() {
    this
  }

  GetAllApplicationFormsEmployee() {
    this.isWaitingForResponse = true;

    const filter = {
      employee_id: this.employeeId,
      letter_type: 'work',
      ...this.filteredValue,
    };

    this.subs.sink = this.formPermitService
      .GetAllApplicationFormsEmployee(filter)
      .subscribe(
        (resp) => {
          if (resp && resp.length) {
            this.formList = _.cloneDeep(resp);
            this.isWaitingForResponse = false;
          } else {
            this.formList = [];
            this.isWaitingForResponse = false;
          }
          this.isReset = false;
        },
        (err) => {
          console.log(err);
        }
      );
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

  resetTable() {
    // Loop through the keys in formControls object
    for (const key in this.formControls) {
      // Check if the key is a property of formControls
      if (this.formControls.hasOwnProperty(key)) {
        // Set the value of each control to null
        this.formControls[key].setValue(null);
      }
    }
  }

  InvalidSwal() {
    Swal.fire({
      title: 'Permohonan terakhir Anda saat ini sedang dalam proses pengajuan.',
      html: 'Silakan selesaikan permohonan Anda terlebih dahulu.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Saya Mengerti',
    });
  }

  OpenPdfApplicationForm(url: string) {
    window.open(url, '_blank');
  }

  OpenPDFLeaveLetter(url: string) {
    window.open(url, '_blank');
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

  OpenFormToPreview(formId, employeeId) {
    localStorage.setItem('previousPage', '/permit-work');
    this.router.navigate([`/form-permit/preview/${formId}/${employeeId}`]);
  }

  OpenFormToCreate() {
    const formType = 'work';
    this.subs.sink = this.formPermitService
      .CheckEmployeeApplicationForm(this.employeeId, formType)
      .subscribe((resp: any) => {
        if (resp) {
          localStorage.setItem('previousPage', '/permit-work');
          this.router.navigate(['/form-permit']);
        } else {
          this.InvalidSwal();
        }
      });
  }
}
