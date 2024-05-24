import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableWorkPermitComponent } from './table-work-permit/table-work-permit.component';
import { TableWorkPermitEmployeeComponent } from './table-work-permit-employee/table-work-permit-employee.component';

const routes : Routes = [
  {path: '', component:TableWorkPermitEmployeeComponent},
  // {path: '', component:FormLeaveComponent},
  // {path: '/:id', component:FormLeaveComponent}
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableWorkPermitEmployeeComponent
  ]
})
export class TableWorkPermitModule { }
