import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableWorkPermitComponent } from './table-work-permit/table-work-permit.component';

const routes : Routes = [
  {path: '', component:TableWorkPermitComponent},
  // {path: '', component:FormLeaveComponent},
  // {path: '/:id', component:FormLeaveComponent}
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class TableWorkPermitModule { }
