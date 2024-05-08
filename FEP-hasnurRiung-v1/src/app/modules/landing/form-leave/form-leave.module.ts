import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLeaveTableComponent } from './form-leave-table/form-leave-table.component';
import { FormLeaveComponent } from './form-leave/form-leave.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes : Routes = [
  // {path: '', component:FormLeaveTableComponent},
  {path: '', component:FormLeaveComponent},
  {path: ':mode/:id', component:FormLeaveComponent}
]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormLeaveTableComponent,
    FormLeaveComponent
  ]
})
export class FormLeaveModule { }
