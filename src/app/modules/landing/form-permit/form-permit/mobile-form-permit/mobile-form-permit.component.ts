import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatDatepickerIntl,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import * as _ from 'lodash';
import { Subscription, filter } from 'rxjs';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ApprovalTableDialogComponent } from '../../../approval-page/approval-table-dialog/approval-table-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-mobile-form-permit',
  standalone: true,
  imports: [
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgClass,
    MatProgressSpinnerModule,
  ],
  templateUrl: './mobile-form-permit.component.html',
  styleUrl: './mobile-form-permit.component.scss',
})
export class MobileFormPermitComponent implements OnInit {
  subs: SubSink = new SubSink();
  isPreviewMode: boolean = false;
  routerSubscription: Subscription;
  employeeId: any;
  localStorageUser: string;
  previousPage;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    // private datePipe: DatePipe
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private formPermitService: FormPermitService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  formID: string;
  formData;
  formStatus;
  employeeData;
  approverData;
  minDate: Date = new Date();
  currentApprovers;
  isRevision: boolean = false;
  isRejected: boolean = false;
  reasonText: string = '';
  requesterId: string;

  isEditMode = false;

  isWaitingForResponse: boolean = false;
  permitFormGroup: UntypedFormGroup;

  /**
   * Listen to form index, at 25/05/2024 we have 3 page of from
   */
  formPage: 0 | 1 | 2 = 0;
  formTotalPage: [0, 1] = [0, 1];

  /**
   * Approval Type
   */
  approvalType = [
    {
      value: 'approve',
      icon: 'Check',
      title: 'Setuju',
      description: 'Setujui ST Dinas pemohon',
    },
    {
      value: 'revision',
      icon: 'stylus_note',
      title: 'Revisi',
      description: 'Ajukan Revisi kepada pemohon',
    },
    {
      value: 'cancel',
      icon: 'Close',
      title: 'Tolak',
      description: 'Tolak ST Dinas pemohon',
    },
  ];

  ngOnInit() {
    this.previousPage = localStorage.getItem('previousPage');
    this.SetDatePickerFormat();
    const getParamsEmployeeId = this.route.snapshot.params['employeeId'];
    const getParamsFormId = this.route.snapshot.params['id'];
    this.formID = getParamsFormId;
    this.checkRouterParamsId();

    this.employeeId =
      getParamsEmployeeId !== undefined
        ? getParamsEmployeeId
        : localStorage.getItem('userProfile');
    this.localStorageUser = localStorage.getItem('userProfile');
    if (getParamsEmployeeId !== undefined && getParamsFormId !== undefined) {
      this.isPreviewMode = true;
      this.getOnePermitForm();
    } else {
      this.getOneEmployeeData();
    }
    this.InitPermitFormGroup();
    this.changeDetectorRef.detectChanges();
  }

  SetDatePickerFormat() {
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  getOnePermitForm() {
    this.isWaitingForResponse = true;
    this.subs.sink = this.formPermitService
      .GetOneApplicationForm(this.formID)
      .subscribe((resp) => {
        this.isWaitingForResponse = false;
        if (resp) {
          this.employeeData = _.cloneDeep(resp?.employee_id);
          this.requesterId = resp.employee_id?._id
          this.currentApprovers = resp.current_approvers;
          this.formStatus = resp.form_status;
          if (resp.form_status) {
            if (resp.form_status === 'revision') {
              this.isRevision = true;
              this.reasonText =
                resp.approval[resp.current_approval_index].reason_of_revision;
            } else if (resp.form_status === 'rejected') {
              this.isRejected = true;
              this.reasonText =
                resp.approval[resp.current_approval_index].reason_of_rejection;
            }
          }

          this.permitFormGroup.patchValue({
            start_date_dinas: new Date(
              this.convertDateFormat(resp.work_start_date)
            ).toISOString(),
            end_date_dinas: new Date(
              this.convertDateFormat(resp.work_end_date)
            ).toISOString(),
            name: resp.employee_id.name,
            employee_number: resp.employee_id.employee_number,
            position: resp.employee_id.position?.name,
            department: resp.employee_id.position?.department,
            total_work_days:
              resp.employee_id.position.type === 'staff' ? '56' : '84',
            date_of_eligible_for_leave: new Date(
              this.convertDateFormat(resp.date_of_eligible_for_leave)
            ).toISOString(),
          });
          this.permitFormGroup.get('start_date_dinas').disable();
          this.GetAllApprovalGroups();
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  getOneEmployeeData() {
    this.isWaitingForResponse = true
    this.subs.sink = this.formPermitService
      .GetOneEmployee(this.employeeId)
      .subscribe(
        (resp) => {
          this.employeeData = resp;
          this.InitPermitFormGroup();
          this.GetAllApprovalGroups();
          this.changeDetectorRef.detectChanges();
          this.isWaitingForResponse = false;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  InitPermitFormGroup() {
    this.permitFormGroup = this._formBuilder.group({
      name: {
        value: this.employeeData?.name,
        disabled: true,
      },
      employee_number: {
        value: this.employeeData?.employee_number,
        disabled: true,
      },
      position: {
        value: this.employeeData?.position?.name,
        disabled: true,
      },
      department: {
        value: this.employeeData?.position?.department,
        disabled: true,
      },

      total_work_days: {
        value: this.employeeData?.position?.type === 'staff' ? '56' : '84',
        disabled: true,
      },
      start_date_dinas: ['', [Validators.required]],
      end_date_dinas: {
        value: null,
        disabled: true,
      },
      date_of_eligible_for_leave: {
        value: null,
        disabled: true,
      },
      first_approval: {
        value: null,
        disabled: true,
      },
      second_approval: {
        value: null,
        disabled: true,
      },
    });
  }

  formCondition() {
    this.permitFormGroup.get('total_work_days').disable();
    this.permitFormGroup.get('end_date_dinas').disable();
    this.permitFormGroup.get('first_approval').disable();
    this.permitFormGroup.get('second_approval').disable();
    this.changeDetectorRef.detectChanges();
  }

  GetAllApprovalGroups() {
    this.subs.sink = this.formPermitService.GetAllApprovalGroups().subscribe(
      (resp) => {
        if (resp) {
          const response = resp;
          this.approverData = _.cloneDeep(resp);
          this.permitFormGroup.patchValue({
            first_approval:
              response[0].employee_number + ' - ' + response[0].name,
            second_approval:
              response[1].employee_number + ' - ' + response[1].name,
          });
          this.changeDetectorRef.detectChanges();
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  convertDateFormat(date: string): string {
    // Split the date into parts using "/" as a delimiter
    const parts = date.split('/');

    // Ensure there are exactly three parts (day, month, year)
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected "dd/mm/yyyy".');
    }

    // Rearrange the parts from [day, month, year] to [month, day, year]
    const [day, month, year] = parts;
    const newFormat = `${month}/${day}/${year}`;
    return newFormat;
  }

  calculatePermitDay() {
    const leaveStartDate = new Date(
      this.permitFormGroup.get('start_date_dinas').getRawValue()
    );
    const leaveEndDate = new Date(leaveStartDate);
    const positionTypeNumber =
      this.employeeData?.position?.type === 'staff' ? 56 : 84;
    leaveEndDate.setDate(leaveStartDate.getDate() + positionTypeNumber);
    this.permitFormGroup.get('end_date_dinas').setValue(leaveEndDate);

    const dateForEligible = new Date(leaveStartDate);
    dateForEligible.setDate(dateForEligible.getDate() + positionTypeNumber + 1);
    this.permitFormGroup
      .get('date_of_eligible_for_leave')
      .setValue(dateForEligible);
    this.changeDetectorRef.detectChanges();
  }

  submitForm() {
    // this.isWaitingForResponse = true
    const payload = this.createPayload();

    if (this.isEditMode) {
      (this.subs.sink = this.formPermitService
        .UpdateFormPermit(payload, this.formID)
        .subscribe((resp) => {
          if (resp) {
            this.isWaitingForResponse = false;
            this.router.navigate([this.previousPage]);
          }
        })),
        (err) => {
          console.log(err);
        };
    } else {
      (this.subs.sink = this.formPermitService
        .CreateFormPermit(payload)
        .subscribe((resp) => {
          if (resp) {
            this.isWaitingForResponse = false;
            this.router.navigate([this.previousPage]);
          }
        })),
        (err) => {
          console.log(err);
        };
    }
  }

  InvalidSwal() {
    Swal.fire({
      title: 'Invalid',
      html: 'Mohon Isi Kolom Yang Berwarna Merah',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    });
  }

  createPayload() {
    const startDate = new Date(
      this.permitFormGroup.get('start_date_dinas').getRawValue()
    );
    const endDate = new Date(
      this.permitFormGroup.get('end_date_dinas').getRawValue()
    );
    const eligibleDate = new Date(
      this.permitFormGroup.get('date_of_eligible_for_leave').getRawValue()
    );

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const formattedeligibleDate = this.formatDate(eligibleDate);

    return {
      employee_id: this.employeeId,
      work_start_date: formattedStartDate,
      work_end_date: formattedEndDate,
      date_of_eligible_for_leave: formattedeligibleDate,
      letter_type: 'work',
    };
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  CancelCreateForm() {
    Swal.fire({
      title: 'Batalkan Form',
      html: 'Apa Anda Yakin Ingin Membatalkan?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Iya',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.router.navigate([this.previousPage]);
      } else {
        return;
      }
    });
  }

  backToPreviousForm() {
    this.formPage--;
    this.changeDetectorRef.detectChanges();
  }

  nextForm() {
    if (this.permitFormGroup?.invalid) {
      this.permitFormGroup.get('start_date_dinas').markAsTouched();
      this.InvalidSwal();
      return;
    }
    this.formPage++;
    this.changeDetectorRef.detectChanges();
  }

  edit() {
    this.isPreviewMode = false;
    this.isEditMode = true;

    this.permitFormGroup.get('start_date_dinas').enable();
  }

  OpenDialogApproval(order: string) {
    if (order === 'approve') {
      this.ApproveForm();
    } else {
      const dialogRef = this.dialog.open(ApprovalTableDialogComponent, {
        data: {
          order: order,
          formID: this.formID,
        },
        width: '600px',
        height: '340px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }

  ApproveForm() {
    // this.isWaitingForResponse = true
    Swal.fire({
      title: 'Apakah Anda yakin untuk Menyetujui permohonan?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Iya',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.SendApproveForm(this.formID);
      } else {
        return;
      }
    });
  }

  SendApproveForm(id: string) {
    const approver = {
      approval_status: 'approved',
      approver_id: this.localStorageUser,
    };
    this.subs.sink = this.formPermitService
      .UpdateApprovalApplicationForm(id, approver)
      .subscribe(
        (resp) => {
          if (resp) {
            this.isWaitingForResponse = false;
            Swal.fire({
              title: 'Permohonan Disetujui',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              allowEnterKey: false,
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonText: 'Iya',
            }).then(() => {
              this.router.navigate([this.previousPage]);
            });
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ButtonApproveCondition(): boolean {
    if (this.currentApprovers) {
      const isApprover = this.currentApprovers.some((approver) => {
        if (approver._id === this.localStorageUser) {
          return true;
        } else {
          return false;
        }
      });
      return isApprover;
    }
    return false; // Menyesuaikan untuk mengembalikan false jika tidak ada approvers
  }

  checkRouterParamsId() {
    // Check for NavigationStart events and compare the ID
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        // Retrieve the new ID from the URL
        const newFormId = this.getFormIdFromUrl(event.url);

        // Check if the ID has changed
        if (this.formID && newFormId !== this.formID) {
          this.formID = newFormId;
          this.getOnePermitForm();
        }
      });
  }

  editCondition() : boolean{
    if(this.formStatus === 'revision' && this.requesterId === this.localStorageUser){
      return true
    } else if (this.formStatus === 'waiting_for_approval_1' && this.requesterId === this.localStorageUser){
      return true
    } else {
      return false;
    }
  }

  backPreviousPage() {
    this.router.navigate([this.previousPage]);
  }

  getFormIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
