import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule)
  },
  {
    path: 'auth',
    loadChildren:()=> import('./modules/auth/auth.module').then((m)=>m.AuthModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
