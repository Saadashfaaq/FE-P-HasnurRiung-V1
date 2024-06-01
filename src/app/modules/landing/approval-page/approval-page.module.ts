import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalTableParentComponent } from './approval-table-parent/approval-table-parent.component';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalTableWorkComponent } from './approval-table-work/approval-table-work.component';

const routes: Routes = [
  { path: 'leave', component: ApprovalTableParentComponent },
  { path: 'work', component: ApprovalTableWorkComponent },
  { path: '**', redirectTo: 'leave', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApprovalTableParentComponent,
    RouterModule.forChild(routes),
  ],
})
export class ApprovalPageModule {}
