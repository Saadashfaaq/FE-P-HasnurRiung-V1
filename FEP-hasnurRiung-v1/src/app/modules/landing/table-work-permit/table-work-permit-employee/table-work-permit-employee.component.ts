import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { debounceTime, map } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import { SubSink } from 'subsink';
import { TimelineDialogComponent } from '../../timeline-dialog/timeline-dialog.component';

@Component({
  selector: 'app-table-work-permit-employee',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
    NgSelectModule,
  ],
  templateUrl: './table-work-permit-employee.component.html',
  styleUrl: './table-work-permit-employee.component.scss'
})
export class TableWorkPermitEmployeeComponent implements OnInit {

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
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,
    private formPermitService : FormPermitService
  ){

  }
  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.token = localStorage.getItem('token')
    this.GetAllApplicationFormsEmployee()
    this.initFilter()
    this.SetDatePickerFormat()
  }

  displayedColumns: string[] = [
    "none",
    "work_letter_number",
    "work_letter_month",
    "work_letter_year",
    "work_start_date",
    "work_end_date",
    "form_status",
    "action",
  ]
  filterCols: string[] = this.displayedColumns.map((col) => `${col}_filter`);
  formControls = {
    work_letter_number_ctrl : new UntypedFormControl(null),
    work_letter_month_ctrl : new UntypedFormControl(null),
    work_letter_year_ctrl : new UntypedFormControl(null),
    work_start_date_ctrl : new UntypedFormControl(null),
    work_end_date_ctrl : new UntypedFormControl(null),
    form_status_ctrl : new UntypedFormControl(null),
  }

  filteredValue = {
    work_letter_number: null,
    work_letter_month: null,
    work_letter_year: null,
    work_start_date: null,
    work_end_date: null,
    form_status: null,
  }


  SetDatePickerFormat() {
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  initFilter() {
    // Object.keys(this.formControls).forEach((key: null,index) => {
    //   const control = this.formControls[key]
    //   const filteredKey = key.replace('_ctrl', '');

    //   control.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
    //     if (key.toLowerCase().includes("date") || key.toLowerCase().includes("departure") ) {
    //       this.filteredValue[filteredKey] =  value? new Date(value).toISOString() : null;
    //     } else {
    //       this.filteredValue[filteredKey] = value ? value : null;
    //     }

    //     this.paginator.firstPage();

    //     if (!this.isReset) {
    //       this.GetAllApplicationFormsEmployee();
    //     }
    //   });
    // });
}

GetAllApplicationFormsEmployee(){
  this.isWaitingForResponse = true
  const pagination = {
    limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
    page: this.paginator.pageIndex ? this.paginator.pageIndex : 0,
  };

  const filter = {
    employee_id: this.employeeId,
    letter_type: 'work',
    ...this.filteredValue
  }

  this.subs.sink = this.formPermitService.GetAllApplicationFormsEmployee(filter,this.sortValue,pagination)
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

  OpenFormToCreate(){
    localStorage.setItem("previousPage", '/permit-work')
    this.router.navigate(['/form-permit'])
  }

  OpenPdfApplicationForm(url: string){
    window.open(url, '_blank');
  }

  OpenPDFLeaveLetter(url : string){
    window.open(url, '_blank');
  }

  OpenDialogTimeline(formId){
    const dialogRef = this.dialog.open(TimelineDialogComponent, {
      data:formId,
      width: '900px',
      height: '540px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  OpenFormToPreview(formId, employeeId){
    localStorage.setItem("previousPage", '/permit-work')
    this.router.navigate([`/form-permit/preview/${formId}/${employeeId}`])
  }
}
