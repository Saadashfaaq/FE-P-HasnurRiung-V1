import { Component } from '@angular/core';
import { TableLeavePermitAdminComponent } from '../table-leave-permit-admin/table-leave-permit-admin.component';
import { TableLeavePermitEmployeeComponent } from '../table-leave-permit-employee/table-leave-permit-employee.component';

@Component({
  selector: 'app-table-leave-permit',
  standalone: true,
  imports: [
    TableLeavePermitAdminComponent,
    TableLeavePermitEmployeeComponent
  ],
  templateUrl: './table-leave-permit.component.html',
  styleUrl: './table-leave-permit.component.scss'
})
export class TableLeavePermitComponent {

}
