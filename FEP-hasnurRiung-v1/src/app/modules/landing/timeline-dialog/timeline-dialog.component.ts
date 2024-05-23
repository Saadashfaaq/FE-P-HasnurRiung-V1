import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-timeline-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    SharedModule,
    MatButtonModule,
    MatDividerModule,
    NgSelectModule,
    MatStepperModule,
  ],
  templateUrl: './timeline-dialog.component.html',
  styleUrl: './timeline-dialog.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class TimelineDialogComponent implements OnInit {
  private subs = new SubSink();
  isWaitingForResponse : boolean = false
  approvalData
  currentApprovalIndex


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });


  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TimelineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formLeaveService : FormLeaveService,
    private formPermitService : FormPermitService
  ){

  }
  ngOnInit(): void {
    this.getApprovalData()
  }
  openSwalCancel(){
        this.dialogRef.close();
  }

  getApprovalData(){
    this.subs.sink = this.formPermitService.GetOneApplicationFormForTimeline(this.data)
    .subscribe(
      (resp)=>{
        if(resp){
          this.approvalData = resp?.approval
          // let changeStatusToCancel = false
          // this.approvalData .forEach((approval,index) => {
          //   if(approval.approval_status === 'rejected'){
          //     changeStatusToCancel = true
          //   }

          //   if(changeStatusToCancel = true){
          //     const updatedApproval = { ...approval, approval_status: 'cancelled' };
          //     this.approvalData[index] = updatedApproval; // Replace with new object
          //   }

          // });
          console.log("RESPPIN", this.approvalData)
          this.currentApprovalIndex = resp?.current_approval_index
        }
      }
    )
  }

   formatDate(timedate: { date: string }): string {
    console.log("timedate", timedate)
    const [day, month, year] = timedate.date.split('/').map(Number);
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const monthName = monthNames[month - 1];
    return `Tanggal ${day} ${monthName} ${year}`;
}

 formatTime(timedate: { time: string }): string {
  return `${timedate.time} WITA`;
}

    // Fungsi untuk mendapatkan teks tooltip sesuai dengan status
    getStatusTooltip(status: string): string {
      switch (status) {
        case 'waiting_for_approval':
          return 'Menunggu Persetujuan';
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

    getColor(i: number): string {
      if (this.approvalData[i].approval_status === 'waiting_for_approval') {
        return '#ffa000'; // Orange for waiting for approval
      } else if (this.approvalData[i].approval_status === 'rejected') {
        return '#ff0100'; // Red for rejected
      } else if (this.approvalData[i].approval_status === 'approved') {
        return '#01BA6D'; // Green for approved
      } else if (this.approvalData[i].approval_status === 'revision') {
        return '#fffe00'; // Yellow for revision
      } else {
        return 'inherit'; // Default color for any other status
      }
    }
}
