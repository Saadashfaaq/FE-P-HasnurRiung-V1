import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
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
import Swal from 'sweetalert2';

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
      name: 'Disetujui',
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

  travelDurationList = [
    {
      value: true,
      name: "YA"
    },
    {
      value: false,
      name: "TIDAK"
    }
  ]

  displayedColumns: string[] = [
    "none",
    "created_date",
    "application_type",
    "is_ticket_supported",
    "departure_off_day",
    "start_date",
    "field_leave_duration",
    "yearly_leave_duration",
    "travel_duration",
    "permission_duration",
    "compensation_duration",
    "total_leaves",
    "end_date",
    "work_start_date",
    "form_status",
    "pdf_application_form",
    "action",
  ]
  filterCols: string[] = this.displayedColumns.map((col) => `${col}_filter`);

  filteredValue = {
    created_date: null,
    application_type: null,
    is_ticket_supported: null,
    departure_off_day: null,
    start_date: null,
    field_leave_duration: null,
    yearly_leave_duration: null,
    travel_duration: null,
    permission_duration: null,
    compensation_duration: null,
    total_leaves: null,
    end_date: null,
    form_status: null,
    work_start_date: null,
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
    travel_duration_ctrl: new UntypedFormControl(null),
    permission_duration_ctrl : new UntypedFormControl(null),
    compensation_duration_ctrl : new UntypedFormControl(null),
    total_leaves_ctrl : new UntypedFormControl(null),
    end_date_ctrl : new UntypedFormControl(null),
    form_status_ctrl : new UntypedFormControl(null),
    work_start_date_ctrl: new UntypedFormControl(null),
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
    this._locale = 'id-ID';
    this._adapter.setLocale(this._locale);
  }


  ngAfterViewInit(): void {
    this.subs.sink = this.paginator.page
      .pipe(
        startWith(null),
        tap(() => {
          if (!this.isReset) {
            this.GetAllApplicationFormsEmployee()
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
      letter_type: 'leave',
      ...this.filteredValue
    }

    this.subs.sink = this._formLeaveService.GetAllApplicationFormsEmployee(filter,this.sortValue,pagination)
    .subscribe(
      (resp)=>{
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
  //  const formType = 'leave'
  //   this.subs.sink = this._formLeaveService.CheckEmployeeApplicationForm(this.employeeId,formType)
  //   .subscribe(
  //     (resp : any)=>{
  //       if(resp){
  //         localStorage.setItem("previousPage", '/permit-leave')
  //         this.router.navigate(['/form-leave'])
  //       } else {
  //         this.InvalidSwal()
  //       }
  //     }
  //   )
  localStorage.setItem("previousPage", '/permit-leave')
  this.router.navigate(['/form-leave'])
  }

  InvalidSwal(){
    Swal.fire({
      title: 'Permohonan terakhir Anda saat ini sedang dalam proses pengajuan.',
      html: 'Silakan selesaikan permohonan Anda terlebih dahulu.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText:'Saya Mengerti',
    })
  }

  OpenFormToPreview(formId, employeeId){
    localStorage.setItem("previousPage", '/permit-leave')
    this.router.navigate([`/form-leave/preview/${formId}/${employeeId}`])
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


    OpenDialogTimeline(formId){
      const dialogRef = this.dialog.open(TimelineDialogComponent, {
        data:formId,
        width: '1100px',
        height: '540px',
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
            } else if(key.toLowerCase().includes("is_ticket_supported") || key.toLowerCase().includes("travel_duration") ){
              this.filteredValue[filteredKey] = value === false? false : true;
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

  // onSort(sort: Sort) {
  //   this.sortValue = sort.active ? { [sort.active]: sort.direction ? sort.direction : 'asc' } : null;
  //   if (this.dataLoaded) {
  //     this.paginator.pageIndex = 0;
  //     if (!this.isReset) {
  //       this.GetAllApplicationFormsEmployee()
  //     }
  //   }
  // }

  onSort(sort: Sort) {
    console.log("SORT", sort);
    console.log(this.sortValue);

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
        this.GetAllApplicationFormsEmployee()
      }
    }
  }

  InvalidSwalPdf() {
    Swal.fire({
      title: 'PDF Permohonan sedang dalam proses',
      html: 'Silakan untuk menunggu beberapa saat dan muat ulang halaman browser Anda',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    });
  }


}
