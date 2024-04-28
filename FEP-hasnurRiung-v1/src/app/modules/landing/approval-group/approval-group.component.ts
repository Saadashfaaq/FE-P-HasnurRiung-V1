import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TimelineDialogComponent } from '../timeline-dialog/timeline-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalGroupDialogComponent } from './approval-group-dialog/approval-group-dialog.component';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-approval-group',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './approval-group.component.html',
  styleUrl: './approval-group.component.scss'
})
export class ApprovalGroupComponent {
  employeeId: string
  subs: SubSink = new SubSink();
  approvalGroupData

  constructor(    
    private dialog: MatDialog,
    private formLeaveService : FormLeaveService,
    private changeDetectorRef: ChangeDetectorRef
  ){
  }

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.GetAllAppoverGroup()
    this.changeDetectorRef.detectChanges();
  }

OpenDialogAprovalGroup(id){
  const dialogRef = this.dialog.open(ApprovalGroupDialogComponent, {
    data:id,
    width: '930px',
    height: '620px',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result === "success"){
      this.GetAllAppoverGroup()
    }
  });
}

GetAllAppoverGroup(){
  this.subs.sink = this.formLeaveService.GetAllApproalGroupMenu(this.employeeId)
  .subscribe(
    (resp)=>{
      if(resp){
        this.approvalGroupData = resp
      }
    },
    (err)=>{
      console.error("ERROR:", err)
    }
  )
}

}
