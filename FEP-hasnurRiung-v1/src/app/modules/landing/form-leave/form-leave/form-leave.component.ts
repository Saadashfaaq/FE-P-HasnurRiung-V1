import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AsyncPipe, DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { airPortList } from 'src/app/services/form-leave/airport-list';
import { Observable, map, startWith } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-leave',
  standalone: true,
  imports: [
    SharedModule,
    NgSelectModule,
    AsyncPipe
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'fr'},
  ],
  templateUrl: './form-leave.component.html',
  styleUrl: './form-leave.component.scss'
})
export class FormLeaveComponent implements OnInit {

  constructor(
    private _formBuilder: UntypedFormBuilder,
    // private datePipe: DatePipe
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ){}

  isAplicationTypeLeave : boolean = null
  isPermissionPP : boolean = null
  permissionType : string

  ChangeAplication(){
    const applicationType = this.formLeaveIdentity.get('application_type').value
    if(applicationType === 'cuti'){
      this.isAplicationTypeLeave = true
    }
  }

  // Varibale to keep form Leave
  formLeaveIdentity : UntypedFormGroup
  formLeaveDetailRequest : UntypedFormGroup
  formLeaveTicektApproval : UntypedFormGroup

  dayOff : UntypedFormControl = new UntypedFormControl(null);

  filteredAirPortTo: Observable<any>
  filteredAirPortFrom: Observable<any>
  filteredPermission: Observable<any>

  //Boolena for open section
  openIdentity : boolean = false
  openDetailRequest : boolean = false
  openTicektApproval : boolean = false

  // Variable For Item List
  categoryList = [
    {
      name:'Cuti',
      value: 'cuti'
    },
    {
      name:'Ijin',
      value: 'ijin'
    },
    // {
    //   name:'Kompensasi',
    //   value: 'kompensasi'
    // }
  ]

  permissionList = [
    {
      name:'Menikah',
      value: 'menikah',
    },
    {
      name:'Anak Menikah',
      value: 'anak_menikah',
    },
    {
      name:'Saudara Kandung Menikah',
      value: 'saurdara_kandung_menikah',
    },
    {
      name:'Istri melahirkan/keguguran',
      value: 'istri_melahirkan_keguguran',
    },
    {
      name:'Istri/suami atau anak meninggal dunia',
      value: 'istri_suami_anak_meninggal_dunia',
    },
    {
      name:'Orang tua meninggal dunia',
      value: 'orang_tua_meninggal_dunia',
    },
    {
      name:'Mertua/menantu meninggal dunia',
      value: 'mertua_menantu_meninggal_dunia',
    },
    {
      name:'Saudara kandung meninggal dunia',
      value: 'saudara_kandung_meninggal_dunia',
    },
    {
      name:'Anggota keluarga serumah meninggal dunia',
      value: 'anggota_keluarga_serumah_meninggal_dunia',
    },
    {
      name:'Istri/suami atau anak sakit keras',
      value: 'istri_suami_anak_sakit_keras',
    },
    {
      name:'Pengkhitanan/pembaptisan anak',
      value: 'pengkhitanan_pembaptisan_anak',
    },
    {
      name:'Bencana alam',
      value: 'bencana_alam',
    },
    {
      name:'Sakit',
      value: 'sakit',
    },
  ];

  airPortList = airPortList
  substituteOfficerList = [
    {
      name:'Angelo',
      _id:'1221312'
    },
    {
      name:'Jansen',
      _id:'1edawdad'
    },
    {
      name:'Albatros',
      _id:'12213dad12'
    }
  ]

  isSection1Submited : boolean = false
  isSection2Submited : boolean = false
  isSection3Submited : boolean = false



  ngOnInit(): void {
    this.OpenIdentity()
    this.InitFormLeaveIdentity()
    this.InitFormLeaveDetailRequest()
    this.InitFormLeaveTicektApproval()
    this.SetDatePickerFormat()
    this.FilterPermission()
  }

  SetDatePickerFormat(){
    this._locale = 'en-US';
    this._adapter.setLocale(this._locale);
  }

  InitFormLeaveIdentity(){
    this.formLeaveIdentity = this._formBuilder.group({
      application_type: [null,[Validators.required]],
      date_eligible_for_leave:{value: '23 Desember 2024', disabled: true},
      name: {value: 'Albatros', disabled: true},
      employee_number: {value: '53jk4b53jk4b', disabled: true},
      family_status: {value: 'Complicated', disabled: true},
      date_of_registration: {value: '23 Desember 2024', disabled: true},
      leave_location : [null ,[Validators.required]],
      phone_number: [null ,[Validators.required]],
      is_ticket_supported: [null ,[Validators.required]],
      position: {value: 'FDGP HRGS', disabled: true},
      poh_status: {value: 'non_local_perumahan', disabled: true},
      is_with_family: [null],
      is_routine_official_letter: [null],
      leave_address: [null,[Validators.required]],
      is_lump_sump: [null],
      lump_sump_amount: {value: this.formatToRupiah('250000') , disabled: true},
      placement_status:{value: 'Site EBL', disabled: true},

      leave_category:[null,[Validators.required]],
      permission_category:['',[Validators.required]]
    })

    this.formLeaveIdentity.get('application_type').valueChanges.subscribe(value => {
      if(value === 'cuti') {
        this.formLeaveIdentity.get('leave_category').setValidators([Validators.required]);
        this.formLeaveIdentity.get('permission_category').clearValidators();
      } else if(value === 'ijin') {
        this.formLeaveIdentity.get('permission_category').setValidators([Validators.required]);
        this.formLeaveIdentity.get('leave_category').clearValidators();
      } else {
        this.formLeaveIdentity.get('leave_category').clearValidators();
        this.formLeaveIdentity.get('permission_category').clearValidators();
      }
      this.formLeaveIdentity.get('leave_category').updateValueAndValidity();
      this.formLeaveIdentity.get('permission_category').updateValueAndValidity();
    });
  }

  InitFormLeaveDetailRequest(){
    this.formLeaveDetailRequest = this._formBuilder.group({
      departure_off_day: ['',[Validators.required]],
      travel_date: ['',[Validators.required, this.travelDateValidator('departure_off_day')]],
      duration: ['',[Validators.required]],
      start_date:[''],
      end_date: [''],
      is_yearly_leave: ['',[Validators.required]],
      yearly_leave_duration: ['', [Validators.pattern("^[0-6]$")]],
      yearly_leave_start_date:[''],
      yearly_leave_end_date:[''],
      is_permission: ['',[Validators.required]],
      permission_category: [''],
      permission_duration:['',[Validators.required]],
      permission_start_date: [''],
      permission_end_date: [''],
      is_compensation:['',[Validators.required]],
      compensation_duration: [''],
      compensation_start_date: [''],
      compensation_end_date: [''],
    })

    this.formLeaveDetailRequest.get('is_yearly_leave').valueChanges.subscribe((value) => {
      this.updateYearlyLeaveValidation(value);
    });

  // Atur validasi permission_category dan permission_duration berdasarkan nilai is_permission saat form diinisialisasi
  this.formLeaveDetailRequest.get('is_permission').valueChanges.subscribe((value) => {
    this.updatePermissionValidation(value);
  });

  // Atur validasi compensation_duration berdasarkan nilai is_compensation saat form diinisialisasi
  this.formLeaveDetailRequest.get('is_compensation').valueChanges.subscribe((value) => {
    this.updateCompensationValidation(value);
  });
  }

  updateYearlyLeaveValidation(value: boolean) {
    const yearlyLeaveDurationControl = this.formLeaveDetailRequest.get('yearly_leave_duration');
    if (value) {
      yearlyLeaveDurationControl.setValidators([Validators.required, Validators.pattern("^[0-6]$")]);
    } else {
      yearlyLeaveDurationControl.clearValidators();
    }
    yearlyLeaveDurationControl.updateValueAndValidity();
  }

  updatePermissionValidation(value: boolean) {
    const permissionCategoryControl = this.formLeaveDetailRequest.get('permission_category');
    const permissionDurationControl = this.formLeaveDetailRequest.get('permission_duration');
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
    const compensationDurationControl = this.formLeaveDetailRequest.get('compensation_duration');
    if (value) {
      compensationDurationControl.setValidators([Validators.required]);
    } else {
      compensationDurationControl.clearValidators();
    }
    compensationDurationControl.updateValueAndValidity();
  }


  formatDate(date: Date): string {
    if (!date) return ''; // Jika tanggal tidak tersedia, kembalikan string kosong
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[new Date(date).getDay()];
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1; // Perlu ditambah 1 karena Januari dimulai dari 0
    const year = new Date(date).getFullYear();

    return dayName + ', ' + (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
  }



  InitFormLeaveTicektApproval(){
    this.formLeaveTicektApproval = this._formBuilder.group({
      leave_date_start_TicektApproval:[''],
      leave_date_end_TicektApproval: [''],
      total_leave_amount: [''],
      leave_comment: ['',[Validators.required]],
      tickets_travel: this._formBuilder.array([]),
      substitute_officer:['',[Validators.required]],
      pending_job:['',[Validators.required]],
      approval_id_1: {value: '', disabled: true},
      approval_id_2: {value: 'Jansen', disabled: true},
      approval_id_3: {value: 'Angelo', disabled: true}
    })
  }

  InitTicketTravelFormArray(){
   return this._formBuilder.group({
      name:{value: 'Albatros', disabled: true},
      age: {value: '26', disabled: true},
      departure_from: {value: 'BDJ', disabled: true},
      departure_to: ['',[Validators.required]],
      return_from: ['',[Validators.required]],
      return_to: {value: 'BDJ', disabled: true},
    })
  }

  get ticketsTravel() : FormArray{
    return this.formLeaveTicektApproval.get('tickets_travel') as FormArray
  }

  UpdateTicketTravel (ticketDatas : any[]){
    const ticketTravelArray = this.formLeaveTicektApproval.get('tickets_travel') as FormArray
    ticketDatas.forEach((ticketData)=>{
      ticketTravelArray.push(this.InitTicketTravelFormArray())
    })
  }

  InisiateFirstIndexFormArray(){
    const newTicketFormGroup = this.InitTicketTravelFormArray();
    this.ticketsTravel.push(newTicketFormGroup); 
  }

  CreateTicketTravelArray() {
    if(this.ticketsTravel.at(0).get('departure_to').value && this.ticketsTravel.at(0).get('return_from').value){
      const newTicketFormGroup = this._formBuilder.group({
        name: [''],
        age: [''],
        departure_from: {value: 'BDJ', disabled: true}, // buat field ini disable
        departure_to: {value: this.ticketsTravel.at(0).get('departure_to').value, disabled: true}, // buat field ini disable
        return_from: {value: this.ticketsTravel.at(0).get('return_from').value, disabled: true}, // buat field ini disable
        return_to: {value: 'BDJ', disabled: true}, // buat field ini disable
      });
      this.ticketsTravel.push(newTicketFormGroup); 
      const tricketTravelIndex = this.ticketsTravel.length -1
      this.ticketsTravel.at(tricketTravelIndex).get('departure_from').setValue('BDJ')
      this.ticketsTravel.at(tricketTravelIndex).get('departure_to').setValue( this.ticketsTravel.at(0).get('departure_to').value)
      this.ticketsTravel.at(tricketTravelIndex).get('return_from').setValue(this.ticketsTravel.at(0).get('return_from').value)
      this.ticketsTravel.at(tricketTravelIndex).get('return_to').setValue('BDJ')
    } else {
      // alert("SALAH")
    }
  }

  RemoveTicket(index){
    this.ticketsTravel.removeAt(index)
  }

  UpdateAirPortFormArrFrom() {
    console.log("Nyampe");
    console.log(this.ticketsTravel);
    console.log("Panjang ticketsTravel:", this.ticketsTravel.length);
    if (this.ticketsTravel.length > 1) {
      while (this.ticketsTravel.length > 1) {
        this.ticketsTravel.removeAt(1); // Hapus elemen dari indeks 1 ke atas
      }
    }
  }
  
  UpdateAirPortFormArrTo() {
    console.log("Nyampe");
    console.log(this.ticketsTravel);
    console.log("Panjang ticketsTravel:", this.ticketsTravel.length);
    if (this.ticketsTravel.length > 1) {
      while (this.ticketsTravel.length > 1) {
        this.ticketsTravel.removeAt(1); // Hapus elemen dari indeks 1 ke atas
      }
    }
  }

  OpenIdentity(){
    this.openIdentity = true
    this.openDetailRequest = false
    this.openTicektApproval = false
    this.isSection1Submited = false
    this.isSection2Submited = false
    this.isSection3Submited = false
  }
  OpenDetailRequest(){
    this.openIdentity = false
    this.openDetailRequest = true
    this.openTicektApproval = false
    this.isSection1Submited = false
    this.isSection2Submited = false
  }
  OpenTicektApproval(){
    this.openIdentity = false
    this.openDetailRequest = false
    this.openTicektApproval = true
    this.isSection3Submited = false
  }

  SaveIdentity(){
    this.isSection1Submited = true
    if(this.formLeaveIdentity.invalid){
      console.log("TESTING", this.formLeaveIdentity)
      this.InvalidSwal()
    } else {
      this.openIdentity = false
      this.openDetailRequest = true
      this.openTicektApproval = false
      console.log("this.formLeaveIdentity.get('application_type').value ",this.formLeaveIdentity.get('application_type').value )
      console.log("this.formLeaveIdentity.get('application_type').value ", this.formLeaveIdentity.get('permission_category').value )
      if(this.formLeaveIdentity.get('application_type').value === 'ijin'){
        if(this.formLeaveIdentity.get('permission_category').value === 'pp'){
          this.removeValidatorsForPermissionLeave();
          console.log("pp")
        } else if(this.formLeaveIdentity.get('permission_category').value === 'non_pp'){
          this.removeValidatorsForNonPermissionLeave();
          console.log("non_pp")
        }
      }
    }
  }

  SaveDetailRequest(){
    this.isSection2Submited = true
    if(this.formLeaveDetailRequest.invalid){
      console.log("this.formLeaveDetailRequest:", this.formLeaveDetailRequest)
      this.InvalidSwal()
    } else {
      this.openIdentity = false
      this.openDetailRequest = false
      this.openTicektApproval = true
      this.CalculateTotalLeaveAmount()
      if(this.formLeaveIdentity.get('is_ticket_supported').value){
        this.InisiateFirstIndexFormArray()
        this.FilterAirPortTo()
        this.FilterAirPortFrom()
      }
    }
  }

  SaveTicektApproval(){
    this.isSection3Submited = true
    if(this.formLeaveTicektApproval.invalid){
      this.InvalidSwal()
    } else {
      this.openIdentity = true
      this.openDetailRequest = false
      this.openTicektApproval = false
    }
  }

  consoleLOG(){
    console.log("1",this.formLeaveIdentity)
    console.log("2",this.formLeaveDetailRequest)
    console.log("3",this.formLeaveTicektApproval)
  }


  // Section Form Condition
  IsTypeIsLeave(): boolean{
    if(this.formLeaveIdentity.get('application_type').value){
      if(this.formLeaveIdentity.get('application_type').value === 'cuti'){
        return true
      } else {
        return false
      }
    } else {
      return null
    }
  }

  PermissionTypeCondition(){
    const permissionType = this.formLeaveIdentity.get('permission_category').value
    if(permissionType === 'pp'){
      this.permissionType = 'pp'
      this.formLeaveIdentity.get('is_ticket_supported').reset()
      this.formLeaveIdentity.get('is_ticket_supported').enable()
      this.formLeaveDetailRequest.get('permission_start_date').disable()
      this.formLeaveDetailRequest.get('permission_end_date').disable()
      this.formLeaveDetailRequest.get('permission_start_date').disable()
      this.formLeaveDetailRequest.get('permission_end_date').disable()
      this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').disable()
      this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').disable()
    } else if(permissionType === 'non_pp') {
      this.permissionType = 'non_pp'
      this.formLeaveIdentity.get('is_ticket_supported').setValue(false)
      this.formLeaveIdentity.get('is_ticket_supported').disable()
      this.formLeaveDetailRequest.get('permission_start_date').enable()
      this.formLeaveDetailRequest.get('permission_end_date').disable()
      this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').disable()
      this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').disable()
    }
  }

  LeaveTypeCondition(){
    if(this.formLeaveIdentity.get('leave_category').value){
      if(this.formLeaveIdentity.get('leave_category').value === 'tahunan'){
        this.formLeaveDetailRequest.get('is_yearly_leave').setValue(true)
        this.formLeaveIdentity.get('is_ticket_supported').setValue(false)
        this.formLeaveIdentity.get('is_ticket_supported').disable()
        this.formLeaveDetailRequest.get('yearly_leave_start_date').enable()
        this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').disable()
        this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').disable()
        this.formLeaveTicektApproval.get('total_leave_amount').disable()
      } else {
        this.formLeaveIdentity.get('is_ticket_supported').reset()
        this.formLeaveIdentity.get('is_ticket_supported').enable()
        this.formLeaveDetailRequest.get('yearly_leave_start_date').disable()
        this.formLeaveDetailRequest.get('start_date').disable()
        this.formLeaveDetailRequest.get('end_date').disable()
        this.formLeaveDetailRequest.get('yearly_leave_start_date').disable()
        this.formLeaveDetailRequest.get('yearly_leave_end_date').disable()
        this.formLeaveDetailRequest.get('permission_start_date').disable()
        this.formLeaveDetailRequest.get('permission_end_date').disable()
        this.formLeaveDetailRequest.get('compensation_start_date').disable()
        this.formLeaveDetailRequest.get('compensation_end_date').disable()
        this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').disable()
        this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').disable()
        this.formLeaveTicektApproval.get('total_leave_amount').disable()
        this.formLeaveDetailRequest.get('is_yearly_leave').reset()
      }
    }
  }

  IsLeaveCategoryIsYearly(): boolean {
    if(this.formLeaveIdentity.get('leave_category').value){
      if(this.formLeaveIdentity.get('leave_category').value === 'tahunan'){
        return true
      } else {
        return false
      }
    } else {
      return null
    }
  }

  IsPohNonLocalPerumahan(): boolean{
    if(this.formLeaveIdentity.get('poh_status').value){
      if(this.formLeaveIdentity.get('poh_status').value === 'non_local_perumahan'){
        return true
      } else {
        return false
      }
    } else {
      return null
    }
  }


  // Regex Input For Numeric 
  preventNonNumericalInput(event) {
    if (event && event.key) {
      if (!event.key.match(/^[0-9]+$/)) {
        event.preventDefault();
      }
    }
  }
  ResetBottomData(){
    this.formLeaveDetailRequest.get('duration').reset()
    this.formLeaveDetailRequest.get('start_date').reset()
    this.formLeaveDetailRequest.get('end_date').reset()
    this.formLeaveDetailRequest.get('is_yearly_leave').reset()
    this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_permission').reset()
    this.formLeaveDetailRequest.get('permission_category').reset()
    this.formLeaveDetailRequest.get('permission_duration').reset()
    this.formLeaveDetailRequest.get('permission_start_date').reset()
    this.formLeaveDetailRequest.get('permission_end_date').reset()
    this.formLeaveDetailRequest.get('is_compensation').reset()
    this.formLeaveDetailRequest.get('compensation_duration').reset()
    this.formLeaveDetailRequest.get('compensation_start_date').reset()
    this.formLeaveDetailRequest.get('compensation_end_date').reset()
  }

  CalculateLeaveDate() {
    this.formLeaveDetailRequest.get('start_date').reset()
    this.formLeaveDetailRequest.get('end_date').reset()
    this.formLeaveDetailRequest.get('is_yearly_leave').reset()
    this.formLeaveDetailRequest.get('yearly_leave_duration').reset()
    this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_permission').reset()
    this.formLeaveDetailRequest.get('permission_category').reset()
    this.formLeaveDetailRequest.get('permission_duration').reset()
    this.formLeaveDetailRequest.get('permission_start_date').reset()
    this.formLeaveDetailRequest.get('permission_end_date').reset()
    this.formLeaveDetailRequest.get('is_compensation').reset()
    this.formLeaveDetailRequest.get('compensation_duration').reset()
    this.formLeaveDetailRequest.get('compensation_start_date').reset()
    this.formLeaveDetailRequest.get('compensation_end_date').reset()

    const travelDate = this.formLeaveDetailRequest.get('travel_date').value;
    if (travelDate) {
      const result = new Date(travelDate);
      result.setDate(result.getDate() + 1);
      this.formLeaveDetailRequest.get('start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(this.formLeaveDetailRequest.get('duration').value) );
      this.formLeaveDetailRequest.get('end_date').setValue(result);
    } else {
      console.error("Travel date is invalid.");
    }
  }

  CalculateYearlyLeaveDate(){
    const permissionEndDate = this.formLeaveDetailRequest.get('permission_end_date').value
    const yearlyLeaveStart = this.formLeaveDetailRequest.get('end_date').value
    const leaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value
    if(this.IsTypeIsLeave()){
      if( this.formLeaveIdentity.get('leave_category').value === 'lapangan' && !this.formLeaveDetailRequest.get('duration').value){
        alert('tolong isi jumlah hari cuti dulu')
      } else if(this.formLeaveIdentity.get('leave_category').value === 'lapangan' && this.formLeaveDetailRequest.get('duration').value) {
        if(leaveDuration){
          const result = new Date(yearlyLeaveStart);
          result.setDate(result.getDate() + 1);
          this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(result);
          result.setDate(result.getDate() + parseInt(leaveDuration) - 1);
          this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(result);
        }
      }
    } else if(this.IsTypeIsLeave() === false){
      const result = new Date(permissionEndDate);
      result.setDate(result.getDate() + 1);
      this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(leaveDuration) - 1);
      this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(result);
    }
  }

  // Metode untuk menghapus validator pada izin cuti
removeValidatorsForPermissionLeave() {
  this.formLeaveDetailRequest.get('travel_date').clearValidators();
  this.formLeaveDetailRequest.get('duration').clearValidators();
  this.formLeaveDetailRequest.get('is_permission').clearValidators();
  this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
  this.formLeaveDetailRequest.get('is_compensation').clearValidators();
  this.updateValidators();
}

// Metode untuk menghapus validator pada non izin cuti
removeValidatorsForNonPermissionLeave() {
  // this.formLeaveDetailRequest.get('departure_off_day').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('travel_date').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('duration').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('is_permission').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
  // this.formLeaveDetailRequest.get('is_compensation').setValidators([Validators.required]);
  this.formLeaveDetailRequest.get('departure_off_day').clearValidators();
  this.formLeaveDetailRequest.get('travel_date').clearValidators();
  this.formLeaveDetailRequest.get('duration').clearValidators();
  this.formLeaveDetailRequest.get('is_permission').clearValidators();
  this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
  this.formLeaveDetailRequest.get('is_compensation').clearValidators();
  this.updateValidators();
}

// Metode untuk memperbarui validator setelah menghapusnya
updateValidators() {
  this.formLeaveDetailRequest.updateValueAndValidity();
}

  CalculateEndYearlyLeaveDate(){
    const yearlyLeaveStart = this.formLeaveDetailRequest.get('yearly_leave_start_date').value
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value

    if(!yearlyLeaveDuration){
      alert("isi dulu total cuti tahunannya")
      this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    } else {
      const result = new Date(yearlyLeaveStart);
      // result.setDate(result.getDate() + 1);
      // this.formLeaveDetailRequest.get('yearly_leave_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(yearlyLeaveDuration));
      this.formLeaveDetailRequest.get('yearly_leave_end_date').setValue(result);
    }
  }

  CalculatePermissionLeaveDate(){
    const leaveDuration = this.formLeaveDetailRequest.get('duration').value
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value
    const yearlyEndStartDate = this.formLeaveDetailRequest.get('yearly_leave_start_date').value
    const yearlyEndLeaveDate = this.formLeaveDetailRequest.get('yearly_leave_end_date').value
    const permissionDuration = this.formLeaveDetailRequest.get('permission_duration').value
    const leaveEndDate = this.formLeaveDetailRequest.get('end_date').value
    const leaveCategory =  this.formLeaveIdentity.get('leave_category').value
    const isYearlyLeave = this.formLeaveDetailRequest.get('is_yearly_leave').value
    const departureOffDay = this.formLeaveDetailRequest.get('departure_off_day').value
    const permissionStartDate = this.formLeaveDetailRequest.get('permission_start_date').value

    if(this.IsTypeIsLeave()){
      if(leaveCategory === 'lapangan'){
        if(leaveDuration && yearlyLeaveDuration){
          const result = new Date(yearlyEndLeaveDate);
          result.setDate(result.getDate() + 1);
          this.formLeaveDetailRequest.get('permission_start_date').setValue(result);
          result.setDate(result.getDate() + parseInt(permissionDuration)- 1);
          this.formLeaveDetailRequest.get('permission_end_date').setValue(result);
        } else {
          if(!isYearlyLeave){
            const result = new Date(leaveEndDate);
            result.setDate(result.getDate() + 1);
            this.formLeaveDetailRequest.get('permission_start_date').setValue(result);
            result.setDate(result.getDate() + parseInt(permissionDuration) -1);
            this.formLeaveDetailRequest.get('permission_end_date').setValue(result);
          } else {
            // alert("FAIL CONDITION 1")
          }
        }
      } else if (leaveCategory === 'tahunan'){
        if(!yearlyLeaveDuration || !yearlyEndStartDate){
          // alert("FAIL CONDITION 2")
          this.formLeaveDetailRequest.get('permission_duration').reset()
  
        } else {
          const result = new Date(yearlyEndLeaveDate);
          result.setDate(result.getDate() + 1);
          this.formLeaveDetailRequest.get('permission_start_date').setValue(result);
          result.setDate(result.getDate() + parseInt(permissionDuration) - 1);
          this.formLeaveDetailRequest.get('permission_end_date').setValue(result);
        }
      }
    } else if(this.IsTypeIsLeave() === false){
      if(this.permissionType === 'pp'){
        const result = new Date(departureOffDay);
        result.setDate(result.getDate() + 1);
        this.formLeaveDetailRequest.get('permission_start_date').setValue(result);
        result.setDate(result.getDate() + parseInt(permissionDuration)- 1);
        this.formLeaveDetailRequest.get('permission_end_date').setValue(result);
      } else if(this.permissionType === 'non_pp'){
        const result = new Date(permissionStartDate);
        result.setDate(result.getDate() + parseInt(permissionDuration)- 1);
        this.formLeaveDetailRequest.get('permission_end_date').setValue(result);
      }
    }
  }

  CalculateCompensationLeaveDate(){
    const leaveDuration = this.formLeaveDetailRequest.get('duration').value
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value
    const yearlyEndStartDate = this.formLeaveDetailRequest.get('yearly_leave_start_date').value
    const yearlyEndLeaveDate = this.formLeaveDetailRequest.get('yearly_leave_end_date').value
    const permissionDuration = this.formLeaveDetailRequest.get('permission_duration').value
    const leaveEndDate = this.formLeaveDetailRequest.get('end_date').value
    const leaveCategory =  this.formLeaveIdentity.get('leave_category').value
    const isYearlyLeave = this.formLeaveDetailRequest.get('is_yearly_leave').value
    const permissionEndDate = this.formLeaveDetailRequest.get('permission_end_date').value

    if(leaveDuration && yearlyLeaveDuration && permissionDuration){
      const result = new Date(permissionEndDate);
      result.setDate(result.getDate() + 1);
      this.formLeaveDetailRequest.get('compensation_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(permissionDuration) - 2);
      this.formLeaveDetailRequest.get('compensation_end_date').setValue(result);
    } else if (leaveDuration && !yearlyLeaveDuration && !permissionDuration){
      const result = new Date(leaveEndDate);
      result.setDate(result.getDate() + 1);
      this.formLeaveDetailRequest.get('compensation_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(permissionDuration) - 2);
    } else if (leaveDuration && yearlyLeaveDuration && !permissionDuration){
      const result = new Date(yearlyEndLeaveDate);
      result.setDate(result.getDate() + 1);
      this.formLeaveDetailRequest.get('compensation_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(permissionDuration) - 2);
    }
  }

  CalculateTotalLeaveAmount() {
    const leaveCategory = this.formLeaveIdentity.get('leave_category').value;
    const isYearlyLeave = this.formLeaveDetailRequest.get('is_yearly_leave').value;
    const isPermissionLeave = this.formLeaveDetailRequest.get('is_permission').value;
    const isCompensationLeave = this.formLeaveDetailRequest.get('is_compensation').value;
    const permissionCategory = this.formLeaveIdentity.get('permission_category').value
    const permissionDuration = this.formLeaveDetailRequest.get('permission_duration').value
    const permissionStartDate = this.formLeaveDetailRequest.get('permission_start_date').value
    const permissionEndDate = this.formLeaveDetailRequest.get('permission_end_date').value
    
    let leaveStartDate, leaveEndDate;
    if(this.IsTypeIsLeave()){
      if (leaveCategory === 'tahunan') {
        leaveStartDate = new Date(this.formLeaveDetailRequest.get('yearly_leave_start_date').value);
        leaveEndDate = new Date(this.formLeaveDetailRequest.get('yearly_leave_end_date').value);
    } else if (leaveCategory === 'lapangan') {
        leaveStartDate = new Date(this.formLeaveDetailRequest.get('departure_off_day').value);
        leaveEndDate = isCompensationLeave ? 
            new Date(this.formLeaveDetailRequest.get('compensation_end_date').value) :
            (isPermissionLeave ? 
                new Date(this.formLeaveDetailRequest.get('permission_end_date').value) :
                new Date(this.formLeaveDetailRequest.get('end_date').value)
            );
    }
    } else if (this.IsTypeIsLeave() === false ){
      if(permissionCategory === 'pp'){
        if(isYearlyLeave){
          leaveStartDate = new Date(this.formLeaveDetailRequest.get('permission_start_date').value);
          leaveEndDate = new Date(this.formLeaveDetailRequest.get('yearly_leave_end_date').value);
        } else {
          leaveStartDate = new Date(this.formLeaveDetailRequest.get('permission_start_date').value);
          leaveEndDate = new Date(this.formLeaveDetailRequest.get('permission_end_date').value);
        }
      } else if(permissionCategory === 'non_pp'){
        leaveStartDate = new Date(this.formLeaveDetailRequest.get('permission_start_date').value);
        leaveEndDate = new Date(this.formLeaveDetailRequest.get('permission_end_date').value);
      }
    }

    const totalLeaveDays = ( permissionCategory == 'non_pp') || ( permissionCategory == 'pp' && !isYearlyLeave) ? Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 1 : Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 2;

    this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').setValue(leaveStartDate);
    this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').setValue(leaveEndDate);
    this.formLeaveTicektApproval.get('total_leave_amount').setValue(String(totalLeaveDays));
}


  travelDateValidator(departureOffDayControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const departureOffDay = control.parent?.get(departureOffDayControlName)?.value;
      const travelDate = control.value;
  
      if (!departureOffDay || !travelDate) {
        // Kembalikan null jika nilai departure_off_day atau travel_date kosong
        return null;
      }
  
      const departureOffDayDate = new Date(departureOffDay);
      const travelDateDate = new Date(travelDate);
  
      if (travelDateDate < departureOffDayDate) {
        // Kembalikan objek yang menunjukkan validasi gagal jika travel_date kurang dari atau sama dengan departure_off_day
        return { 'invalidTravelDate': true };
      }
  
      // Kembalikan null jika travel_date lebih besar dari departure_off_day
      return null;
    };
  }

  ResetTravelDate(){
    this.formLeaveDetailRequest.get('travel_date').reset()
    this.formLeaveDetailRequest.get('duration').reset()
    this.formLeaveDetailRequest.get('start_date').reset()
    this.formLeaveDetailRequest.get('end_date').reset()
    this.formLeaveDetailRequest.get('is_yearly_leave').reset()
    this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_permission').reset()
    this.formLeaveDetailRequest.get('permission_category').reset()
    this.formLeaveDetailRequest.get('permission_duration').reset()
    this.formLeaveDetailRequest.get('permission_start_date').reset()
    this.formLeaveDetailRequest.get('permission_end_date').reset()
    this.formLeaveDetailRequest.get('is_compensation').reset()
    this.formLeaveDetailRequest.get('compensation_duration').reset()
    this.formLeaveDetailRequest.get('compensation_start_date').reset()
    this.formLeaveDetailRequest.get('compensation_end_date').reset()
  }

  IsYearlySelected() {
    if (this.IsTypeIsLeave()) {
        if (this.formLeaveIdentity.get('leave_category').value === 'lapangan') {
            if (this.formLeaveDetailRequest.get('is_yearly_leave').value === true) {
                return true;
            } else {
                return false;
            }
        } else if (this.formLeaveIdentity.get('leave_category').value === 'tahunan') {
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


  SelectYealyLeave(){
    if(this.IsTypeIsLeave()){
      this.formLeaveDetailRequest.get('yearly_leave_duration').reset()
      this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
      this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
      this.formLeaveDetailRequest.get('is_permission').reset()
      this.formLeaveDetailRequest.get('permission_category').reset()
      this.formLeaveDetailRequest.get('permission_duration').reset()
      this.formLeaveDetailRequest.get('permission_start_date').reset()
      this.formLeaveDetailRequest.get('permission_end_date').reset()
      this.formLeaveDetailRequest.get('is_compensation').reset()
      this.formLeaveDetailRequest.get('compensation_duration').reset()
      this.formLeaveDetailRequest.get('compensation_start_date').reset()
      this.formLeaveDetailRequest.get('compensation_end_date').reset()
    } else  if (this.IsTypeIsLeave() === false){
      this.formLeaveDetailRequest.get('yearly_leave_duration').reset()
      this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
      this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    }
  }

  SelectPermission(){
    this.formLeaveDetailRequest.get('permission_category').reset()
    this.formLeaveDetailRequest.get('permission_duration').reset()
    this.formLeaveDetailRequest.get('permission_start_date').reset()
    this.formLeaveDetailRequest.get('permission_end_date').reset()
    this.formLeaveDetailRequest.get('is_compensation').reset()
    this.formLeaveDetailRequest.get('compensation_duration').reset()
    this.formLeaveDetailRequest.get('compensation_start_date').reset()
    this.formLeaveDetailRequest.get('compensation_end_date').reset()
  }

  SelectCompensation(){
    this.formLeaveDetailRequest.get('compensation_duration').reset()
    this.formLeaveDetailRequest.get('compensation_start_date').reset()
    this.formLeaveDetailRequest.get('compensation_end_date').reset()
  }

  IsPermissionSelected(){
    if(this.formLeaveDetailRequest.get('is_permission').value){
      if( this.formLeaveDetailRequest.get('is_permission').value === true){
        return true
      } else {
        return false
      }
    } else {
      return null
    }
  }

  IsCompensationSelected(){
    if(this.formLeaveDetailRequest.get('is_compensation').value){
      if( this.formLeaveDetailRequest.get('is_compensation').value === true){
        return true
      } else {
        return false
      }
    } else {
      return null
    }
  }


  // Mat Auto Complite Filter Section

  private _filterAirPortTo(value : string) {
    const filerValue = value.toLowerCase()
    console.log("ini loh Value",value)
    return this.airPortList.filter(option => option.city.toLowerCase().includes(filerValue));
  }

  private _filterAirPortFrom(value : string){
    const filterValue = value.toLowerCase()
    return this.airPortList.filter(option => option.city.toLowerCase().includes(filterValue))
  }

  private _filterReasonPermission(value : string){
    const filterValue = value.toLowerCase()
    return this.permissionList.filter(option => option.name.toLowerCase().toLowerCase().includes(filterValue))
  }

  FilterPermission(){
    this.filteredPermission = this.formLeaveDetailRequest.get('permission_category').valueChanges.pipe(
      startWith(''),
      map(value=>{
        const name = typeof value === 'string' ? value : value?.name
        return name ? this._filterReasonPermission(name as string) : this.permissionList.slice()
      })
    )
  }

  FilterAirPortTo(){
    this.filteredAirPortTo = this.ticketsTravel.at(0).get('departure_to').valueChanges.pipe(
      startWith(''),
      map(value =>{
        const name = typeof value === 'string' ? value : value?.city;
        return name ? this._filterAirPortTo(name as string) : this.airPortList.slice()
      })
    )
  }

  FilterAirPortFrom(){
    this.filteredAirPortFrom = this.ticketsTravel.at(0).get('return_from').valueChanges.pipe(
      startWith(''),
      map(value =>{
        const name = typeof value === 'string' ? value : value?.city;
        return name ? this._filterAirPortFrom(name as string) : this.airPortList.slice()
      })
    )
  }

  selectSubtituteOfficer(){
   const subtituteOfficer = this.formLeaveTicektApproval.get('substitute_officer').value
   this.substituteOfficerList.forEach((officer)=>{
    if(officer._id === subtituteOfficer){
      this.formLeaveTicektApproval.get('approval_id_1').setValue(officer.name)
    }
   })
  }

  formatToRupiah(amount: string): string {
    if (!amount) return '';

    // Mengubah nilai ke dalam format mata uang Rupiah
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    });

    // Menghilangkan simbol mata uang dan titik decimal, serta menambahkan koma sebagai pemisah ribuan
    return formatter.format(Number(amount)).replace('IDR', 'Rp').replace(/\.00$/, '') + ',-';
  }

  InvalidSwal(){
    Swal.fire({
      title: 'Invalid',
      html: 'Mohon Isi Kolom Yang Berwana Merah',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText:'Oke',
    })
  }

}
