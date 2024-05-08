import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBarcodeComponent } from './form-barcode/form-barcode.component';
import { RouterModule, Routes } from '@angular/router';

const routes : Routes = [
  {path: '', component:FormBarcodeComponent},
  {path: ':id', component:FormBarcodeComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormBarcodeComponent,
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class BarcodeModule { }
