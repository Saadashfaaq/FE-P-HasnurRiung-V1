import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatIconModule, NgClass, NgIf, NgStyle],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent implements OnInit {
  @Input() from: string;
  @Input() employee_id: {
    _id: string;
    name: string;
    number: string;
  };
  @Input() end_date: string;
  @Input() start_date: string;
  @Input() form_status: string;
  @Input() _id: string;
  @Input() pdf_application_form: string;
  @Input() pdf_leave_letter: string;
  @Input() pdf_work_letter: string;
  @Input() application_type: string;

  range_date: string;
  isOpen: boolean = false;

  statusColor: string;

  namaBulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.range_date = `(${this.changeDateFormat(
      this.start_date
    )} - ${this.changeDateFormat(this.end_date)})`;

    this.statusColor = this.getStatusColor(this.form_status);
  }

  // Fungsi untuk mengubah format tanggal
  changeDateFormat(tanggalStr: string): string {
    // Memisahkan hari, bulan, dan tahun dari string input
    const [hari, bulan, tahun] = tanggalStr.split('/');

    // Mendapatkan nama bulan berdasarkan indeks (perlu mengurangi 1 karena indeks dimulai dari 0)
    const namaBulanStr = this.namaBulan[parseInt(bulan, 10) - 1];

    // Menggabungkan kembali menjadi format "dd NamaBulan yyyy"
    return `${hari} ${namaBulanStr} ${tahun}`;
  }

  // Fungsi untuk mendapatkan warna sesuai dengan status
  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting_for_approval_1':
      case 'waiting_for_approval_2':
      case 'waiting_for_approval_3':
      case 'waiting_for_approval_4':
      case 'waiting_for_approval_5':
      case 'waiting_for_approval':
        return '#ffa000'; // kuning keemasan
      case 'rejected':
        return '#ff0100'; // merah
      case 'completed':
      case 'approved':
        return '#01BA6D'; // hijau
      case 'cancelled':
        return '#ff0100'; // merah
      case 'revision':
        return '#fffe00'; // kuning cerah
      default:
        return '#000000'; // hitam jika status tidak diketahui
    }
  }

  // Fungsi untuk mendapatkan teks tooltip sesuai dengan status
  getStatusTooltip(status: string): string {
    switch (status) {
      case 'waiting_for_approval_1':
        return 'Menunggu Persetujuan 1';
      case 'waiting_for_approval_2':
        return 'Menunggu Persetujuan 2';
      case 'waiting_for_approval_3':
        return 'Menunggu Persetujuan 3';
      case 'waiting_for_approval_4':
        return 'Menunggu Persetujuan 4';
      case 'waiting_for_approval_5':
        return 'Menunggu Persetujuan 5';
      case 'rejected':
        return 'Ditolak';
      case 'completed':
        return 'Disetujui';
      case 'approved':
        return 'Disetujui';
      case 'cancelled':
        return 'Dibatalkan';
      case 'revision':
        return 'Perlu Revisi';
      default:
        return 'Status Tidak Diketahui';
    }
  }

  OpenFormToPreview(formId, employeeId, from?: string) {
    if (from === 'work') {
      localStorage.setItem('previousPage', '/permit-work');
      this._router.navigate([`/form-permit/preview/${formId}/${employeeId}`]);
    } else if (from === 'leave') {
      localStorage.setItem('previousPage', '/permit-leave');
      this._router.navigate([`/form-leave/preview/${formId}/${employeeId}`]);
    }
  }

  openPDF(url: string) {
    window.open(url, '_blank');
  }
}
