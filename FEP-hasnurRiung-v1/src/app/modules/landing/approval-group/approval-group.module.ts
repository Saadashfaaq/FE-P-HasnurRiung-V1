import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalGroupComponent } from './approval-group.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {path: '', component:ApprovalGroupComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApprovalGroupComponent,
    RouterModule.forChild(routes),
  ]
})
export class ApprovalGroupModule { }
