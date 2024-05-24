import { Component } from '@angular/core';
import { ApprovalTableLeaveComponent } from '../approval-table-leave/approval-table-leave.component';
import { ApprovalTableWorkComponent } from '../approval-table-work/approval-table-work.component';

@Component({
  selector: 'app-approval-table-parent',
  standalone: true,
  imports: [
    ApprovalTableLeaveComponent,
    ApprovalTableWorkComponent
  ],
  templateUrl: './approval-table-parent.component.html',
  styleUrl: './approval-table-parent.component.scss'
})
export class ApprovalTableParentComponent {

}
