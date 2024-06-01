import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import { UserCardComponent } from '../../../../shared/user-card/user-card.component';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mobile-table-leave-permit-employee',
  standalone: true,
  templateUrl: './mobile-table-leave-permit-employee.component.html',
  styleUrl: './mobile-table-leave-permit-employee.component.scss',
  imports: [
    NgFor,
    UserCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
})
export class MobileTableLeavePermitEmployeeComponent {
  private subs = new SubSink();
  employeeId: any;
  isReset = false;
  isWaitingForResponse = false;

  formList: any;

  startDateCtrl: UntypedFormControl;
  endDateCtrl: UntypedFormControl;

  constructor(
    private _formLeaveService: FormLeaveService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>
  ) {}

  filteredValue = {
    start_date: null,
    end_date: null,
  };
  formControls = {
    created_date_ctrl: new UntypedFormControl(null),
    start_date_ctrl: new UntypedFormControl(null),
    end_date_ctrl: new UntypedFormControl(null),
  };

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.GetAllApplicationFormsEmployee();
    this.SetDatePickerFormat();
  }

  SetDatePickerFormat() {
    this._locale = 'id-ID';
    this._adapter.setLocale(this._locale);
  }

  GetAllApplicationFormsEmployee() {
    this.isWaitingForResponse = true;

    const filter = {
      employee_id: this.employeeId,
      letter_type: 'leave',
      ...this.filteredValue,
    };

    this.subs.sink = this._formLeaveService
      .GetAllApplicationFormsEmployee(filter)
      .subscribe(
        (resp) => {
          if (resp && resp.length) {
            this.formList = _.cloneDeep(resp);
            this.isWaitingForResponse = false;
          } else {
            this.formList = _.cloneDeep(resp);
            this.isWaitingForResponse = false;
          }
          this.isReset = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  OpenFormToPreview(formId, employeeId) {
    localStorage.setItem('previousPage', '/permit-leave');
    this.router.navigate([`/form-leave/preview/${formId}/${employeeId}`]);
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

  OpenFormToCreate() {
    const formType = 'leave';
    this.subs.sink = this._formLeaveService
      .CheckEmployeeApplicationForm(this.employeeId, formType)
      .subscribe((resp: any) => {
        if (resp) {
          localStorage.setItem('previousPage', '/permit-leave');
          this.router.navigate(['/form-leave']);
        } else {
          this.InvalidSwal();
        }
      });
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
}
