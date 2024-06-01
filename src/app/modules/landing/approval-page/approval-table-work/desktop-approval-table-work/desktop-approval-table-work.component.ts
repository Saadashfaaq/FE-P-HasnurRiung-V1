import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { debounceTime, map, startWith, tap } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import Swal from 'sweetalert2';
import * as _ from 'lodash';
import { TimelineDialogComponent } from '../../../timeline-dialog/timeline-dialog.component';

@Component({
  selector: 'app-desktop-approval-table-work',
  standalone: true,
  imports: [SharedModule, MatIconModule, NgSelectModule],
  templateUrl: './desktop-approval-table-work.component.html',
  styleUrl: './desktop-approval-table-work.component.scss'
})
export class DesktopApprovalTableWorkComponent {
  private subs = new SubSink();
  employeeId: any;
  token: any;
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  noData: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sortValue = null;
  dataCount = 0;
  isReset = false;
  dataLoaded = false;

  isWaitingForResponse;

  isCheckedAll = false;
  disabledExport = true;
  selectType: any;
  dataSelected = [];
  dataSelectedId = [];
  dataUnselect = [];
  clickedActionButton: string | null = null;
  allStudentForCheckbox = [];
  allStudentsData = [];
  allStudentsEmail = [];
  pageSelected = [];

  constructor(
    private formPermitService: FormPermitService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  pohStatusList = [
    {
      name: 'Lokal',
      value: 'lokal',
    },
    {
      name: 'Non Lokal',
      value: 'non_lokal',
    },
    {
      name: 'Non Lokal Perumahan',
      value: 'non_lokal_perumahan',
    },
  ];

  positionType = [
    {
      name: 'Staff',
      value: 'staff',
    },
    {
      name: 'Non Staff',
      value: 'non_staff',
    },
  ];

  familyStatus = [
    { name: 'K/0', value: 'K0' },
    { name: 'K/1', value: 'K1' },
    { name: 'K/2', value: 'K2' },
    { name: 'K/3', value: 'K3' },
    { name: 'TK/0', value: 'TK0' },
    { name: 'TK/1', value: 'TK1' },
    { name: 'TK/2', value: 'TK2' },
    { name: 'TK/3', value: 'TK3' },
  ];

  workDuration = [
    { name: '84', value: '84' },
    { name: '56', value: '56' },
  ];

  formStatusList = [
    {
      name: 'Menunggu Persetujuan 1',
      value: 'waiting_for_approval_1',
    },
    {
      name: 'Menunggu Persetujuan 2',
      value: 'waiting_for_approval_2',
    },
    {
      name: 'Menunggu Persetujuan 3',
      value: 'waiting_for_approval_3',
    },
    {
      name: 'Menunggu Persetujuan 4',
      value: 'waiting_for_approval_4',
    },
    {
      name: 'Menunggu Persetujuan 5',
      value: 'waiting_for_approval_5',
    },
    {
      name: 'Ditolak',
      value: 'rejected',
    },
    {
      name: 'Disetujui',
      value: 'completed',
    },
    {
      name: 'Revisi',
      value: 'revision',
    },
  ];

  displayedColumns: string[] = [
    'checkbox',
    'work_letter_number',
    'work_letter_month',
    'work_letter_year',
    'employee_number',
    'employee_name',
    'position',
    'position_type',
    'department',
    'family_status',
    'registration_date',
    'work_start_date',
    'work_duration',
    'work_end_date',
    'leave_eligible_date',
    'work_letter_date_of_approval',
    'form_status',
    'action',
  ];
  filterCols: string[] = this.displayedColumns.map((col) => `${col}_filter`);

  filteredValue = {
    work_letter_number: null,
    work_letter_month: null,
    work_letter_year: null,
    employee_number: null,
    employee_name: null,
    position: null,
    position_type: null,
    department: null,
    family_status: null,
    registration_date: null,
    work_start_date: null,
    work_duration: null,
    work_end_date: null,
    leave_eligible_date: null,
    work_letter_date_of_approval: null,
    form_status: null,
  };

  formControls = {
    work_letter_number_ctrl: new UntypedFormControl(null),
    work_letter_month_ctrl: new UntypedFormControl(null),
    work_letter_year_ctrl: new UntypedFormControl(null),
    employee_number_ctrl: new UntypedFormControl(null),
    employee_name_ctrl: new UntypedFormControl(null),
    position_ctrl: new UntypedFormControl(null),
    position_type_ctrl: new UntypedFormControl(null),
    department_ctrl: new UntypedFormControl(null),
    family_status_ctrl: new UntypedFormControl(null),
    registration_date_ctrl: new UntypedFormControl(null),
    work_start_date_ctrl: new UntypedFormControl(null),
    work_duration_ctrl: new UntypedFormControl(null),
    work_end_date_ctrl: new UntypedFormControl(null),
    leave_eligible_date_ctrl: new UntypedFormControl(null),
    work_letter_date_of_approval_ctrl: new UntypedFormControl(null),
    form_status_ctrl: new UntypedFormControl(null),
  };

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.token = localStorage.getItem('token');
    this.GetAllApplicationForms();
    this.initFilter();
    this.SetDatePickerFormat();
  }

  SetDatePickerFormat() {
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  ngAfterViewInit(): void {
    this.subs.sink = this.paginator.page
      .pipe(
        startWith(null),
        tap(() => {
          if (!this.isReset) {
            this.GetAllApplicationForms();
          }
          this.dataLoaded = true;
        })
      )
      .subscribe();
  }

  GetAllApplicationForms() {
    const pagination = {
      limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      page: this.paginator.pageIndex ? this.paginator.pageIndex : 0,
    };

    const filter = {
      employee_id: this.employeeId,
      is_for_approval: true,
      letter_type: 'work',
      ...this.filteredValue,
    };

    this.subs.sink = this.formPermitService
      .GetAllApplicationForms(filter, this.sortValue, pagination)
      .subscribe(
        (resp) => {
          if (resp && resp.length) {
            this.dataSource.data = resp;
            this.paginator.length = resp[0].count_document;
            this.dataCount = resp[0]?.count_document;
          } else {
            this.dataSource.data = [];
            this.paginator.length = 0;
            this.dataCount = 0;
          }
          this.noData = this.dataSource
            .connect()
            .pipe(map((dataa) => dataa.length === 0));
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

  initFilter() {
    Object.keys(this.formControls).forEach((key, index) => {
      const control = this.formControls[key];
      const filteredKey = key.replace('_ctrl', '');

      control.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
        if (
          key.toLowerCase().includes('date') ||
          key.toLowerCase().includes('departure')
        ) {
          this.filteredValue[filteredKey] = value
            ? new Date(value).toISOString()
            : null;
        } else {
          this.filteredValue[filteredKey] = value ? value : null;
        }
        this.paginator.firstPage();
        if (!this.isReset) {
          this.GetAllApplicationForms();
        }
      });
    });
  }

  // Regex Input For Numeric
  preventNonNumericalInput(event) {
    if (event && event.key) {
      if (!event.key.match(/^[0-9]+$/)) {
        event.preventDefault();
      }
    }
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

    // *************** Reset Paginator
    this.paginator.pageIndex = 0;

    // *************** Reset Selection
    this.selection.clear();
    this.dataSelected = [];
    this.dataUnselect = [];
    this.isCheckedAll = false;

    // *************** Reset Sorting
    this.sortValue = null;
    this.sort.active = null;
    this.sort.direction = null;
    this.sort.sort({ id: 'created_date', start: 'desc', disableClear: false });

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

  onSort(sort: Sort) {
    if (sort.active && sort.direction) {
      if (this.sortValue && this.sortValue[sort.active] === sort.direction) {
        this.sortValue[sort.active] = sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortValue = { [sort.active]: sort.direction };
      }
    } else {
      this.sortValue = null;
    }

    if (this.dataLoaded) {
      this.paginator.pageIndex = 0;
      if (!this.isReset) {
        this.GetAllApplicationForms();
      }
    }
  }

  // getDataAllForCheckbox(pageNumber) {
  //   const pagination = {
  //     limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
  //     page: this.paginator.pageIndex ? this.paginator.pageIndex : 0,
  //   };

  //   const filter = {
  //     employee_id: this.employeeId,
  //     is_for_approval: true,
  //     letter_type: 'work',
  //     ...this.filteredValue
  //   }
  //   // const userTypesList = this.currentUser && this.currentUser.app_data ? this.currentUser.app_data.user_type_id : [];
  //   this.isWaitingForResponse = true;
  //   this.subs.sink = this.formPermitService.GetAllApplicationForms(filter,this.sortValue,pagination).subscribe(
  //     (students: any) => {
  //       if (students && students.length) {
  //         this.allStudentForCheckbox.push(...students);
  //         const page = pageNumber + 1;
  //         this.getDataAllForCheckbox(page);
  //       } else {
  //         this.isWaitingForResponse = false;
  //         if (this.isCheckedAll) {
  //           if (this.allStudentForCheckbox && this.allStudentForCheckbox.length) {
  //             this.allStudentForCheckbox.forEach((element) => {
  //               this.selection.select(element._id);
  //               this.dataSelected.push(element);
  //             });
  //           }
  //           this.pageSelected.push(this.paginator.pageIndex);
  //         } else {
  //           this.pageSelected = [];
  //         }
  //       }
  //     },
  //     (error) => {
  //       this.isReset = false;
  //       this.isWaitingForResponse = false;
  //     },
  //   );
  // }

  getAllStudentsForOneTimeForm(page: number) {
    const pagination = {
      limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      page: this.paginator.pageIndex ? this.paginator.pageIndex : 0,
    };

    const filter = {
      employee_id: this.employeeId,
      is_for_approval: true,
      letter_type: 'work',
      ...this.filteredValue,
    };
    // const userTypesList = this.currentUser && this.currentUser.app_data ? this.currentUser.app_data.user_type_id : [];
    this.isWaitingForResponse = true;

    if (this.isCheckedAll) {
      if (page === 0) {
        this.dataSelected = [];
      }
      // this.isLoading = true
      this.subs.sink = this.formPermitService
        .GetAllApplicationForms(filter, this.sortValue, pagination)
        .subscribe(
          (data: any) => {
            if (data && data.length && data.length > 0) {
              this.dataSelected.push(...data);
              this.getAllStudentsForOneTimeForm(page + 1);
            } else {
              // this.isLoading = false;
              if (
                this.isCheckedAll &&
                this.dataSelected &&
                this.dataSelected.length
              ) {
                this.dataSelected = this.dataSelected.filter(
                  (item) => !this.dataUnselect.includes(item._id)
                );
                if (this.dataSelected && this.dataSelected.length) {
                  // this.openOneTimeFormDialog(this.isCheckedAll);
                }
              }
            }
          },
          (err: any) => {}
        );
    } else {
      // this.openOneTimeFormDialog();
    }
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

  /**
   * Funtionality to delete approval
   */
  deleteApproval(approvalForm?: any, from?: string) {
    this.swalConfirmation(
      'Apakah Anda yakin ingin menghapus permohonan?',
      `Permohonan yang Anda hapus tidak akan ditampilkan kembali`
    ).then((resp) => {
      if (resp?.isConfirmed) {
        // *************** Filter for delete application form
        const filter = {
          employee_id: this.employeeId,
          is_for_approval: true,
          letter_type: 'work',
        };

        // *************** Pagination for delete application form
        const pagination = {
          limit: 10,
          page: 0,
        };

        // *************** formIds for delete application form
        const formIds =
          from === 'table' ? [approvalForm?._id] : this.dataSelected;
        this.isWaitingForResponse = true;
        this.subs.sink = this.formPermitService
          ?.DeleteApplicationForm(
            filter,
            pagination,
            this.isCheckedAll,
            formIds,
            this.dataUnselect
          )
          .subscribe({
            next: (form) => {
              this.isWaitingForResponse = false;
              this.resetTable();
              this.dataSource.data = _.cloneDeep(form);
            },
            error: (err) => {
              this.isWaitingForResponse = false;
            },
          });
      }
    });
  }

  /**
   * Functionality for selection table
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return this.isCheckedAll
      ? true
      : numSelected === numRows || numSelected > numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataUnselect = [];
      this.dataSelected = [];
      this.isCheckedAll = false;
    } else {
      this.selection.clear();
      this.dataUnselect = [];
      this.dataSelected = [];
      this.isCheckedAll = true;
      this.dataSource.data.forEach((row) => this.selection.toggle(row?._id));
    }
  }

  showOptions(row?) {
    if (this.isCheckedAll) {
      if (row) {
        if (!this.dataUnselect.includes(row?._id)) {
          this.dataUnselect.push(row?._id);
          this.selection.deselect(row?._id);
          if (this.dataUnselect?.length === this.dataCount) {
            this.isCheckedAll = false;
            this.dataUnselect = [];
          }
        } else {
          const indx = this.dataUnselect.findIndex((list) => list === row?._id);
          this.dataUnselect.splice(indx, 1);
          this.selection.select(row?._id);
        }
      }
    } else {
      if (row) {
        if (this.dataSelected && this.dataSelected.length) {
          const dataFilter = this.dataSelected.filter(
            (resp) => resp === row._id
          );
          if (dataFilter && dataFilter.length < 1) {
            this.dataSelected.push(row?._id);
          } else {
            const indexFilter = this.dataSelected.findIndex(
              (resp) => resp === row._id
            );
            this.dataSelected.splice(indexFilter, 1);
          }
        } else {
          this.dataSelected.push(row?._id);
        }
      }
    }
  }

  /**
   * Export functionality
   */
  exportAppllicationForm() {
    this.subs.sink = this.formPermitService
      .ExportAppllicationForm('work')
      .subscribe();
  }
  exportEmployeeAsTemplate() {
    this.subs.sink = this.formPermitService
      .ExportEmployeeAsTemplate()
      .subscribe();
  }
}
