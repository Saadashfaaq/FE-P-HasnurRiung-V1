import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, startWith, tap } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-table-leave-permit-admin',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule
  ],
  templateUrl: './table-leave-permit-admin.component.html',
  styleUrl: './table-leave-permit-admin.component.scss'
})
export class TableLeavePermitAdminComponent {
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

displayedColumns: string[] = [
  // "checkbox",
  // "leave_letter_number",
  "employee_number",
  "name",
  "position",
  "department",
  // "poh_status",
  // "lump_sump_amount",
  // "remaining_yearly_leaves",
  // "application_type",
  // "departure_off_day",
  // "field_leave_duration",
  // "yearly_leave_duration",
  // "permission_duration",
  // "compensation_duration",
  // "leave_comment",
  // "start_date",
  // "end_date",
  // "leave_location",
  // "leave_location_2",
  "created_date",
  "form_status",
  "pdf_application_form",
  "approver",
  "action",

]
filterCols: string[] = this.displayedColumns.map((col) => `${col}_filter`);


  constructor(
    private _formLeaveService : FormLeaveService,
    private router: Router,
  ){

  }
  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.token = localStorage.getItem('token')
    this.GetAllApplicationForms()
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
        }),
      )
      .subscribe();
  }


  GetAllApplicationForms(){
    const pagination = {
      limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      page: this.paginator.pageIndex ? this.paginator.pageIndex : 0,
    };

    // const filter = {
    //   application_type: 'cuti'
    // }
    const filter = null

    this.subs.sink = this._formLeaveService.GetAllApplicationForms(filter,this.sortValue,pagination)
    .subscribe(
      (resp)=>{
        if(resp && resp.length){
          this.dataSource.data = resp
          this.paginator.length = resp[0].count_document;
          this.dataCount = resp[0]?.count_document;
        } else {
          this.dataSource.data = [];
          this.paginator.length = 0;
          this.dataCount = 0;
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

  TemporaryApproval(id: string , order : string){
    const approver = {
      approval_status: order === 'approve'? 'approved' : 'rejected',
      approver_id: this.employeeId
    }
    this.subs.sink = this._formLeaveService.UpdateApprovalApplicationForm(id,approver).subscribe(
      (resp)=>{
        this.GetAllApplicationForms()
        console.log("success")
      },
      (err)=>{
        console.error(err)
      }
    )
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
}
