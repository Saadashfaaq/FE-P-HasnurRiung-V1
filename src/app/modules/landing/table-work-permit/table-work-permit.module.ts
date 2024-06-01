import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableWorkPermitEmployeeComponent } from './table-work-permit-employee/table-work-permit-employee.component';

const routes : Routes = [
  {path: '', component:TableWorkPermitEmployeeComponent},
  // {path: '', component:FormLeaveComponent},
  // {path: '/:id', component:FormLeaveComponent}
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    TableWorkPermitEmployeeComponent
  ]
})
export class TableWorkPermitModule { }
