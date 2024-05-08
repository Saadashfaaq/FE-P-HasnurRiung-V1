import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: 'form-leave',
    loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'auth',
    loadChildren:()=> import('./modules/auth/auth.module').then((m)=>m.AuthModule),

  },
  {
    path: 'permit-leave',
    loadChildren:()=> import('./modules/landing/table-leave-permit/table-leave-permit.module').then((m)=>m.TableLeavePermitModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'permit-work',
    loadChildren:()=> import('./modules/landing/table-work-permit/table-work-permit.module').then((m)=>m.TableWorkPermitModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'approval',
    loadChildren:()=> import('./modules/landing/approval-page/approval-page.module').then((m)=>m.ApprovalPageModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'approval-group',
    loadChildren:()=> import('./modules/landing/approval-group/approval-group.module').then((m)=>m.ApprovalGroupModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'data-validation',
    loadChildren:()=> import('./modules/landing/barcode/barcode.module').then((m)=>m.BarcodeModule)
  },
  { path: '404', loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule), pathMatch: 'full' },
  { path: '**', loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule), pathMatch: 'full' },
  { path: '404', loadChildren:()=> import('./modules/landing/form-leave/form-leave.module').then((m)=>m.FormLeaveModule), pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
