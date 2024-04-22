import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';import { TableLeavePermitComponent } from './table-leave-permit/table-leave-permit.component';

const routes : Routes = [
  {path: '', component:TableLeavePermitComponent},
  // {path: 'form-leave', component:FormLeaveComponent},
  // {path: 'form-leave/:id', component:FormLeaveComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableLeavePermitComponent
  ]
})
export class TableLeavePermitModule { }
