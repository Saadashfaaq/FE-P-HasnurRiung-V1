import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-form-barcode',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
  ],
  templateUrl: './form-barcode.component.html',
  styleUrl: './form-barcode.component.scss'
})
export class FormBarcodeComponent {
  subs: SubSink = new SubSink();
  employeeData
  routerSubscription: Subscription;
  formID
constructor(
  private _formLeaveService: FormLeaveService,
  private router: Router,
  private route: ActivatedRoute,
){

}
ngOnInit(): void {
  this.getOneFormUser()
}

checkRouterParamsId() {
  // Check for NavigationStart events and compare the ID
  this.routerSubscription = this.router.events
    .pipe(filter((event) => event instanceof NavigationStart))
    .subscribe((event: NavigationStart) => {
      // Retrieve the new ID from the URL
      const newFormId = this.getFormIdFromUrl(event.url);

      // Check if the ID has changed
      if (this.formID && newFormId !== this.formID) {
        this.formID = newFormId;
        this.getOneFormUser();
      }
    });
}

getFormIdFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

getOneFormUser(){
  const getParams = this.route.snapshot.params['id'];
  this.subs.sink = this._formLeaveService
  .getOneFormUserBarcode(getParams)
  .subscribe(
    (resp) => {
      if(resp){
        this.employeeData = resp
      }
    },
    (err) => {
      console.log('err', err);
    }
  );
}

 namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Fungsi untuk mengubah format tanggal
 ubahFormatTanggal(tanggalStr: string): string {
  // Memisahkan hari, bulan, dan tahun dari string input
  const [hari, bulan, tahun] = tanggalStr.split('/');

  // Mendapatkan nama bulan berdasarkan indeks (perlu mengurangi 1 karena indeks dimulai dari 0)
  const namaBulanStr = this.namaBulan[parseInt(bulan, 10) - 1];

  // Menggabungkan kembali menjadi format "dd NamaBulan yyyy"
  return `${hari} ${namaBulanStr} ${tahun}`;
}

}
