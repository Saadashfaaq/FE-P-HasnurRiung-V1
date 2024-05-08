import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, map, startWith, tap } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import { TimelineDialogComponent } from '../../timeline-dialog/timeline-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-table-leave-permit-employee',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
    NgSelectModule,
  ],
  templateUrl: './table-leave-permit-employee.component.html',
  styleUrl: './table-leave-permit-employee.component.scss'
})
export class TableLeavePermitEmployeeComponent {

  private subs = new SubSink();
  employeeId : any
  token : any
  dataSource = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  noData: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  sortValue = null;
  dataCount = 0;
  isReset = false
  dataLoaded = false;
  isWaitingForResponse = false

  constructor(
    private _formLeaveService : FormLeaveService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,
  ){

  }

  applicationFormTypeList = [
    {
      name: 'Cuti',
      value: 'cuti',
    },
    {
      name: 'Ijin',
      value: 'ijin'
    }
  ]
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
      name: 'Selesai',
      value: 'completed',
    },
    {
      name: 'Revisi',
      value: 'revision',
    },
  ]
  pdfStatusList = [
    {
      name:'Disetujui',
      value:true,
    },
    {
      name:'Belum Disetujui',
      value: false,
    }
  ]

  isTicketSupportedList = [
    {
      name: 'Ada',
      value: true,
    },
    {
      name: 'Tidak Ada',
      value: false
    }
  ]

  displayedColumns: string[] = [
    "created_date",
    "application_type",
    "is_ticket_supported",
    "departure_off_day",
    "start_date",
    "field_leave_duration",
    "yearly_leave_duration",
    "permission_duration",
    "compensation_duration",
    "end_date",
    "form_status",
    "pdf_application_form",
    "action",
  ]
  filterCols: string[] = this.displayedColumns.map((col) => `${col}_filter`);

  filteredValue = {
    // created_date: null,
    application_type: null,
    is_ticket_supported: null,
    // departure_off_day: null,
    // start_date: null,
    field_leave_duration: null,
    yearly_leave_duration: null,
    permission_duration: null,
    compensation_duration: null,
    // end_date: null,
    form_status: null,
    pdf_application_form: null
  }
  formControls = {
    created_date_ctrl : new UntypedFormControl(null),
    application_type_ctrl : new UntypedFormControl(null),
    is_ticket_supported_ctrl : new UntypedFormControl(null),
    departure_off_day_ctrl : new UntypedFormControl(null),
    start_date_ctrl : new UntypedFormControl(null),
    field_leave_duration_ctrl : new UntypedFormControl(null),
    yearly_leave_duration_ctrl : new UntypedFormControl(null),
    permission_duration_ctrl : new UntypedFormControl(null),
    compensation_duration_ctrl : new UntypedFormControl(null),
    end_date_ctrl : new UntypedFormControl(null),
    form_status_ctrl : new UntypedFormControl(null),
    pdf_application_form_ctrl : new UntypedFormControl(null)
  }


  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.token = localStorage.getItem('token')
    this.GetAllApplicationFormsEmployee()
    this.initFilter()
    this.SetDatePickerFormat()
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

          }
          this.dataLoaded = true;
        }),
      )
      .subscribe();
  }

  GetAllApplicationFormsEmployee(){
    this.isWaitingForResponse = true
    const pagination = {
      limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      page: this.paginator.pageIndex ? this.paginator.pageIndex : 0,
    };

    const filter = {
      employee_id: this.employeeId,
      ...this.filteredValue
    }

    this.subs.sink = this._formLeaveService.GetAllApplicationFormsEmployee(filter,this.sortValue,pagination)
    .subscribe(
      (resp)=>{
        console.log("RESP", resp)
        if(resp && resp.length){
          this.dataSource.data = resp
          this.paginator.length = resp[0].count_document;
          this.dataCount = resp[0]?.count_document;
          this.isWaitingForResponse = false
        } else {
          this.dataSource.data = [];
          this.paginator.length = 0;
          this.dataCount = 0;
          this.isWaitingForResponse = false
        }
        this.noData = this.dataSource.connect().pipe(map((dataa) => dataa.length === 0));
        this.isReset = false;
      },
    (err)=>{
      console.log(err)
    })

  }

  OpenFormToCreate(){
    this.router.navigate(['/form-leave/preview'])
  }

  OpenPdfApplicationForm(url: string){
    window.open(url, '_blank');
  }

  OpenPDFLeaveLetter(url : string){
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
          return 'Selesai';
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

    OpenDialogTimeline(formId){
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        data:formId,
        width: '600px',
        height: '340px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

    initFilter() {
        Object.keys(this.formControls).forEach((key,index) => {
          const control = this.formControls[key]
          const filteredKey = key.replace('_ctrl', '');

          control.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
            if (key.toLowerCase().includes("date") || key.toLowerCase().includes("departure") ) {
              this.filteredValue[filteredKey] =  value? new Date(value).toISOString() : null;
            } else {
              this.filteredValue[filteredKey] = value ? value : null;
            }

            this.paginator.firstPage();

            if (!this.isReset) {
              this.GetAllApplicationFormsEmployee();
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

}
