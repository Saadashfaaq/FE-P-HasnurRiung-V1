import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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


  dummyData: any = [
    {
        tanggal_dibuat: "2024-04-15",
        jenis_permohonan: "cuti",
        bantuan_tiket: "ya",
        tanggal_mulai: "2024-04-20",
        tanggal_berakhir: "2024-04-25",
        status: "menunggu persetujuan",
        formulir_cuti: "formulir A"
    },
    {
        tanggal_dibuat: "2024-04-14",
        jenis_permohonan: "cuti",
        bantuan_tiket: "tidak",
        tanggal_mulai: "2024-05-10",
        tanggal_berakhir: "2024-05-15",
        status: "disetujui",
        formulir_cuti: "formulir B"
    },
    {
        tanggal_dibuat: "2024-04-13",
        jenis_permohonan: "lembur",
        bantuan_tiket: "ya",
        tanggal_mulai: "2024-04-18",
        tanggal_berakhir: "2024-04-18",
        status: "ditolak",
        formulir_cuti: null
    }
]

// nrp
// name
// jenis permohonan
// tanggal dibuat
// bantuan tiket
// tanggal mulai
// tanggal berakhir
// status
// formulir cuti
displayedColumns: string[] = [
  'employee_number',
  'name',
  'application_type',
  'is_ticket_supported',
  'start_date',
  'end_date',
  'status',
  'form_leave',
  'action'
];
// displayedColumns: string[] = [
//   'satu',
//   'dua',
//   'tiga',
//   'empat',
//   'lima',
//   'enam',
//   'formulir-cuti',
//   'action'
// ];
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
    // if(this.employeeId &&  this.token){
    //   this.router.navigate(['/auth/login'])
    // } else {
    //   console.log('employee_id', this.employeeId)
    //   this.GetAllApplicationForms()
    // }
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

    const filter = null

    this.subs.sink = this._formLeaveService.GetAllApplicationForms(filter,this.sortValue,pagination)
    .subscribe(
      (resp)=>{
        console.log("RESP", resp)
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
    this.router.navigate(['/form-leave'])
  }
}
