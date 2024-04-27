import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-timeline-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    SharedModule
  ],
  templateUrl: './timeline-dialog.component.html',
  styleUrl: './timeline-dialog.component.scss'
})
export class TimelineDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formLeaveService : FormLeaveService,
  ){

  }

}
