import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalTableParentComponent } from './approval-table-parent/approval-table-parent.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {path: '', component:ApprovalTableParentComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApprovalTableParentComponent,
    RouterModule.forChild(routes),
  ]
})
export class ApprovalPageModule { }
