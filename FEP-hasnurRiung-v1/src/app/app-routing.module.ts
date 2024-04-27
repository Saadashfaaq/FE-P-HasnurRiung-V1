import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'form-leave',
    loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule)
  },
  {
    path: 'auth',
    loadChildren:()=> import('./modules/auth/auth.module').then((m)=>m.AuthModule)
  },
  {
    path: 'permit-leave',
    loadChildren:()=> import('./modules/landing/table-leave-permit/table-leave-permit.module').then((m)=>m.TableLeavePermitModule)
  },
  {
    path: 'permit-work',
    loadChildren:()=> import('./modules/landing/table-work-permit/table-work-permit.module').then((m)=>m.TableWorkPermitModule)
  },
  {
    path: 'approval',
    loadChildren:()=> import('./modules/landing/approval-page/approval-page.module').then((m)=>m.ApprovalPageModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
