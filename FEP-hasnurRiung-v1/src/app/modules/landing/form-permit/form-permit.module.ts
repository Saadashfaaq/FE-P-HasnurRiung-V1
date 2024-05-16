import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPermitComponent } from './form-permit/form-permit.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes : Routes = [
  // {path: '', component:FormLeaveTableComponent},
  {path: '', component:FormPermitComponent},
  {path: ':mode/:id/:employeeId', component:FormPermitComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FormPermitModule { }
