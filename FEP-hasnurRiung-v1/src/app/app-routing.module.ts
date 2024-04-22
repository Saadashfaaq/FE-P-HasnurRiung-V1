import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'form-leave',
    loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule)
  },
  {
    path: '',
    loadChildren:()=> import('./modules/auth/auth.module').then((m)=>m.AuthModule)
  },
  {
    path: 'permit-leave',
    loadChildren:()=> import('./modules/landing/table-leave-permit/table-leave-permit.module').then((m)=>m.TableLeavePermitModule)
  },
  {
    path: 'permit-work',
    loadChildren:()=> import('./modules/landing/table-work-permit/table-work-permit.module').then((m)=>m.TableWorkPermitModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
