import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AsyncPipe, DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { airPortList } from 'src/app/services/form-leave/airport-list';
import { Observable, Subscription, filter, first, map, startWith } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { MatDialog } from '@angular/material/dialog';
import { ApprovalTableDialogComponent } from '../../approval-page/approval-table-dialog/approval-table-dialog.component';

@Component({
  selector: 'app-form-leave',
  standalone: true,
  imports: [SharedModule, NgSelectModule, AsyncPipe],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr' }],
  templateUrl: './form-leave.component.html',
  styleUrl: './form-leave.component.scss',
})
export class FormLeaveComponent implements OnInit {
  subs: SubSink = new SubSink();
  isPreviewMode: boolean = false;
  routerSubscription: Subscription;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    // private datePipe: DatePipe
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _formLeaveService: FormLeaveService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  formID: string;
  formData;
  formStatus;
  requesterId

  currentApprovers;
  isRevision : boolean = false
  isRejected : boolean = false
  reasonText : string = ''
  pohStatus
  minDate: Date = new Date();

  isAplicationTypeLeave: boolean = null;
  isPermissionPP: boolean = null;
  permissionType: string;

  remainingYearlyLeaves: number;
  remainingMassiveLeaves: number;

  formType: string;
  isWaitingForResponse = false
  previousPage

  ChangeAplication() {
    const applicationType =
      this.formLeaveIdentity.get('application_type').value;
    if (applicationType === 'cuti') {
      this.isAplicationTypeLeave = true;
      // this.formLeaveIdentity.setValue(null)
      // this.formLeaveDetailRequest.setValue(null)
      // this.formLeaveTicektApproval.setValue(null)
      this.formLeaveIdentity.get('application_type').setValue('cuti');
      this.formType = 'Cuti';
      this.formLeaveIdentity
        .get('date_of_eligible_for_leave')
        .setValue(this.formData?.date_of_eligible_for_leave?.date);
    } else if (applicationType === 'ijin') {
      this.isAplicationTypeLeave = false;
      this.formType = 'Ijin';
      // this.formLeaveIdentity.setValue(null)
      // this.formLeaveDetailRequest.setValue(null)
      // this.formLeaveTicektApproval.setValue(null)
      this.formLeaveIdentity.get('application_type').setValue('ijin');
      this.formLeaveIdentity.get('date_of_eligible_for_leave').setValue(null);
    } else {
      this.isAplicationTypeLeave = false;
      this.formType = '';
    }
  }

  // Varibale to keep form Leave
  formLeaveIdentity: UntypedFormGroup;
  formLeaveDetailRequest: UntypedFormGroup;
  formLeaveTicektApproval: UntypedFormGroup;

  //Varable to backup start date for leave detail request
  formLeaveStartDateDetailRequest: UntypedFormGroup;

  dayOff: UntypedFormControl = new UntypedFormControl(null);

  filteredAirPortTo: Observable<any>;
  filteredAirPortFrom: Observable<any>;
  filteredPermission: Observable<any>;
  filteredSubtituteOfficer: Observable<any>;

  employeeId: any;

  //Boolena for open section
  openIdentity: boolean = false;
  openDetailRequest: boolean = false;
  openTicektApproval: boolean = false;

  poh_location;

  // Variable For Item List
  categoryList = [
    {
      name: 'Cuti',
      value: 'cuti',
    },
    {
      name: 'Ijin',
      value: 'ijin',
    },
    // {
    //   name:'Kompensasi',
    //   value: 'kompensasi'
    // }
  ];

  permissionList = [
    {
      name: 'Menikah',
      value: 'menikah',
    },
    {
      name: 'Anak Menikah',
      value: 'anak_menikah',
    },
    {
      name: 'Saudara Kandung Menikah',
      value: 'saurdara_kandung_menikah',
    },
    {
      name: 'Istri melahirkan/keguguran',
      value: 'istri_melahirkan_keguguran',
    },
    {
      name: 'Istri/suami atau anak meninggal dunia',
      value: 'istri_suami_anak_meninggal_dunia',
    },
    {
      name: 'Orang tua meninggal dunia',
      value: 'orang_tua_meninggal_dunia',
    },
    {
      name: 'Mertua/menantu meninggal dunia',
      value: 'mertua_menantu_meninggal_dunia',
    },
    {
      name: 'Saudara kandung meninggal dunia',
      value: 'saudara_kandung_meninggal_dunia',
    },
    {
      name: 'Anggota keluarga serumah meninggal dunia',
      value: 'anggota_keluarga_serumah_meninggal_dunia',
    },
    {
      name: 'Istri/suami atau anak sakit keras',
      value: 'istri_suami_anak_sakit_keras',
    },
    {
      name: 'Pengkhitanan/pembaptisan anak',
      value: 'pengkhitanan_pembaptisan_anak',
    },
    {
      name: 'Bencana alam',
      value: 'bencana_alam',
    },
    {
      name: 'Sakit',
      value: 'sakit',
    },
  ];

  airPortList = airPortList;
  substituteOfficerList;

  permissionListBackUp = [
    {
      name: 'Menikah',
      value: 'menikah',
    },
    {
      name: 'Anak Menikah',
      value: 'anak_menikah',
    },
    {
      name: 'Saudara Kandung Menikah',
      value: 'saurdara_kandung_menikah',
    },
    {
      name: 'Istri melahirkan/keguguran',
      value: 'istri_melahirkan_keguguran',
    },
    {
      name: 'Istri/suami atau anak meninggal dunia',
      value: 'istri_suami_anak_meninggal_dunia',
    },
    {
      name: 'Orang tua meninggal dunia',
      value: 'orang_tua_meninggal_dunia',
    },
    {
      name: 'Mertua/menantu meninggal dunia',
      value: 'mertua_menantu_meninggal_dunia',
    },
    {
      name: 'Saudara kandung meninggal dunia',
      value: 'saudara_kandung_meninggal_dunia',
    },
    {
      name: 'Anggota keluarga serumah meninggal dunia',
      value: 'anggota_keluarga_serumah_meninggal_dunia',
    },
    {
      name: 'Istri/suami atau anak sakit keras',
      value: 'istri_suami_anak_sakit_keras',
    },
    {
      name: 'Pengkhitanan/pembaptisan anak',
      value: 'pengkhitanan_pembaptisan_anak',
    },
    {
      name: 'Bencana alam',
      value: 'bencana_alam',
    },
    {
      name: 'Sakit',
      value: 'sakit',
    },
  ];
  airPortListBackUp = airPortList;
  substituteOfficerListBackup;
  localStorageUser

  isSection1Submited: boolean = false;
  isSection2Submited: boolean = false;
  isSection3Submited: boolean = false;

  ngOnInit(): void {
    this.previousPage = localStorage.getItem('previousPage')
    const getParamsEmployeeId = this.route.snapshot.params['employeeId'];
    this.employeeId =  getParamsEmployeeId !== undefined ? getParamsEmployeeId : localStorage.getItem('userProfile');
    this.localStorageUser = localStorage.getItem('userProfile')
    this.checkRouterParamsId();
    this.GetOneUserLoginForm();
    this.SetDatePickerFormat();
  }

  SetDatePickerFormat() {
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  InitFormLeaveIdentity() {
    let originalDate = this.formData?.date_of_registration?.date;

    let parts = originalDate.split('/');
    let day = parseInt(parts[0]);
    let month = parseInt(parts[1]);
    let year = parseInt(parts[2]);

    let newDate = new Date(year, month - 1, day + 1);

    let formattedDate = `${newDate.getDate().toString().padStart(2, '0')}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${newDate.getFullYear()}`;

    this.formLeaveIdentity = this._formBuilder.group({
      application_type: [null, [Validators.required]],
      date_of_eligible_for_leave: {
        value: this.formData?.date_of_eligible_for_leave?.date,
        disabled: true,
      },
      name: { value: this.formData?.name, disabled: true },
      employee_number: {
        value: this.formData?.employee_number,
        disabled: true,
      },
      family_status: { value: this.formData?.family_status, disabled: true },
      date_of_registration: { value: formattedDate, disabled: true },
      leave_location: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      is_ticket_supported: [null, [Validators.required]],
      position: { value: this.formData?.position?.name, disabled: true },
      poh_status: { value: this.formData?.poh_status, disabled: true },
      is_with_family: [{ value: false, disabled: true }, [Validators.required]],
      is_routine_official_letter: [{ value: true, disabled: true }],
      leave_address: [null, [Validators.required]],
      is_lump_sump: [{ value: this.formData?.is_lump_sump, disabled: true }],
      lump_sump_amount: {
        value: this.formatToRupiah(String(this.formData?.lump_sump_amount)),
        disabled: true,
      },
      placement_status: {
        value: this.formData?.placement_status,
        disabled: true,
      },

      leave_category: [null, [Validators.required]],
      permission_category: [null, [Validators.required]],
    });

    this.formLeaveIdentity
      .get('application_type')
      .valueChanges.subscribe((value) => {
        if (value === 'cuti') {
          this.formLeaveIdentity
            .get('leave_category')
            .setValidators([Validators.required]);
          this.formLeaveIdentity.get('permission_category').clearValidators();
        } else if (value === 'ijin') {
          this.formLeaveIdentity
            .get('permission_category')
            .setValidators([Validators.required]);
          this.formLeaveIdentity.get('leave_category').clearValidators();
        } else {
          this.formLeaveIdentity.get('leave_category').clearValidators();
          this.formLeaveIdentity.get('permission_category').clearValidators();
        }
        this.formLeaveIdentity.get('leave_category').updateValueAndValidity();
        this.formLeaveIdentity
          .get('permission_category')
          .updateValueAndValidity();
      });
  }

  InitStartDateDatailRequestBackup() {
    this.formLeaveStartDateDetailRequest = this._formBuilder.group({
      field_leave_start_date: [null],
      yearly_leave_start_date: [null],
      permission_start_date: [null],
      compensation_start_date: [null],
    });
  }

  SaveBackupStartDateBackup() {
    if (
      this.formLeaveDetailRequest.get('field_leave_start_date').value !== null
    ) {
      this.formLeaveStartDateDetailRequest
        .get('field_leave_start_date')
        .setValue(
          this.formLeaveDetailRequest.get('field_leave_start_date').value
        );
    }
    if (
      this.formLeaveDetailRequest.get('yearly_leave_start_date').value !== null
    ) {
      this.formLeaveStartDateDetailRequest
        .get('yearly_leave_start_date')
        .setValue(
          this.formLeaveDetailRequest.get('yearly_leave_start_date').value
        );
    }
    if (
      this.formLeaveDetailRequest.get('permission_start_date').value !== null
    ) {
      this.formLeaveStartDateDetailRequest
        .get('permission_start_date')
        .setValue(
          this.formLeaveDetailRequest.get('permission_start_date').value
        );
    }
    if (
      this.formLeaveDetailRequest.get('compensation_start_date').value !== null
    ) {
      this.formLeaveStartDateDetailRequest
        .get('compensation_start_date')
        .setValue(
          this.formLeaveDetailRequest.get('compensation_start_date').value
        );
    }
  }

  RestoreBackUpForm() {
    // Mengaktifkan kontrol dan set nilai hanya jika nilainya tidak null
    if (
      this.formLeaveStartDateDetailRequest.get('field_leave_start_date')
        .value !== null
    ) {
      this.formLeaveDetailRequest
        .get('field_leave_start_date')
        .setValue(
          this.formLeaveStartDateDetailRequest.get('field_leave_start_date')
            .value
        );
    }

    if (
      this.formLeaveStartDateDetailRequest.get('yearly_leave_start_date')
        .value !== null
    ) {
      this.formLeaveDetailRequest
        .get('yearly_leave_start_date')
        .setValue(
          this.formLeaveStartDateDetailRequest.get('yearly_leave_start_date')
            .value
        );
    }

    if (
      this.formLeaveStartDateDetailRequest.get('permission_start_date')
        .value !== null
    ) {
      this.formLeaveDetailRequest
        .get('permission_start_date')
        .setValue(
          this.formLeaveStartDateDetailRequest.get('permission_start_date')
            .value
        );
    }

    if (
      this.formLeaveStartDateDetailRequest.get('compensation_start_date')
        .value !== null
    ) {
      this.formLeaveDetailRequest
        .get('compensation_start_date')
        .setValue(
          this.formLeaveStartDateDetailRequest.get('compensation_start_date')
            .value
        );
    }
  }

  InitFormLeaveDetailRequest() {
    this.formLeaveDetailRequest = this._formBuilder.group({
      departure_off_day: [null, [Validators.required]],
      travel_date: [
        null,
        [Validators.required, this.travelDateValidator('departure_off_day')],
      ],
      field_leave_duration: [null, [Validators.required]],
      field_leave_start_date: [null],
      field_leave_end_date: [null],
      is_yearly_leave: [null, [Validators.required]],
      yearly_leave_duration: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-6]$'),
          this.validateYearlyLeaveDuration.bind(this),
        ],
      ],
      yearly_leave_start_date: [null],
      yearly_leave_end_date: [null],
      is_permission: [null, [Validators.required]],
      permission_type: [null],
      permission_duration: [null, [Validators.required]],
      permission_start_date: [null],
      permission_end_date: [null],
      is_compensation: [null, [Validators.required]],
      compensation_duration: [null],
      compensation_start_date: [null],
      compensation_end_date: [null],
      leave_comment: [null],
      is_massive_leave: [null, [Validators.required]],
      massive_leave_start_date: [null],
      massive_leave_end_date: [null],
      massive_leave_duration:  [
        null,
        [
          Validators.required,
          Validators.pattern('^(0|[1-9]|1[0-9]|2[0-5])$'),
          this.validateMassiveLeaveDuration.bind(this),
        ],
      ],
    });

    this.formLeaveDetailRequest
      .get('is_yearly_leave')
      .valueChanges.subscribe((value) => {
        this.updateYearlyLeaveValidation(value);
      });

    // Atur validasi permission_category dan permission_duration berdasarkan nilai is_permission saat form diinisialisasi
    this.formLeaveDetailRequest
      .get('is_permission')
      .valueChanges.subscribe((value) => {
        this.updatePermissionValidation(value);
      });

    // Atur validasi compensation_duration berdasarkan nilai is_compensation saat form diinisialisasi
    this.formLeaveDetailRequest
      .get('is_compensation')
      .valueChanges.subscribe((value) => {
        this.updateCompensationValidation(value);
      });
  }

  validateYearlyLeaveDuration(control: FormControl) {
    const selectedDuration = control.value;
    if (selectedDuration > this.remainingYearlyLeaves) {
      return { exceedLimit: true };
    } else {
      return null;
    }
  }

  validateMassiveLeaveDuration(control: FormControl) {
    const selectedDuration = control.value;
    if (selectedDuration > this.remainingMassiveLeaves) {
      return { exceedLimit: true };
    } else {
      return null;
    }
  }

  updateYearlyLeaveValidation(value: boolean) {
    const yearlyLeaveDurationControl = this.formLeaveDetailRequest.get(
      'yearly_leave_duration'
    );
    if (value) {
      yearlyLeaveDurationControl.setValidators([
        Validators.required,
        Validators.pattern('^[0-6]$'),
        this.validateYearlyLeaveDuration.bind(this),
      ]);
    } else {
      yearlyLeaveDurationControl.clearValidators();
    }
    yearlyLeaveDurationControl.updateValueAndValidity();
  }

  updatePermissionValidation(value: boolean) {
    const permissionCategoryControl =
      this.formLeaveDetailRequest.get('permission_type');
    const permissionDurationControl = this.formLeaveDetailRequest.get(
      'permission_duration'
    );
    if (value) {
      permissionCategoryControl.setValidators([Validators.required]);
      permissionDurationControl.setValidators([Validators.required]);
    } else {
      permissionCategoryControl.clearValidators();
      permissionDurationControl.clearValidators();
    }
    permissionCategoryControl.updateValueAndValidity();
    permissionDurationControl.updateValueAndValidity();
  }

  updateCompensationValidation(value: boolean) {
    const compensationDurationControl = this.formLeaveDetailRequest.get(
      'compensation_duration'
    );
    if (value) {
      compensationDurationControl.setValidators([Validators.required]);
    } else {
      compensationDurationControl.clearValidators();
    }
    compensationDurationControl.updateValueAndValidity();
  }

  formatDate(date: Date): string {
    if (!date) return ''; // Jika tanggal tidak tersedia, kembalikan string kosong

    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const dayName = days[new Date(date).getDay()];
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1; // Perlu ditambah 1 karena Januari dimulai dari 0
    const year = new Date(date).getFullYear();

    return (
      dayName +
      ', ' +
      (day < 10 ? '0' + day : day) +
      '/' +
      (month < 10 ? '0' + month : month) +
      '/' +
      year
    );
  }

  InitFormLeaveTicektApproval() {
    this.formLeaveTicektApproval = this._formBuilder.group({
      leave_date_start_TicektApproval: [null],
      leave_date_end_TicektApproval: [null],
      total_leave_amount: [null],
      leave_comment: [null, [Validators.required]],
      travel_tickets: this._formBuilder.array([]),
      substitute_officer: [null, [Validators.required]],
      pending_job: [null, [Validators.required]],
      approval_id_1: { value: '', disabled: true },
      approval_id_2: { value: null, disabled: true },
      approval_id_3: { value: null, disabled: true },
    });
  }

  InitTicketTravelFormArray() {
    return this._formBuilder.group({
      name: [null],
      age: [null],
      departure_from: [null],
      departure_to: [null, [Validators.required]],
      arrival_from: [null, [Validators.required]],
      arrival_to: [null],
    });
  }

  get ticketsTravel(): FormArray {
    return this.formLeaveTicektApproval.get('travel_tickets') as FormArray;
  }

  InisiateFirstIndexFormArray() {
      const newTicketFormGroup = this.InitTicketTravelFormArray();
      this.ticketsTravel.push(newTicketFormGroup);
  }

  CreateTicketTravelArray() {
    if (
      this.ticketsTravel.at(0).get('departure_to').value &&
      this.ticketsTravel.at(0).get('arrival_from').value ||
      this.ticketsTravel.at(0).get('departure_to').getRawValue() &&
      this.ticketsTravel.at(0).get('arrival_from').getRawValue()
    ) {
      const newTicketFormGroup = this._formBuilder.group({
        name: [''],
        age: [''],
        departure_from: { value: 'Banjarmasin (BDJ)', disabled: true }, // buat field ini disable
        departure_to: {
          value: this.ticketsTravel.at(0).get('departure_to').value,
          disabled: true,
        }, // buat field ini disable
        arrival_from: {
          value: this.ticketsTravel.at(0).get('arrival_from').value,
          disabled: true,
        }, // buat field ini disable
        arrival_to: { value: 'Banjarmasin (BDJ)', disabled: true }, // buat field ini disable
      });
      this.ticketsTravel.push(newTicketFormGroup);
      const tricketTravelIndex = this.ticketsTravel.length - 1;
      this.ticketsTravel
        .at(tricketTravelIndex)
        .get('departure_from')
        .setValue('Banjarmasin (BDJ)');
      this.ticketsTravel
        .at(tricketTravelIndex)
        .get('departure_to')
        .setValue(this.ticketsTravel.at(0).get('departure_to').value);
      this.ticketsTravel
        .at(tricketTravelIndex)
        .get('arrival_from')
        .setValue(this.ticketsTravel.at(0).get('arrival_from').value);
      this.ticketsTravel
        .at(tricketTravelIndex)
        .get('arrival_to')
        .setValue('Banjarmasin (BDJ)');
    } else {
      alert("SALAH")
    }
  }

  RemoveTicket(index) {
    this.ticketsTravel.removeAt(index);
  }

  UpdateAirPortFormArrFrom() {
    if (this.ticketsTravel.length > 1) {
      while (this.ticketsTravel.length > 1) {
        this.ticketsTravel.removeAt(1); // Hapus elemen dari indeks 1 ke atas
      }
    }

    const arrivalFrom = this.ticketsTravel.at(0).get('arrival_from').value;
    const selectedArrivalFrom = this.airPortListBackUp.find(
      (airport) => airport.name === arrivalFrom
    );
    if (!selectedArrivalFrom) {
      this.ticketsTravel.at(0).get('arrival_from').setValue(null);
    }
  }

  UpdateAirPortFormArrTo() {
    const departureTo = this.ticketsTravel.at(0).get('departure_to').value;
    const selectedDepartureTo = this.airPortListBackUp.find(
      (airport) => airport.name === departureTo
    );

    if (!selectedDepartureTo) {
      this.ticketsTravel.at(0).get('departure_to').setValue(null);
    }

    if (this.ticketsTravel.length > 1) {
      while (this.ticketsTravel.length > 1) {
        this.ticketsTravel.removeAt(1); // Hapus elemen dari indeks 1 ke atas
      }
    }
  }

  SelectPermissionType() {
    const permissionType =
      this.formLeaveDetailRequest.get('permission_type').value;
    const SelectedPermissionType = this.permissionListBackUp.find(
      (permission) => permission.name === permissionType
    );

    if (!SelectedPermissionType) {
      this.formLeaveDetailRequest.get('permission_type').setValue(null);
    }
  }

  OpenIdentity() {
    this.openIdentity = true;
    this.openDetailRequest = false;
    this.openTicektApproval = false;
    this.isSection1Submited = false;
    this.isSection2Submited = false;
    this.isSection3Submited = false;
  }
  OpenDetailRequest() {
    this.openIdentity = false;
    this.openDetailRequest = true;
    this.openTicektApproval = false;
    this.isSection1Submited = false;
    this.isSection2Submited = false;
    this.RestoreBackUpForm();
  }
  OpenTicektApproval() {
    this.openIdentity = false;
    this.openDetailRequest = false;
    this.openTicektApproval = true;
    this.isSection3Submited = false;
  }

  SaveIdentity() {
    Object.keys(this.formLeaveIdentity.controls).forEach((key) => {
      this.formLeaveIdentity.get(key).markAsDirty();
      this.formLeaveIdentity.get(key).markAsTouched();
    });
    this.isSection1Submited = true;
    if (this.formLeaveIdentity.invalid) {
      this.InvalidSwal();
    } else {
      this.openIdentity = false;
      this.openDetailRequest = true;
      this.openTicektApproval = false;
      this.formLeaveDetailRequest.get('massive_leave_start_date').disable()
      this.formLeaveDetailRequest.get('massive_leave_end_date').disable()
      // this.formLeaveDetailRequest.get('massive_leave_duration').setValidators(        [
      //   Validators.required,
      //   Validators.pattern('^(0|[1-9]|1[0-9]|2[0-5])$'),
      //   this.validateMassiveLeaveDuration.bind(this),
      // ])
      // this.formLeaveDetailRequest.get('is_massive_leave').setValidators([Validators.required])

      if (this.formLeaveIdentity.get('application_type').value === 'ijin') {
        if (this.formLeaveIdentity.get('permission_category').value === 'pp') {
          this.removeValidatorsForPermissionLeave();
        } else if (
          this.formLeaveIdentity.get('permission_category').value === 'non_pp'
        ) {
          this.formLeaveDetailRequest.get('is_massive_leave').clearValidators();
          this.formLeaveDetailRequest.get('massive_leave_duration').clearValidators();
          this.removeValidatorsForNonPermissionLeave();
        }
      }

      if (!this.formLeaveIdentity.get('is_ticket_supported').value) {
        this.formLeaveDetailRequest.get('departure_off_day').clearValidators();
        this.formLeaveDetailRequest.get('travel_date').clearValidators();
        this.formLeaveDetailRequest.get('field_leave_start_date').enable();
        if (
          this.IsTypeIsLeave() &&
          this.formLeaveIdentity.get('leave_category').value !== 'tahunan'
        ) {
          this.formLeaveDetailRequest
            .get('field_leave_start_date')
            .setValidators([Validators.required]);
        }
      } else {
        this.formLeaveDetailRequest
          .get('departure_off_day')
          .setValidators([Validators.required]);
        if (this.formLeaveIdentity.get('application_type').value !== 'ijin') {
          this.formLeaveDetailRequest
            .get('travel_date')
            .setValidators([
              Validators.required,
              this.travelDateValidator('departure_off_day'),
            ]);
        }
        this.formLeaveDetailRequest.get('field_leave_start_date').disable();
        this.formLeaveDetailRequest
          .get('field_leave_start_date')
          .clearValidators();
      }
    }
  }

  SaveDetailRequest() {
    Object.keys(this.formLeaveDetailRequest.controls).forEach((key) => {
      this.formLeaveDetailRequest.get(key).markAsDirty();
      this.formLeaveDetailRequest.get(key).markAsTouched();
    });
    this.isSection2Submited = true;
    this.formLeaveTicektApproval.get('total_leave_amount').disable();
    if (this.formLeaveDetailRequest.invalid) {
      this.InvalidSwal();
    } else {
      this.SaveBackupStartDateBackup();
      this.openIdentity = false;
      this.openDetailRequest = false;
      this.openTicektApproval = true;
      this.CalculateTotalLeaveAmount();
      if (this.formLeaveIdentity.get('is_ticket_supported').value) {
        if (this.ticketsTravel.length === 0) {
          this.InisiateFirstIndexFormArray();
          this.ticketsTravel.at(0).get('name').setValue(this.formData?.name);
          this.ticketsTravel.at(0).get('age').setValue(this.formData?.age);
          this.ticketsTravel
            .at(0)
            .get('departure_from')
            .setValue('Banjarmasin (BDJ)');
          this.ticketsTravel
            .at(0)
            .get('arrival_to')
            .setValue('Banjarmasin (BDJ)');
          this.ticketsTravel.at(0).get('name').disable();
          this.ticketsTravel.at(0).get('age').disable();
          this.ticketsTravel.at(0).get('departure_from').disable();
          this.ticketsTravel.at(0).get('arrival_to').disable();
        }
        this.FilterAirPortTo();
        this.FilterAirPortFrom();
      } else {
        this.ticketsTravel.at(0)?.get('departure_to')?.clearValidators();
        this.ticketsTravel.at(0)?.get('arrival_from')?.clearValidators();
      }
    }
  }

  SaveTicektApproval() {
    this.isWaitingForResponse = true
    Object.keys(this.formLeaveTicektApproval.controls).forEach((key) => {
      this.formLeaveTicektApproval.get(key).markAsDirty();
      this.formLeaveTicektApproval.get(key).markAsTouched();
    });
    this.isSection3Submited = true;
    const payload = this.CreateFormPayload();
    if (this.formLeaveTicektApproval.invalid) {
      this.isWaitingForResponse = false
      this.InvalidSwal();
    } else {
      const getParamsMode = this.route.snapshot.params['mode'];
      if(getParamsMode === 'edit'){
        this.updateForm(payload)
      } else {
        this.createForm(payload)
      }
    }
  }

  createForm(payload){
    this.subs.sink = this._formLeaveService
    .CreateFormLeave(payload)
    .subscribe(
      (resp) => {
        if (resp) {
          this.isWaitingForResponse = false
          this.swalSuccess()
        }
      },
      (err) => {
        this.isWaitingForResponse = false
        console.error(err);
      }
    );
  }

  updateForm(payload){
    this.subs.sink = this._formLeaveService
    .UpdateFormIdentity(payload, this.formID)
    .subscribe(
      (resp) => {
        if (resp) {
          this.isWaitingForResponse = false
          this.swalSuccess()
        }
      },
      (err) => {
        this.isWaitingForResponse = false
        console.error(err);
      }
    );
  }

  CreateFormPayload() {
    this.formLeaveDetailRequest
      .get('leave_comment')
      .setValue(this.formLeaveTicektApproval.get('leave_comment').value);
    const identityPayload = this.CreatePayloadForIdentity();
    const detailRequestPayload = this.CreatePayloadForDetailRequest();
    const ticketApprovalPayload = this.CreatePayloadForTicketApproval();

    const payload = {
      ...identityPayload,
      ...detailRequestPayload,
      ...ticketApprovalPayload,
    };

    return payload;
  }

  CreatePayloadForIdentity() {
    const identityForm = this.formLeaveIdentity;
    const { is_lump_sump, is_routine_official_letter, ...payload } =
      this.formLeaveIdentity.value;

    // Menghilangkan field yang memiliki nilai null
    Object.keys(payload).forEach(
      (key) => payload[key] === null && delete payload[key]
    );

    // Memindahkan nilai leave_category ke dalam objek leaves
    if (
      payload.leave_category !== null &&
      payload.leave_category !== undefined
    ) {
      payload.leaves = { leave_category: payload.leave_category };
      delete payload.leave_category;
    }

    return payload;
  }

  CreatePayloadForTicketApproval() {
    const substituteOfficerId =
      this.formLeaveTicektApproval.get('substitute_officer').value;
    let approverId: string;
    this.substituteOfficerList.forEach((approval) => {
      if (approval._id === substituteOfficerId) {
        approverId = approval._id;
      }
    });

    const payload = {
      // start_date:this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').value,
      // end_date: this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').value,
      total_leaves: parseInt(this.formLeaveTicektApproval.get('total_leave_amount').value),
      travel_tickets: this.formLeaveTicektApproval.get('travel_tickets').value,
      // substitute_officer:[null,[Validators.required]],
      pending_job: this.formLeaveTicektApproval.get('pending_job').value,
      approval: [
        {
          approver_id: approverId,
        },
      ],
      start_date: this.formatDatePayload(
        this.formLeaveTicektApproval.get('leave_date_start_TicektApproval')
          .value
      ),
      end_date: this.formatDatePayload(
        this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').value
      ),
      employee_id: this.localStorageUser,
    };
    return payload;
  }
  CreatePayloadForDetailRequest() {
    const leaves = this.formLeaveDetailRequest.getRawValue();
    const payload = {
      leaves: {},
      current_step_index: 1,
    };

    // Perulangan untuk memeriksa setiap field dalam objek leaves
    for (const key in leaves) {
      if (leaves.hasOwnProperty(key)) {
        // Periksa apakah nilai field ada dan tidak null
        if (leaves[key] != null && leaves[key] !== '') {
          // Jika ya, tambahkan field ke dalam payload
          if (key === 'departure_off_day') {
            // Jika field departure_off_day, tambahkan objek date ke dalam payload
            payload.leaves[key] = {
              date: formatDate(leaves[key], 'dd/MM/yyyy', 'en-US'),
              time: '', // Kosongkan nilai time
            };
          } else if (key.includes('date')) {
            // Jika field berisi tanggal lain, konversi format tanggal dan tambahkan ke dalam payload
            payload.leaves[key] = formatDate(
              leaves[key],
              'dd/MM/yyyy',
              'en-US'
            );
          } else if (key.includes('duration')) {
            // Jika field berbau duration, ubah menjadi tipe data integer
            payload.leaves[key] = parseInt(leaves[key]);
          } else {
            // Jika bukan tanggal atau duration, langsung tambahkan ke dalam payload
            payload.leaves[key] = leaves[key];
          }
        }
      }
    }
    payload.leaves['leave_category'] = this.formLeaveIdentity.get(
      'leave_category'
    ).value
      ? this.formLeaveIdentity.get('leave_category').value
      : null;
    return payload;
  }

  // Section Form Condition
  IsTypeIsLeave(): boolean {
    if (this.formLeaveIdentity.get('application_type').value) {
      if (this.formLeaveIdentity.get('application_type').value === 'cuti') {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  }

  PermissionTypeCondition() {
    const permissionType = this.formLeaveIdentity.get(
      'permission_category'
    ).value;
    if (permissionType === 'pp') {
      this.permissionType = 'pp';
      this.formLeaveIdentity.get('is_ticket_supported').setValue(null);
      this.formLeaveIdentity.get('is_ticket_supported').enable();
      this.formLeaveDetailRequest.get('permission_start_date').enable();
      this.formLeaveDetailRequest.get('permission_end_date').disable();
      this.formLeaveDetailRequest.get('permission_end_date').disable();
      this.formLeaveTicektApproval
        .get('leave_date_start_TicektApproval')
        .disable();
      this.formLeaveTicektApproval
        .get('leave_date_end_TicektApproval')
        .disable();
      this.formLeaveDetailRequest.get('yearly_leave_start_date').disable();
      this.formLeaveDetailRequest.get('yearly_leave_end_date').disable();
    } else if (permissionType === 'non_pp') {
      this.permissionType = 'non_pp';
      this.formLeaveIdentity.get('is_ticket_supported').setValue(false);
      this.formLeaveIdentity.get('is_ticket_supported').disable();
      this.formLeaveDetailRequest.get('permission_start_date').enable();
      this.formLeaveDetailRequest.get('permission_end_date').disable();
      this.formLeaveTicektApproval
        .get('leave_date_start_TicektApproval')
        .disable();
      this.formLeaveTicektApproval
        .get('leave_date_end_TicektApproval')
        .disable();
    }
  }

  LeaveTypeCondition() {
    if (this.formLeaveIdentity.get('leave_category').value) {
      if (this.formLeaveIdentity.get('leave_category').value === 'tahunan') {
        this.formLeaveDetailRequest.get('is_yearly_leave').setValue(true);
        this.formLeaveIdentity.get('is_ticket_supported').setValue(false);
        this.formLeaveIdentity.get('is_ticket_supported').disable();
        this.formLeaveIdentity.get('is_with_family').setValue(false);
        this.formLeaveIdentity.get('is_with_family').disable();
        this.formLeaveDetailRequest.get('yearly_leave_start_date').enable();
        this.formLeaveDetailRequest
          .get('yearly_leave_start_date')
          .setValidators([Validators.required]);
        this.formLeaveDetailRequest.get('yearly_leave_end_date').disable();
        this.formLeaveTicektApproval
          .get('leave_date_start_TicektApproval')
          .disable();
        this.formLeaveTicektApproval
          .get('leave_date_end_TicektApproval')
          .disable();
        this.formLeaveTicektApproval.get('total_leave_amount').disable();
        this.formLeaveDetailRequest.get('travel_date').clearValidators();
        this.formLeaveDetailRequest.get('departure_off_day').clearValidators();
        this.formLeaveDetailRequest
          .get('field_leave_duration')
          .clearValidators();
        this.formLeaveDetailRequest.get('is_compensation').clearValidators();
        this.formLeaveDetailRequest.get('permission_start_date').disable();
        this.formLeaveDetailRequest.get('permission_end_date').disable();
      } else {
        this.formLeaveIdentity.get('is_ticket_supported').setValue(null);
        this.formLeaveIdentity.get('is_ticket_supported').enable();
        this.formLeaveDetailRequest.get('yearly_leave_start_date').disable();
        this.formLeaveDetailRequest
          .get('yearly_leave_start_date')
          .clearValidators();
        this.formLeaveDetailRequest.get('field_leave_end_date').disable();
        this.formLeaveDetailRequest.get('yearly_leave_start_date').disable();
        this.formLeaveDetailRequest.get('yearly_leave_end_date').disable();
        this.formLeaveDetailRequest.get('permission_start_date').disable();
        this.formLeaveDetailRequest.get('permission_end_date').disable();
        this.formLeaveDetailRequest.get('compensation_start_date').disable();
        this.formLeaveDetailRequest.get('compensation_end_date').disable();
        this.formLeaveTicektApproval
          .get('leave_date_start_TicektApproval')
          .disable();
        this.formLeaveTicektApproval
          .get('leave_date_end_TicektApproval')
          .disable();
        this.formLeaveTicektApproval.get('total_leave_amount').disable();
        this.formLeaveDetailRequest.get('is_yearly_leave').setValue(null);
        this.formLeaveDetailRequest
          .get('travel_date')
          .setValidators([
            Validators.required,
            this.travelDateValidator('departure_off_day'),
          ]);
        this.formLeaveDetailRequest
          .get('departure_off_day')
          .setValidators([
            Validators.required,
            this.travelDateValidator('departure_off_day'),
          ]);
        this.formLeaveDetailRequest
          .get('field_leave_duration')
          .setValidators([Validators.required]);
        this.formLeaveDetailRequest
          .get('is_compensation')
          .setValidators([Validators.required]);
        if (this.pohStatus === 'lokal') {
          this.formLeaveIdentity.get('is_ticket_supported').setValue(false);
          this.formLeaveIdentity.get('is_ticket_supported').disable();
        }
      }
    }
  }

  IsLeaveCategoryIsYearly(): boolean {
    if (this.formLeaveIdentity.get('leave_category').value) {
      if (this.formLeaveIdentity.get('leave_category').value === 'tahunan') {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  }

  IsPohNonLocalPerumahan(): boolean {
    if (this.formLeaveIdentity.get('poh_status').value) {
      if (
        this.formLeaveIdentity.get('poh_status').value ===
        `NON LOKAL PERUMAHAN - ${this.poh_location}`
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  }

  // Regex Input For Numeric
  preventNonNumericalInput(event) {
    const input = event.target;
    const key = event.key;

    // Cegah input jika bukan angka
    if (!key.match(/^[0-9]+$/)) {
      event.preventDefault();
      return;
    }

    // Cegah masukan jika angka pertama adalah "0"
    if (input.value.length === 0 && key === '0') {
      event.preventDefault();
      return;
    }
  }

  preventNonNumericalInputPhoneNumber(event){
    const key = event.key;

    // Cegah input jika bukan angka
    if (!key.match(/^[0-9]+$/)) {
      event.preventDefault();
      return;
    }
  }

  ResetBottomData() {
    this.formLeaveDetailRequest.get('field_leave_duration').setValue(null);
    this.formLeaveDetailRequest.get('field_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('field_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_yearly_leave').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_permission').setValue(null);
    this.formLeaveDetailRequest.get('permission_type').setValue(null);
    this.formLeaveDetailRequest.get('permission_duration').setValue(null);
    this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
  }

  CalculateLeaveDate(step) {
    if (step === 'first') {
      this.formLeaveDetailRequest.get('field_leave_start_date').setValue(null);
    }
    this.formLeaveDetailRequest.get('field_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_yearly_leave').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_permission').setValue(null);
    this.formLeaveDetailRequest.get('permission_type').setValue(null);
    this.formLeaveDetailRequest.get('permission_duration').setValue(null);
    this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);

    const travelDate = this.formLeaveDetailRequest.get('travel_date').value;
    if (this.formLeaveIdentity.get('is_ticket_supported').value === true) {
      if (travelDate) {
        const resultStart = new Date(travelDate);
        resultStart.setDate(resultStart.getDate() + 1);
        this.formLeaveDetailRequest
          .get('field_leave_start_date')
          .setValue(resultStart);

        const resultEnd = new Date(travelDate);
        resultEnd.setDate(
          resultEnd.getDate() +
            parseInt(
              this.formLeaveDetailRequest.get('field_leave_duration').value
            )
        );

        this.formLeaveDetailRequest
          .get('field_leave_end_date')
          .setValue(resultEnd);
      } else {
        console.error('Travel date is invalid.');
      }
    } else if (
      this.formLeaveIdentity.get('is_ticket_supported').value === false
    ) {
      if (step === 'last') {
        const resultEnd = new Date(
          this.formLeaveDetailRequest.get('field_leave_start_date').value
        );
        resultEnd.setDate(
          resultEnd.getDate() +
            parseInt(
              this.formLeaveDetailRequest.get('field_leave_duration').value
            ) -
            1
        );

        this.formLeaveDetailRequest
          .get('field_leave_end_date')
          .setValue(resultEnd);
      } else {
        return;
      }
    }
  }

  CalculateYearlyLeaveDate() {
    this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
    if (this.permissionType !== 'pp') {
      this.formLeaveDetailRequest.get('is_permission').setValue(null);
      this.formLeaveDetailRequest.get('permission_type').setValue(null);
      this.formLeaveDetailRequest.get('permission_duration').setValue(null);
      this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
      this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    }
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
    const permissionEndDate = this.formLeaveDetailRequest.get(
      'permission_end_date'
    ).value;
    const yearlyLeaveStart = this.formLeaveDetailRequest.get(
      'field_leave_end_date'
    ).value;
    const leaveDuration = this.formLeaveDetailRequest.get(
      'yearly_leave_duration'
    ).value;
    if (this.IsTypeIsLeave()) {
      if (
        this.formLeaveIdentity.get('leave_category').value === 'lapangan' &&
        !this.formLeaveDetailRequest.get('field_leave_duration').value
      ) {
        this.FillLeaveAmount();
      } else if (
        this.formLeaveIdentity.get('leave_category').value === 'lapangan' &&
        this.formLeaveDetailRequest.get('field_leave_duration').value
      ) {
        if (leaveDuration) {
          const resultStart = new Date(yearlyLeaveStart);
          resultStart.setDate(resultStart.getDate() + 1);
          this.formLeaveDetailRequest
            .get('yearly_leave_start_date')
            .setValue(resultStart);

          const resultEnd = new Date(yearlyLeaveStart);
          resultEnd.setDate(resultEnd.getDate() + parseInt(leaveDuration));
          this.formLeaveDetailRequest
            .get('yearly_leave_end_date')
            .setValue(resultEnd);
        }
      }
    } else if (this.IsTypeIsLeave() === false) {
      const resultStart = new Date(permissionEndDate);
      resultStart.setDate(resultStart.getDate() + 1);
      this.formLeaveDetailRequest
        .get('yearly_leave_start_date')
        .setValue(resultStart);

      const resultEnd = new Date(permissionEndDate);
      resultEnd.setDate(resultEnd.getDate() + parseInt(leaveDuration));
      this.formLeaveDetailRequest
        .get('yearly_leave_end_date')
        .setValue(resultEnd);
    }
  }

  CalculateMassiveLeaveDate() {
    // this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    // this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    if (this.permissionType !== 'pp') {
      this.formLeaveDetailRequest.get('is_permission').setValue(null);
      this.formLeaveDetailRequest.get('permission_type').setValue(null);
      this.formLeaveDetailRequest.get('permission_duration').setValue(null);
      this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
      this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    }
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
    const permissionEndDate = this.formLeaveDetailRequest.get(
      'permission_end_date'
    ).value;
    const leaveStart = this.formLeaveDetailRequest.get(
      'field_leave_end_date'
    ).value;
    const yearlyLeaveEnd = this.formLeaveDetailRequest.get(
      'yearly_leave_end_date'
    ).value;
    const massiveDuration = this.formLeaveDetailRequest.get(
      'massive_leave_duration'
    ).value;
    if (this.IsTypeIsLeave()) {
      if (
        !this.formLeaveDetailRequest.get('field_leave_duration').value  && !this.formLeaveDetailRequest.get('yearly_leave_duration').value
      ) {
        this.FillLeaveAmount();
      } else if (
        this.formLeaveDetailRequest.get('field_leave_duration').value && !this.formLeaveDetailRequest.get('yearly_leave_duration').value
      ) {
        if (massiveDuration) {
          const resultStart = new Date(leaveStart);
          resultStart.setDate(resultStart.getDate() + 1);
          this.formLeaveDetailRequest
            .get('massive_leave_start_date')
            .setValue(resultStart);

          const resultEnd = new Date(leaveStart);
          resultEnd.setDate(resultEnd.getDate() + parseInt(massiveDuration));
          this.formLeaveDetailRequest
            .get('massive_leave_end_date')
            .setValue(resultEnd);
        }
      } else if (
       this.formLeaveDetailRequest.get('yearly_leave_duration').value
      ){
        const resultStart = new Date(yearlyLeaveEnd);
        resultStart.setDate(resultStart.getDate() + 1);
        this.formLeaveDetailRequest
          .get('massive_leave_start_date')
          .setValue(resultStart);

        const resultEnd = new Date(yearlyLeaveEnd);
        resultEnd.setDate(resultEnd.getDate() + parseInt(massiveDuration));
        this.formLeaveDetailRequest
          .get('massive_leave_end_date')
          .setValue(resultEnd);
      }
    } else if (this.IsTypeIsLeave() === false) {
      if(
        !this.formLeaveDetailRequest.get('yearly_leave_duration').value
      ){
        const resultStart = new Date(permissionEndDate);
        resultStart.setDate(resultStart.getDate() + 1);
        this.formLeaveDetailRequest
          .get('massive_leave_start_date')
          .setValue(resultStart);

        const resultEnd = new Date(permissionEndDate);
        resultEnd.setDate(resultEnd.getDate() + parseInt(massiveDuration));
        this.formLeaveDetailRequest
          .get('massive_leave_end_date')
          .setValue(resultEnd);
      } else {
        const resultStart = new Date(yearlyLeaveEnd);
        resultStart.setDate(resultStart.getDate() + 1);
        this.formLeaveDetailRequest
          .get('massive_leave_start_date')
          .setValue(resultStart);

        const resultEnd = new Date(yearlyLeaveEnd);
        resultEnd.setDate(resultEnd.getDate() + parseInt(massiveDuration));
        this.formLeaveDetailRequest
          .get('massive_leave_end_date')
          .setValue(resultEnd);
      }

    }
  }

  // Metode untuk menghapus validator pada izin cuti
  removeValidatorsForPermissionLeave() {
    this.formLeaveDetailRequest.get('travel_date').clearValidators();
    this.formLeaveDetailRequest.get('field_leave_duration').clearValidators();
    this.formLeaveDetailRequest.get('is_permission').clearValidators();
    this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
    this.formLeaveDetailRequest.get('is_compensation').clearValidators();
    this.updateValidators();
  }

  // Metode untuk menghapus validator pada non izin cuti
  removeValidatorsForNonPermissionLeave() {
    this.formLeaveDetailRequest.get('departure_off_day').clearValidators();
    this.formLeaveDetailRequest.get('travel_date').clearValidators();
    this.formLeaveDetailRequest.get('field_leave_duration').clearValidators();
    this.formLeaveDetailRequest.get('is_permission').clearValidators();
    this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
    this.formLeaveDetailRequest.get('is_compensation').clearValidators();
    this.updateValidators();
  }

  // Metode untuk memperbarui validator setelah menghapusnya
  updateValidators() {
    this.formLeaveDetailRequest.updateValueAndValidity();
  }

  CalculateEndYearlyLeaveDate() {
    this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
    this.formLeaveDetailRequest.get('is_permission').setValue(null);
    this.formLeaveDetailRequest.get('permission_type').setValue(null);
    this.formLeaveDetailRequest.get('permission_duration').setValue(null);
    this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);

    const yearlyLeaveStart = this.formLeaveDetailRequest.get(
      'yearly_leave_start_date'
    ).value;
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get(
      'yearly_leave_duration'
    ).value;

    if (!yearlyLeaveDuration) {
      alert('isi dulu total cuti tahunannya');
      this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
    } else {
      const result = new Date(yearlyLeaveStart);
      // result.setDate(result.getDate() + 1);
      // this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(yearlyLeaveDuration) - 1);
      this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(result);
    }
  }

  CalculatePermissionLeaveDate() {
    if (
      !this.IsTypeIsLeave() &&
      this.formLeaveIdentity.get('permission_category').value === 'pp'
    ) {
      this.formLeaveDetailRequest.get('is_yearly_leave').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
    }
    if (this.IsTypeIsLeave()) {
      this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    }
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);

    const leaveDuration = this.formLeaveDetailRequest.get(
      'field_leave_duration'
    ).value;
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get(
      'yearly_leave_duration'
    ).value;
    const massiveLeaveDuration = this.formLeaveDetailRequest.get(
      'massive_leave_duration'
    ).value;
    const massiveEndDate = this.formLeaveDetailRequest.get(
      'massive_leave_end_date'
    ).value;
    const yearlyEndStartDate = this.formLeaveDetailRequest.get(
      'yearly_leave_start_date'
    ).value;
    const yearlyEndLeaveDate = this.formLeaveDetailRequest.get(
      'yearly_leave_end_date'
    ).value;
    const permissionDuration = this.formLeaveDetailRequest.get(
      'permission_duration'
    ).value;
    const leaveEndDate = this.formLeaveDetailRequest.get(
      'field_leave_end_date'
    ).value;
    const leaveCategory = this.formLeaveIdentity.get('leave_category').value;
    const isYearlyLeave =
      this.formLeaveDetailRequest.get('is_yearly_leave').value;
    const departureOffDay =
      this.formLeaveDetailRequest.get('departure_off_day').value;
    const permissionStartDate = this.formLeaveDetailRequest.get(
      'permission_start_date'
    ).value;

    if (this.IsTypeIsLeave()) {
      if (leaveCategory === 'lapangan') {
        if (leaveDuration && yearlyLeaveDuration && !massiveLeaveDuration) {
          const resultStart = new Date(yearlyEndLeaveDate);
          resultStart.setDate(resultStart.getDate() + 1);
          this.formLeaveDetailRequest
            .get('permission_start_date')
            .setValue(resultStart);

          const resultEnd = new Date(yearlyEndLeaveDate);
          resultEnd.setDate(resultEnd.getDate() + parseInt(permissionDuration));
          this.formLeaveDetailRequest
            .get('permission_end_date')
            .setValue(resultEnd);
        } else if ((leaveDuration && yearlyLeaveDuration && massiveLeaveDuration)||(leaveDuration && !yearlyLeaveDuration && massiveLeaveDuration)){
          const resultStart = new Date(massiveEndDate);
          resultStart.setDate(resultStart.getDate() + 1);
          this.formLeaveDetailRequest
            .get('permission_start_date')
            .setValue(resultStart);

          const resultEnd = new Date(massiveEndDate);
          resultEnd.setDate(resultEnd.getDate() + parseInt(permissionDuration));
          this.formLeaveDetailRequest
            .get('permission_end_date')
            .setValue(resultEnd);
        } else {
          if (!isYearlyLeave && !massiveLeaveDuration) {
            const resultStart = new Date(leaveEndDate);
            resultStart.setDate(resultStart.getDate() + 1);
            this.formLeaveDetailRequest
              .get('permission_start_date')
              .setValue(resultStart);

            const resultEnd = new Date(leaveEndDate);
            resultEnd.setDate(
              resultEnd.getDate() + parseInt(permissionDuration)
            );
            this.formLeaveDetailRequest
              .get('permission_end_date')
              .setValue(resultEnd);
          } else {
            // Handling case when isYearlyLeave is true
          }
        }
      } else if (leaveCategory === 'tahunan') {
        if(!massiveLeaveDuration && !massiveEndDate){
          if (!yearlyLeaveDuration || !yearlyEndStartDate) {
            this.formLeaveDetailRequest.get('permission_duration').setValue(null);
          } else {
            const resultStart = new Date(yearlyEndLeaveDate);
            resultStart.setDate(resultStart.getDate() + 1);
            this.formLeaveDetailRequest
              .get('permission_start_date')
              .setValue(resultStart);

            const resultEnd = new Date(yearlyEndLeaveDate);
            resultEnd.setDate(resultEnd.getDate() + parseInt(permissionDuration));
            this.formLeaveDetailRequest
              .get('permission_end_date')
              .setValue(resultEnd);
          }
        } else if (massiveLeaveDuration && yearlyLeaveDuration){
          const resultStart = new Date(massiveEndDate);
          resultStart.setDate(resultStart.getDate() + 1);
          this.formLeaveDetailRequest
            .get('permission_start_date')
            .setValue(resultStart);

          const resultEnd = new Date(massiveEndDate);
          resultEnd.setDate(resultEnd.getDate() + parseInt(permissionDuration));
          this.formLeaveDetailRequest
            .get('permission_end_date')
            .setValue(resultEnd);
        }
      }
    } else if (this.IsTypeIsLeave() === false) {
      if (this.permissionType === 'pp') {
        const result = new Date(permissionStartDate);
        result.setDate(result.getDate() + parseInt(permissionDuration) - 1);
        this.formLeaveDetailRequest.get('permission_end_date').setValue(result);


      } else if (this.permissionType === 'non_pp') {
        const result = new Date(permissionStartDate);
        result.setDate(result.getDate() + parseInt(permissionDuration) - 1);
        this.formLeaveDetailRequest.get('permission_end_date').setValue(result);
      }
    }
  }

  ResetFieldAfterInputPermissionAmount() {
    this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_yearly_leave').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
  }

  CalculateCompensationLeaveDate() {
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);

    const leaveDuration = this.formLeaveDetailRequest.get(
      'field_leave_duration'
    ).value;
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get(
      'yearly_leave_duration'
    ).value;
    const yearlyEndStartDate = this.formLeaveDetailRequest.get(
      'yearly_leave_start_date'
    ).value;
    const yearlyEndLeaveDate = this.formLeaveDetailRequest.get(
      'yearly_leave_end_date'
    ).value;
    const permissionDuration = this.formLeaveDetailRequest.get(
      'permission_duration'
    ).value;
    const leaveEndDate = this.formLeaveDetailRequest.get(
      'field_leave_end_date'
    ).value;
    const leaveCategory = this.formLeaveIdentity.get('leave_category').value;
    const isYearlyLeave =
      this.formLeaveDetailRequest.get('is_yearly_leave').value;
    const permissionEndDate = this.formLeaveDetailRequest.get(
      'permission_end_date'
    ).value;
    const compensationDuration = this.formLeaveDetailRequest.get(
      'compensation_duration'
    ).value;
    const massiveDuration = this.formLeaveDetailRequest.get(
      'massive_leave_duration'
    ).value;
    const massiveEndDate = this.formLeaveDetailRequest.get(
      'massive_leave_end_date'
    ).value;

    if(permissionDuration){
      const resultStart = new Date(permissionEndDate);
      resultStart.setDate(resultStart.getDate() + 1);
      this.formLeaveDetailRequest
        .get('compensation_start_date')
        .setValue(resultStart);

      const resultEnd = new Date(permissionEndDate);
      resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
      this.formLeaveDetailRequest
        .get('compensation_end_date')
        .setValue(resultEnd);
    } else if(massiveDuration){
      const resultStart = new Date(massiveEndDate);
      resultStart.setDate(resultStart.getDate() + 1);
      this.formLeaveDetailRequest
        .get('compensation_start_date')
        .setValue(resultStart);

      const resultEnd = new Date(massiveEndDate);
      resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
      this.formLeaveDetailRequest
        .get('compensation_end_date')
        .setValue(resultEnd);
    } else if(yearlyLeaveDuration){
      const resultStart = new Date(yearlyEndLeaveDate);
      resultStart.setDate(resultStart.getDate() + 1);
      this.formLeaveDetailRequest
        .get('compensation_start_date')
        .setValue(resultStart);

      const resultEnd = new Date(yearlyEndLeaveDate);
      resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
      this.formLeaveDetailRequest
        .get('compensation_end_date')
        .setValue(resultEnd);
    } else if(leaveDuration){
      const resultStart = new Date(leaveEndDate);
      resultStart.setDate(resultStart.getDate() + 1);
      this.formLeaveDetailRequest
        .get('compensation_start_date')
        .setValue(resultStart);

      const resultEnd = new Date(leaveEndDate);
      resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
      this.formLeaveDetailRequest
        .get('compensation_end_date')
        .setValue(resultEnd);
    }

    // if (leaveDuration && yearlyLeaveDuration && permissionDuration) {
    //   const resultStart = new Date(permissionEndDate);
    //   resultStart.setDate(resultStart.getDate() + 1);
    //   this.formLeaveDetailRequest
    //     .get('compensation_start_date')
    //     .setValue(resultStart);

    //   const resultEnd = new Date(permissionEndDate);
    //   resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
    //   this.formLeaveDetailRequest
    //     .get('compensation_end_date')
    //     .setValue(resultEnd);
    // } else if (leaveDuration && !yearlyLeaveDuration && !permissionDuration) {
    //   const resultStart = new Date(leaveEndDate);
    //   resultStart.setDate(resultStart.getDate() + 1);
    //   this.formLeaveDetailRequest
    //     .get('compensation_start_date')
    //     .setValue(resultStart);

    //   const resultEnd = new Date(leaveEndDate);
    //   resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
    //   this.formLeaveDetailRequest
    //     .get('compensation_end_date')
    //     .setValue(resultEnd);
    // } else if (leaveDuration && yearlyLeaveDuration && !permissionDuration) {
    //   const resultStart = new Date(yearlyEndLeaveDate);
    //   resultStart.setDate(resultStart.getDate() + 1);
    //   this.formLeaveDetailRequest
    //     .get('compensation_start_date')
    //     .setValue(resultStart);

    //   const resultEnd = new Date(yearlyEndLeaveDate);
    //   resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
    //   this.formLeaveDetailRequest
    //     .get('compensation_end_date')
    //     .setValue(resultEnd);
    // } else if (leaveDuration && !yearlyLeaveDuration && permissionDuration) {
    //   const resultStart = new Date(permissionEndDate);
    //   resultStart.setDate(resultStart.getDate() + 1);
    //   this.formLeaveDetailRequest
    //     .get('compensation_start_date')
    //     .setValue(resultStart);

    //   const resultEnd = new Date(permissionEndDate);
    //   resultEnd.setDate(resultEnd.getDate() + parseInt(compensationDuration));
    //   this.formLeaveDetailRequest
    //     .get('compensation_end_date')
    //     .setValue(resultEnd);
    // }
  }

  CalculateTotalLeaveAmount() {
    const leaveCategory = this.formLeaveIdentity.get('leave_category').value;
    const isYearlyLeave =
      this.formLeaveDetailRequest.get('is_yearly_leave').value;
    const isMassiveLeave = this.formLeaveDetailRequest.get('is_massive_leave').value
    const isPermissionLeave =
      this.formLeaveDetailRequest.get('is_permission').value;
    const isCompensationLeave =
      this.formLeaveDetailRequest.get('is_compensation').value;
    const permissionCategory = this.formLeaveIdentity.get(
      'permission_category'
    ).value;
    const permissionDuration = this.formLeaveDetailRequest.get(
      'permission_duration'
    ).value;
    const permissionStartDate = this.formLeaveDetailRequest.get(
      'permission_start_date'
    ).value;
    const permissionEndDate = this.formLeaveDetailRequest.get(
      'permission_end_date'
    ).value;
    const depatureDayOff =
      this.formLeaveDetailRequest.get('departure_off_day').value;
    const isTicketSupported = this.formLeaveIdentity.get(
      'is_ticket_supported'
    ).value;

    let leaveStartDate, leaveEndDate;
    if (this.IsTypeIsLeave()) {
      if (leaveCategory === 'tahunan') {
          if ((isPermissionLeave && !isMassiveLeave)||(isPermissionLeave && isMassiveLeave)) {
            leaveStartDate = new Date(
              this.formLeaveDetailRequest.get('yearly_leave_start_date').value
            );
            leaveEndDate = new Date(
              this.formLeaveDetailRequest.get('permission_end_date').value
            );
          } else if(!isPermissionLeave && isMassiveLeave){
            leaveStartDate = new Date(
              this.formLeaveDetailRequest.get('yearly_leave_start_date').value
            );
            leaveEndDate = new Date(
              this.formLeaveDetailRequest.get('massive_leave_end_date').value
            );
          } else {
            leaveStartDate = new Date(
              this.formLeaveDetailRequest.get('yearly_leave_start_date').value
            );
            leaveEndDate = new Date(
              this.formLeaveDetailRequest.get('yearly_leave_end_date').value
            );
          }
      } else if (leaveCategory === 'lapangan') {
        leaveStartDate = isTicketSupported
          ? new Date(this.formLeaveDetailRequest.get('departure_off_day').value)
          : new Date(
              this.formLeaveDetailRequest.get('field_leave_start_date').value
            );
        leaveEndDate = isCompensationLeave
          ? new Date(
              this.formLeaveDetailRequest.get('compensation_end_date').value
            )
          : isPermissionLeave
          ? new Date(
              this.formLeaveDetailRequest.get('permission_end_date').value
            )
          : isMassiveLeave ? new Date(
            this.formLeaveDetailRequest.get('massive_leave_end_date').value
          ) : isYearlyLeave
          ? new Date(
              this.formLeaveDetailRequest.get('yearly_leave_end_date').value
            )
          : new Date(
              this.formLeaveDetailRequest.get('field_leave_end_date').value
            );
      }
    } else {
      if (permissionCategory === 'pp') {
        leaveStartDate = new Date(
          this.formLeaveDetailRequest.get('departure_off_day').value
        );
        if (depatureDayOff.getTime() === permissionStartDate.getTime()) {
          leaveEndDate = isPermissionLeave
          ? new Date(
              this.formLeaveDetailRequest.get('permission_end_date').value
            )
          : isMassiveLeave ? new Date(
            this.formLeaveDetailRequest.get('massive_leave_end_date').value
          ) : isYearlyLeave
          ? new Date(
              this.formLeaveDetailRequest.get('yearly_leave_end_date').value
            )
          : new Date(
              this.formLeaveDetailRequest.get('field_leave_end_date').value
            );
        } else {
          if (isYearlyLeave && !isMassiveLeave) {
            const result = new Date(
              this.formLeaveDetailRequest.get('yearly_leave_end_date').value
            );
            result.setDate(result.getDate() + 1);
            leaveEndDate = result;
          } else if (!isYearlyLeave && !isMassiveLeave){
            const result = new Date(
              this.formLeaveDetailRequest.get('permission_end_date').value
            );
            result.setDate(result.getDate() + 1);
            leaveEndDate = result;
          } else if ((isYearlyLeave && isMassiveLeave)||(!isYearlyLeave && isMassiveLeave)) {
            const result = new Date(
              this.formLeaveDetailRequest.get('massive_leave_end_date').value
            );
            result.setDate(result.getDate() + 1);
            leaveEndDate = result;
          }
        }
      } else if (permissionCategory === 'non_pp') {
        leaveStartDate = new Date(
          this.formLeaveDetailRequest.get('permission_start_date').value
        );
        leaveEndDate = new Date(
          this.formLeaveDetailRequest.get('permission_end_date').value
        );
      }
    }

    let totalLeaveDays;

    if (permissionCategory === 'non_pp') {
      totalLeaveDays = Math.ceil(
        (leaveEndDate - leaveStartDate) / (1000 * 3600 * 24) + 1
      );
    } else if (permissionCategory === 'pp') {
      totalLeaveDays =
        Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 1;
    } else {
      if (leaveCategory === 'lapangan') {
        totalLeaveDays =
          Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 1;
      } else {
        totalLeaveDays =
          Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 1;
      }
    }

    this.formLeaveTicektApproval
      .get('leave_date_start_TicektApproval')
      .setValue(leaveStartDate);
    const result = new Date(leaveEndDate);
    if (isTicketSupported) {
      result.setDate(result.getDate() + 1);
    } else {
      result.setDate(result.getDate());
    }
    if (leaveCategory === 'lapangan') {
      // this.formLeaveDetailRequest.get('compensation_start_date').setValue(result);
      this.formLeaveTicektApproval
        .get('leave_date_end_TicektApproval')
        .setValue(result);
    } else {
      this.formLeaveTicektApproval
        .get('leave_date_end_TicektApproval')
        .setValue(leaveEndDate);
    }

    this.formLeaveTicektApproval
      .get('total_leave_amount')
      .setValue(String(totalLeaveDays));
  }

  travelDateValidator(departureOffDayControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const departureOffDay = control.parent?.get(
        departureOffDayControlName
      )?.value;
      const travelDate = control.value;

      if (!departureOffDay || !travelDate) {
        // Kembalikan null jika nilai departure_off_day atau travel_date kosong
        return null;
      }

      const departureOffDayDate = new Date(departureOffDay);
      const travelDateDate = new Date(travelDate);

      if (travelDateDate < departureOffDayDate) {
        // Kembalikan objek yang menunjukkan validasi gagal jika travel_date kurang dari atau sama dengan departure_off_day
        return { invalidTravelDate: true };
      }

      // Kembalikan null jika travel_date lebih besar dari departure_off_day
      return null;
    };
  }

  ResetTravelDate() {
    this.formLeaveDetailRequest.get('travel_date').setValue(null);
    this.formLeaveDetailRequest.get('field_leave_duration').setValue(null);
    this.formLeaveDetailRequest.get('field_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('field_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_yearly_leave').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_permission').setValue(null);
    this.formLeaveDetailRequest.get('permission_type').setValue(null);
    this.formLeaveDetailRequest.get('permission_duration').setValue(null);
    this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
    this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
  }

  IsYearlySelected() {
    if (this.IsTypeIsLeave()) {
      if (this.formLeaveIdentity.get('leave_category').value === 'lapangan') {
        if (this.formLeaveDetailRequest.get('is_yearly_leave').value === true) {
          return true;
        } else {
          return false;
        }
      } else if (
        this.formLeaveIdentity.get('leave_category').value === 'tahunan'
      ) {
        return true;
      } else {
        return false;
      }
    } else if (this.IsTypeIsLeave() === false) {
      if (this.permissionType === 'pp') {
        if (this.formLeaveDetailRequest.get('is_yearly_leave').value === true) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      // Handle the case when IsTypeIsLeave() is true but no condition matches
      return false;
    }
  }
  IsMassiveSelected() {
    if (this.IsTypeIsLeave()) {
      if (this.formLeaveDetailRequest.get('is_massive_leave').value === true) {
              this.formLeaveDetailRequest.get('massive_leave_duration').setValidators(        [
        Validators.required,
        Validators.pattern('^(0|[1-9]|1[0-9]|2[0-5])$'),
        this.validateMassiveLeaveDuration.bind(this),
      ])
      this.formLeaveDetailRequest.get('is_massive_leave').setValidators([Validators.required])
        return true;
      } else {
        this.formLeaveDetailRequest.get('is_massive_leave').clearValidators();
        this.formLeaveDetailRequest.get('massive_leave_duration').clearValidators();
        return false;
      }
    } else if (this.IsTypeIsLeave() === false) {
      if (this.permissionType === 'pp') {
        if (this.formLeaveDetailRequest.get('is_massive_leave').value === true) {
          this.formLeaveDetailRequest.get('massive_leave_duration').setValidators(        [
            Validators.required,
            Validators.pattern('^(0|[1-9]|1[0-9]|2[0-5])$'),
            this.validateMassiveLeaveDuration.bind(this),
          ])
          this.formLeaveDetailRequest.get('is_massive_leave').setValidators([Validators.required])
          return true;
        } else {
          this.formLeaveDetailRequest.get('is_massive_leave').clearValidators();
          this.formLeaveDetailRequest.get('massive_leave_duration').clearValidators();
          return false;
        }
      } else {
        this.formLeaveDetailRequest.get('is_massive_leave').clearValidators();
        this.formLeaveDetailRequest.get('massive_leave_duration').clearValidators();
        return false;
      }
    } else {
      // Handle the case when IsTypeIsLeave() is true but no condition matches
      this.formLeaveDetailRequest.get('is_massive_leave').clearValidators();
      this.formLeaveDetailRequest.get('massive_leave_duration').clearValidators();
      return false;
    }
  }

  SelectYealyLeave() {
    if (this.IsTypeIsLeave()) {
      this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('is_permission').setValue(null);
      this.formLeaveDetailRequest.get('permission_type').setValue(null);
      this.formLeaveDetailRequest.get('permission_duration').setValue(null);
      this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
      this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
      this.formLeaveDetailRequest.get('is_compensation').setValue(null);
      this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
      this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
      this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
      this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
    } else if (this.IsTypeIsLeave() === false) {
      this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('is_massive_leave').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
    }
  }

  SelectMassiveLeave() {
    if (this.IsTypeIsLeave()) {
      // this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
      // this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
      // this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
      this.formLeaveDetailRequest.get('is_permission').setValue(null);
      this.formLeaveDetailRequest.get('permission_type').setValue(null);
      this.formLeaveDetailRequest.get('permission_duration').setValue(null);
      this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
      this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
      this.formLeaveDetailRequest.get('is_compensation').setValue(null);
      this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
      this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
      this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
    } else if (this.IsTypeIsLeave() === false) {
      // this.formLeaveDetailRequest.get('yearly_leave_duration').setValue(null);
      // this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(null);
      // this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(null);

      this.formLeaveDetailRequest.get('massive_leave_start_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_end_date').setValue(null);
      this.formLeaveDetailRequest.get('massive_leave_duration').setValue(null);
    }
  }

  SelectPermission() {
    this.formLeaveDetailRequest.get('permission_type').setValue(null);
    this.formLeaveDetailRequest.get('permission_duration').setValue(null);
    this.formLeaveDetailRequest.get('permission_start_date').setValue(null);
    this.formLeaveDetailRequest.get('permission_end_date').setValue(null);
    this.formLeaveDetailRequest.get('is_compensation').setValue(null);
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
  }

  SelectCompensation() {
    this.formLeaveDetailRequest.get('compensation_duration').setValue(null);
    this.formLeaveDetailRequest.get('compensation_start_date').setValue(null);
    this.formLeaveDetailRequest.get('compensation_end_date').setValue(null);
  }

  IsPermissionSelected() {
    if (this.formLeaveDetailRequest.get('is_permission').value) {
      if (this.formLeaveDetailRequest.get('is_permission').value === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  }

  IsCompensationSelected() {
    if (this.formLeaveDetailRequest.get('is_compensation').value) {
      if (this.formLeaveDetailRequest.get('is_compensation').value === true) {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  }

  // Mat Auto Complite Filter Section

  private _filterAirPortTo(value: string) {

    const filterValue = value.toLowerCase();
    const results = this.airPortList.filter((option) =>
      option.city.toLowerCase().includes(filterValue)
    );
    return results.length ? results : [{ value: 'Data Tidak Ditemukan' }];
  }

  private _filterAirPortFrom(value: string) {
    const filterValue = value.toLowerCase();
    const results = this.airPortList.filter((option) =>
      option.city.toLowerCase().includes(filterValue)
    );
    return results.length ? results : [{ value: 'Data Tidak Ditemukan' }];
  }

  private _filterReasonPermission(value: string) {
    const filterValue = value.toLowerCase();
    const results = this.permissionList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
    return results.length ? results : [{ name: 'Data Tidak Ditemukan' }];
  }

  private _filteredSubtituteOfficer(value: string) {
    const filterValue = value.toLowerCase();
    const results = this.substituteOfficerList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
    return results.length ? results : [{ name: 'Data Tidak Ditemukan' }];
  }

  filterSubituteOfficer() {
    this.filteredSubtituteOfficer = this.formLeaveTicektApproval
      .get('substitute_officer')
      .valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name
            ? this._filteredSubtituteOfficer(name as string)
            : this.substituteOfficerList.slice();
        })
      );
  }


  FilterPermission() {
    this.filteredPermission = this.formLeaveDetailRequest
      .get('permission_type')
      .valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name
            ? this._filterReasonPermission(name as string)
            : this.permissionList.slice();
        })
      );
  }

  FilterAirPortTo() {
    this.filteredAirPortTo = this.ticketsTravel
      .at(0)
      .get('departure_to')
      .valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.value;
          return name
            ? this._filterAirPortTo(name as string)
            : this.airPortList.slice();
        })
      );
  }

  FilterAirPortFrom() {
    this.filteredAirPortFrom = this.ticketsTravel
      .at(0)
      .get('arrival_from')
      .valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.value;
          return name
            ? this._filterAirPortFrom(name as string)
            : this.airPortList.slice();
        })
      );
  }

  selectSubtituteOfficer() {
    const subtituteOfficer =
      this.formLeaveTicektApproval.get('substitute_officer').value;

    const selectedOfficer = this.substituteOfficerList.find(
      (officer) => officer._id === subtituteOfficer
    );

    if (selectedOfficer) {
      this.formLeaveTicektApproval
        .get('approval_id_1')
        .setValue(` ${selectedOfficer.employee_number} - ${selectedOfficer.name}`);
    } else {
      this.formLeaveTicektApproval.get('substitute_officer').setValue(null);
    }
  }

  formatToRupiah(amount: string): string {
    if (!amount) return '';

    // Mengubah nilai ke dalam format mata uang Rupiah
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });

    // Menghilangkan simbol mata uang dan titik decimal, serta menambahkan koma sebagai pemisah ribuan
    return (
      formatter
        .format(Number(amount))
        .replace('IDR', 'Rp')
        .replace(/\.00$/, '') + ',-'
    );
  }

  InvalidSwal() {
    Swal.fire({
      title: 'Invalid',
      html: 'Mohon Isi Kolom Yang Berwarna Merah',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    });
  }
  FillLeaveAmount() {
    Swal.fire({
      title: 'Invalid',
      html: 'Tolong Isi jumlah Hari Cuti Dulu',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    });
  }

  swalSuccess(){
    Swal.fire({
      title: 'Permohonan Berhasil Diajukan',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    }).then(
      (resp)=>{
        if(resp.isConfirmed){
          this.isWaitingForResponse = false
          this.router.navigate([this.previousPage]);
        }
      }
    )
  }



  getParamsId() {
    const getParams = this.route.snapshot.params['id'];
    const getParamsMode = this.route.snapshot.params['mode'];
    if (getParams) {
      this.subs.sink = this._formLeaveService
        .GetOneApplicationForm(getParams)
        .subscribe(
          (resp) => {
            this.requesterId = resp.employee_id?._id
            if(getParamsMode === 'preview'){
              this.isPreviewMode = true;
              this.openIdentity = true;
              this.openDetailRequest = true;
              this.openTicektApproval = true;
            }
            const data = resp;
            this.formID = getParams;
            if(resp.form_status){
              if(resp.form_status === 'revision'){
                this.isRevision = true
                this.reasonText = resp.approval[resp.current_approval_index].reason_of_revision
              } else if(resp.form_status === 'rejected'){
                this.isRejected  = true
                this.reasonText = resp.approval[resp.current_approval_index].reason_of_rejection
              }

            }
            setTimeout(() => {
              this.formStatus = resp.form_status;
              this.currentApprovers = resp.current_approvers;
              this.changeDetectorRef.detectChanges();
            }, 10);
            this.patchFormLeaveIdentity(data);
            this.patchFormLeaveDetailRequest(data.leaves);
            this.patchFormLeaveTicketApproval(data);
            if (resp.approval) {
              resp.approval.forEach(approval=>{
                if(approval.approval_index === 1){
                  this.formLeaveTicektApproval
                  .get('approval_id_2')
                  .setValue(approval.approver_id.employee_number + ' - ' + approval.approver_id.name);
                } else if (approval.approval_index === 2){
                  this.formLeaveTicektApproval
                  .get('approval_id_3')
                  .setValue(approval.approver_id.employee_number + ' - ' + approval.approver_id.name);
                }
              })
            }
          },
          (err) => {
            console.log('err', err);
          }
        );
    } else {
      return;
    }
  }

  patchFormLeaveIdentity(data: any) {
    this.formLeaveIdentity.patchValue({
      application_type: data?.application_type || null,
      name: data?.employee_id?.name || null,
      employee_number: data?.employee_id?.employee_number || null,
      family_status: data?.employee_id?.family_status || null,
      date_of_registration:
        data?.employee_id?.date_of_registration?.date || null,
      leave_location: data?.leave_location || null,
      phone_number: data?.phone_number || null,
      is_ticket_supported: data?.is_ticket_supported,
      position: data?.employee_id?.position?.name || null,
      poh_status: data?.employee_id?.poh_status ? this.PohConfigReturn(data.employee_id) : null,
      is_with_family: data?.is_with_family,
      is_routine_official_letter: data?.employee_id?.is_routine_official_letter,
      leave_address: data?.leave_address || null,
      is_lump_sump: data?.employee_id?.is_lump_sump,
      lump_sump_amount: this.formatToRupiah(data?.employee_id?.lump_sump_amount ?  data?.employee_id?.lump_sump_amount : (data?.employee_id?.lump_sump_amount === 0 ? 0 : null)) ,
      placement_status: data?.employee_id?.placement_status || null,
      leave_category: data?.leaves.leave_category || null,
      permission_category: data?.permission_category || null,
    });

    // Iterate through form controls and disable if they have a value
    const getParams = this.route.snapshot.params['mode'];
    if(getParams === 'preview'){
      Object.keys(this.formLeaveIdentity.controls).forEach((key) => {
        const control = this.formLeaveIdentity.get(key);
        if (control?.value !== null && control?.value !== undefined) {
          control.disable(); // Disable the control if it has a value
        }
      });
    }
  }

  patchFormLeaveDetailRequest(data: any) {
    this.formLeaveDetailRequest.patchValue({
      departure_off_day: data?.departure_off_day?.date
        ? new Date(this.convertDateFormat(data.departure_off_day.date)).toISOString()
        : null,
      travel_date: data?.travel_date
        ? new Date(this.convertDateFormat(data.travel_date)).toISOString()
        : null,
      field_leave_duration: data?.field_leave_duration
        ? data.field_leave_duration.toString()
        : null,
      field_leave_start_date: data?.field_leave_start_date
        ? new Date(this.convertDateFormat(data.field_leave_start_date)).toISOString()
        : null,
      field_leave_end_date: data?.field_leave_end_date
        ? new Date(this.convertDateFormat(data.field_leave_end_date)).toISOString()
        : null,
      is_yearly_leave: data?.is_yearly_leave,
      yearly_leave_duration: data?.yearly_leave_duration
        ? data.yearly_leave_duration.toString()
        : null,
      yearly_leave_start_date: data?.yearly_leave_start_date
        ? new Date(this.convertDateFormat(data.yearly_leave_start_date)).toISOString()
        : null,
      yearly_leave_end_date: data?.yearly_leave_end_date
        ? new Date(this.convertDateFormat(data.yearly_leave_end_date)).toISOString()
        : null,
        is_massive_leave: data?.is_massive_leave,
        massive_leave_duration: data?.massive_leave_duration
        ? data.massive_leave_duration.toString()
        : null,
        massive_leave_start_date: data?.massive_leave_start_date
        ? new Date(this.convertDateFormat(data.massive_leave_start_date)).toISOString()
        : null,
        massive_leave_end_date: data?.massive_leave_end_date
        ? new Date(this.convertDateFormat(data.massive_leave_end_date)).toISOString()
        : null,
      is_permission: data?.is_permission,
      permission_type: data?.permission_type || null,
      permission_duration: data?.permission_duration
        ? data.permission_duration.toString()
        : null,
      permission_start_date: data?.permission_start_date
        ? new Date(this.convertDateFormat(data.permission_start_date)).toISOString()
        : null,
      permission_end_date: data?.permission_end_date
        ? new Date(this.convertDateFormat(data.permission_end_date)).toISOString()
        : null,
      is_compensation: data?.is_compensation,
      compensation_duration: data?.compensation_duration
        ? data.compensation_duration.toString()
        : null,
      compensation_start_date: data?.compensation_start_date
        ? new Date(this.convertDateFormat(data.compensation_start_date)).toISOString()
        : null,
      compensation_end_date: data?.compensation_end_date
        ? new Date(this.convertDateFormat(data.compensation_end_date)).toISOString()
        : null,
      start_date: data?.field_leave_start_date
        ? new Date(this.convertDateFormat(data.field_leave_start_date)).toISOString()
        : null,
      end_date: data?.field_leave_end_date
        ? new Date(this.convertDateFormat(data.field_leave_end_date)).toISOString()
        : null,
    });

    console.log("WKWKWKKWW", this.formLeaveDetailRequest.value)

    const getParams = this.route.snapshot.params['mode'];
    if(getParams === 'preview'){
          // Iterate through form controls and disable if they have a value
    Object.keys(this.formLeaveDetailRequest.controls).forEach((key) => {
      const control = this.formLeaveDetailRequest.get(key);
      if (control?.value !== null && control?.value !== undefined) {
        control.disable(); // Disable the control if it has a value
      }
    });
    }
  }

  patchFormLeaveTicketApproval(data: any) {
    this.formLeaveTicektApproval.patchValue({
      leave_date_start_TicektApproval: data?.start_date
        ? new Date(this.convertDateFormat(data?.start_date)).toISOString()
        : null,
      leave_date_end_TicektApproval: data?.end_date
        ? new Date(this.convertDateFormat(data?.end_date)).toISOString()
        : null,
      total_leave_amount: data?.total_leaves || null, // Isi sesuai kebutuhan
      leave_comment: data?.leaves?.leave_comment || null,
      substitute_officer: data?.approval[0].approver_id?._id, // Isi sesuai kebutuhan
      pending_job: data?.pending_job || null,
      approval_id_1: `${data?.approval[0].approver_id?.employee_number} - ${data?.approval[0].approver_id?.name}`, // Isi sesuai kebutuhan
      approval_id_2: data?.approval?.[0]?.approver_id?.name || null, // Menggunakan nama approver pertama jika tersedia
      approval_id_3: data?.approval?.[1]?.approver_id?.name || null, // Menggunakan nama approver kedua jika tersedia
    });

    // Patch nilai ke dalam formLeaveTicektApproval.travel_tickets FormArray
    const getParams = this.route.snapshot.params['mode'];
    if(getParams === 'preview' || getParams === 'edit'){
      const ticketTravelArray = this.formLeaveTicektApproval.get(
        'travel_tickets'
      ) as FormArray;
      data?.travel_tickets?.forEach((ticket, index) => {
        ticketTravelArray.push(this.initTicketTravelFormArray(ticket, data,  index));
      });

          // Iterate through form controls and disable if they have a value
          if(getParams === 'preview'){
            Object.keys(this.formLeaveTicektApproval.controls).forEach((key) => {
              const control = this.formLeaveTicektApproval.get(key);
              if (control?.value !== null && control?.value !== undefined) {
                control.disable(); // Disable the control if it has a value
              }
            });
          }
    }
  }

  initTicketTravelFormArray(ticket: any, data, index) {

    return this._formBuilder.group({
      name: index === 0 ? data?.employee_id?.name : data?.travel_tickets[index].name,
      age: index === 0 ? data?.employee_id?.age : data?.travel_tickets[index].age,
      departure_from: 'Banjarmasin (BDJ)',
      departure_to: ticket.departure_to || null,
      arrival_from: ticket.arrival_from || null,
      arrival_to: 'Banjarmasin (BDJ)',
    });
  }

  GetOneUserLoginForm() {
    this.isWaitingForResponse = true
    this.subs.sink = this._formLeaveService
      .GetOneEmployee(this.employeeId)
      .subscribe(
        (resp) => {
          if (resp) {
            this.formData = resp;
            this.remainingYearlyLeaves = resp?.remaining_yearly_leaves;
            this.remainingMassiveLeaves = resp?.remaining_massive_leaves
            this.getParamsId();
            this.OpenIdentity();
            this.InitFormLeaveIdentity();
            this.InitFormLeaveDetailRequest();
            this.InitFormLeaveTicektApproval();
            this.GetAllUserForDropdown();
            this.GetAllApprovalGroups();
            this.FilterPermission();
            this.filterSubituteOfficer();
            this.poh_location = resp?.poh_location;
            this.PohConfig(resp);
            this.pohStatus = resp?.poh_status
            this.InitStartDateDatailRequestBackup();
            this.isWaitingForResponse = false
          }
        },
        (err) => {
          console.log('err', err);
        }
      );
  }

  PohConfigReturn(resp) {
    if (resp.poh_status === 'lokal') {
      return `LOKAL - ${this.poh_location}`
    } else if (resp.poh_status === 'non_lokal') {
      return `NON LOKAL - ${this.poh_location}`
    } else if (resp.poh_status === 'non_lokal_perumahan') {
      return `NON LOKAL PERUMAHAN - ${this.poh_location}`
    } else {
      return null
    }
  }
  PohConfig(resp) {
    if (resp.poh_status === 'lokal') {
      // this.formLeaveIdentity.get('poh_status').setValue('LOKAL')
      this.formLeaveIdentity
        .get('poh_status')
        .setValue(`LOKAL - ${this.poh_location}`);
      this.formLeaveIdentity.get('is_with_family').setValue(false);
      this.formLeaveIdentity.get('is_with_family').disable();
      this.formLeaveIdentity.get('is_ticket_supported').setValue(false);
      this.formLeaveIdentity.get('is_ticket_supported').disable();
      this.changeDetectorRef.detectChanges()
    } else if (resp.poh_status === 'non_lokal') {
      this.formLeaveIdentity
        .get('poh_status')
        .setValue(`NON LOKAL - ${this.poh_location}`);
      this.formLeaveIdentity.get('is_with_family').setValue(false);
      this.formLeaveIdentity.get('is_with_family').disable();
      this.changeDetectorRef.detectChanges()
    } else if (resp.poh_status === 'non_lokal_perumahan') {
      this.formLeaveIdentity
        .get('poh_status')
        .setValue(`NON LOKAL PERUMAHAN - ${this.poh_location}`);
        this.changeDetectorRef.detectChanges()
    }
  }

  SelectTicketSupported() {
    if (
      this.formLeaveIdentity.get('poh_status').value ===
      `NON LOKAL PERUMAHAN - ${this.poh_location}`
    ) {
      if (!this.IsTypeIsLeave()) {
        this.formLeaveIdentity.get('is_with_family').setValue(false);
        this.formLeaveIdentity.get('is_with_family').disable();
      } else {
        if (this.formLeaveIdentity.get('is_ticket_supported').value === false) {
          this.formLeaveIdentity.get('is_with_family').setValue(false);
          this.formLeaveIdentity.get('is_with_family').disable();
        } else {
          this.formLeaveIdentity.get('is_with_family').setValue(null);
          this.formLeaveIdentity.get('is_with_family').enable();
        }
      }
    }
  }

  GetAllUserForDropdown() {
    this.subs.sink = this._formLeaveService.GetAllEmployees().subscribe(
      (resp) => {
        if (resp) {
          this.substituteOfficerList = resp.map((emp) => ({
            ...emp, // salin semua properti asli
            displayName: `${emp.employee_number} - ${emp.name}`, // tambahkan displayName
          }));
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  GetAllApprovalGroups() {
    const getParams = this.route.snapshot.params['mode'];
    if(getParams === 'preview' ||getParams === 'edit' ){
      return
    } else {
      this.subs.sink = this._formLeaveService
      .GetAllApprovalGroups(this.employeeId)
      .subscribe(
        (resp) => {
          if (resp) {
            this.formLeaveTicektApproval
            .get('approval_id_2')
            .setValue( resp[0].approvals[0]?.default_approver?.employee_number + ' - ' + resp[0].approvals[0]?.default_approver?.name);
          this.formLeaveTicektApproval
            .get('approval_id_3')
            .setValue(resp[0].approvals[1]?.default_approver?.employee_number + ' - ' + resp[0].approvals[1]?.default_approver?.name);

          }
        },
        (err) => {
          console.log('err', err);
        }
      );
    }
  }

  validateOption(options): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedOption = control.value;
      const isValid = options.some((option) => option === selectedOption);
      return isValid ? null : { invalidOption: true };
    };
  }

  CancelCreateForm() {
    Swal.fire({
      title: 'Batalkan Form',
      html: 'Apa Anda Yakin Ingin Membatalkan?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Iya',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.router.navigate([this.previousPage]);
      } else {
        return;
      }
    });
  }

  backPreviousPage(){
    this.router.navigate([this.previousPage]);
  }

  formatDatePayload(date) {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    // Tambahkan nol di depan jika tanggal atau bulan kurang dari 10
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  OpenDialogApproval(order: string) {
    const dialogRef = this.dialog.open(ApprovalTableDialogComponent, {
      data: {
        order: order,
        formID: this.formID,
      },
      width: '600px',
      height: '340px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  ApproveForm() {
    Swal.fire({
      title: 'Apakah Anda yakin untuk Menyetujui permohonan?',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Iya',
      showCancelButton: true,
      cancelButtonText: 'Tidak',
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.SendApproveForm(this.formID);
      } else {
        return;
      }
    });
  }

  SendApproveForm(id: string) {
    this.isWaitingForResponse = true
    const approver = {
      approval_status: 'approved',
      approver_id: this.localStorageUser,
    };
    this.subs.sink = this._formLeaveService
      .UpdateApprovalApplicationForm(id, approver)
      .subscribe(
        (resp) => {
          if (resp) {
            this.isWaitingForResponse = false
            Swal.fire({
              title: 'Permohonan Disetujui',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              allowEnterKey: false,
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonText: 'Iya',
            }).then(() => {
              this.router.navigate([this.previousPage]);
            });
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ButtonApproveCondition(): boolean {
    return this.currentApprovers.some(
      (approver) => approver._id === this.localStorageUser
    ) && this.formStatus.includes('waiting_for_approval')
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
          this.GetOneUserLoginForm();
        }
      });
  }

  getFormIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  EditForm(){
    this.router.navigate([`/form-leave/edit/${this.formID}/${this.employeeId}`])
    setTimeout(() => {
      location.reload()
    }, 10);
  }

  convertDateFormat(date: string): string {
    // Split the date into parts using "/" as a delimiter
    const parts = date.split('/');

    // Ensure there are exactly three parts (day, month, year)
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected "dd/mm/yyyy".');
    }

    // Rearrange the parts from [day, month, year] to [month, day, year]
    const [day, month, year] = parts;
    const newFormat = `${month}/${day}/${year}`;

    return newFormat;
  }

  editCondition() : boolean{
    if(this.formStatus === 'revision' && this.requesterId === this.localStorageUser){
      return true
    } else if (this.formStatus === 'waiting_for_approval_1' && this.requesterId === this.localStorageUser){
      return true
    } else {
      return false
    }
  }

  ngOnDestroy(): void {
    // Cleanup subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
