import { Component } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@Component({
  selector: 'app-form-barcode',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './form-barcode.component.html',
  styleUrl: './form-barcode.component.scss'
})
export class FormBarcodeComponent {

}
