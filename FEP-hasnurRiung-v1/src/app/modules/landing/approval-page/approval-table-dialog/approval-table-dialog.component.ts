import { Component, Inject } from '@angular/core';
import { FormControl, UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approval-table-dialog',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule
  ],
  templateUrl: './approval-table-dialog.component.html',
  styleUrl: './approval-table-dialog.component.scss'
})
export class ApprovalTableDialogComponent {
  subs: SubSink = new SubSink();
  employeeId
  summary = new UntypedFormControl('', [Validators.required])
  constructor(
    public dialogRef: MatDialogRef<ApprovalTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formLeaveService : FormLeaveService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log("this.data",this.data)
    this.employeeId = localStorage.getItem('userProfile');
  }

  OnClose(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    console.log(this.summary)
    this.SendApproveForm(this.data.formID)
    console.log("this.data.formID",this.data.formID)
  }

  SendApproveForm(id: string){
    const approver = {
      approval_status: this.data.order === 'cancel' ?  'rejected' : 'revision',
      approver_id: this.employeeId,
      reason_of_rejection: this.data.order === 'cancel' ? this.summary.value : null,
      reason_of_revision:  this.data.order !== 'cancel' ? this.summary.value : null
    }
    console.log("wkkwwk", id)
    this.subs.sink = this._formLeaveService.UpdateApprovalApplicationForm(id,approver).subscribe(
      (resp)=>{
        console.log("resp", resp)
        if(resp){
          Swal.fire({
            title: this.data.order === 'cancel' ?  'Permohonan Berhasil Ditolak' : 'Revisi Berhasil Diajukan',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText:'Iya',
          }).then(()=>{
            this.dialogRef.close();
            this.router.navigate(['/approval'])
            console.log("success")
          })
        }

        if(resp.errors){
          console.log("resp.errors", resp.errors)
          Swal.fire({
            title: resp.errors.massage,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText:'Iya',
          })
        }
      },
      (err)=>{
        console.log("ERRPR", err)
        Swal.fire({
          title: err.massage,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText:'Iya',
        })
        console.error(err)
      }
    )
  }
}
