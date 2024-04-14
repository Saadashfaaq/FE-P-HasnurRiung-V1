import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { AsyncPipe, DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { airPortList } from 'src/app/services/form-leave/airport-list';
import { Observable, map, startWith } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';

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
  subs: SubSink = new SubSink();
  constructor(
    private _formBuilder: UntypedFormBuilder,
    // private datePipe: DatePipe
    private _adapter: DateAdapter<any>,
    private _intl: MatDatepickerIntl,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _formLeaveService : FormLeaveService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  formID : string
  formData

  isAplicationTypeLeave : boolean = null
  isPermissionPP : boolean = null
  permissionType : string

  formType :  string

  ChangeAplication(){
    const applicationType = this.formLeaveIdentity.get('application_type').value
    if(applicationType === 'cuti'){
      this.isAplicationTypeLeave = true
      // this.formLeaveIdentity.reset()
      // this.formLeaveDetailRequest.reset()
      // this.formLeaveTicektApproval.reset()
      this.formLeaveIdentity.get('application_type').setValue('cuti')
      this.formType = 'Cuti'
      this.formLeaveIdentity.get('date_of_eligible_for_leave').setValue(this.formData?.date_of_eligible_for_leave?.date)
    } else if(applicationType === 'ijin'){
      this.isAplicationTypeLeave = false
      this.formType = 'Ijin'
      // this.formLeaveIdentity.reset()
      // this.formLeaveDetailRequest.reset()
      // this.formLeaveTicektApproval.reset()
      this.formLeaveIdentity.get('application_type').setValue('ijin')
      this.formLeaveIdentity.get('date_of_eligible_for_leave').setValue(null)
    } else {
      this.isAplicationTypeLeave = false
      this.formType = ''
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
  filteredSubtituteOfficer: Observable<any>

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
    // {
    //   name:'Angelo',
    //   _id:'1221312'
    // },
    // {
    //   name:'Jansen',
    //   _id:'1edawdad'
    // },
    // {
    //   name:'Albatros',
    //   _id:'12213dad12'
    // }
  ]

  isSection1Submited : boolean = false
  isSection2Submited : boolean = false
  isSection3Submited : boolean = false



  ngOnInit(): void {
    this.GetOneUserLoginForm()
    this.SetDatePickerFormat()
  }

  SetDatePickerFormat(){
    this._locale = 'en-GB';
    this._adapter.setLocale(this._locale);
  }

  InitFormLeaveIdentity(){
    this.formLeaveIdentity = this._formBuilder.group({
      application_type: [null,[Validators.required]],
      date_of_eligible_for_leave:{value: this.formData?.date_of_eligible_for_leave?.date, disabled: true},
      name: {value: this.formData?.name, disabled: true},
      employee_number: {value: this.formData?.employee_number, disabled: true},
      family_status: {value: this.formData?.family_status, disabled: true},
      date_of_registration: {value: this.formData?.date_of_registration?.date, disabled: true},
      leave_location : [null ,[Validators.required]],
      phone_number: [null ,[Validators.required]],
      is_ticket_supported: [null ,[Validators.required]],
      position: {value: this.formData?.position?.name, disabled: true},
      poh_status: {value: this.formData?.poh_status, disabled: true},
      is_with_family: [null, [Validators.required]],
      is_routine_official_letter: [{value: true , disabled: true}],
      leave_address: [null,[Validators.required]],
      is_lump_sump: [{value: this.formData?.is_lump_sump , disabled: true}],
      lump_sump_amount: {value: this.formatToRupiah(String(this.formData?.lump_sump_amount)) , disabled: true},
      placement_status:{value: this.formData?.placement_status, disabled: true},

      leave_category:[null,[Validators.required]],
      permission_category:[null,[Validators.required]]
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
      departure_off_day: [null,[Validators.required]],
      travel_date: [null,[Validators.required, this.travelDateValidator('departure_off_day')]],
      field_leave_duration: [null,[Validators.required]],
      field_leave_start_date:[null],
      field_leave_end_date: [null],
      is_yearly_leave: [null,[Validators.required]],
      yearly_leave_duration: [null, [Validators.pattern("^[0-6]$")]],
      yearly_leave_start_date:[null],
      yearly_leave_end_date:[null],
      is_permission: [null,[Validators.required]],
      permission_type: [null],
      permission_duration:[null,[Validators.required]],
      permission_start_date: [null],
      permission_end_date: [null],
      is_compensation:[null,[Validators.required]],
      compensation_duration: [null],
      compensation_start_date: [null],
      compensation_end_date: [null],
      leave_comment: [null],
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
    const permissionCategoryControl = this.formLeaveDetailRequest.get('permission_type');
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
      leave_date_start_TicektApproval:[null],
      leave_date_end_TicektApproval: [null],
      total_leave_amount: [null],
      leave_comment: [null,[Validators.required]],
      travel_tickets: this._formBuilder.array([]),
      substitute_officer:[null,[Validators.required]],
      pending_job:[null,[Validators.required]],
      approval_id_1: {value: '', disabled: true},
      approval_id_2: {value: null, disabled: true},
      approval_id_3: {value: null, disabled: true}
    })
  }

  InitTicketTravelFormArray(){
   return this._formBuilder.group({
      name:[null],
      age: [null],
      departure_from: [null],
      departure_to: [null,[Validators.required]],
      arrival_from: [null,[Validators.required]],
      arrival_to: [null],
    })
  }

  get ticketsTravel() : FormArray{
    return this.formLeaveTicektApproval.get('travel_tickets') as FormArray
  }

  // UpdateTicketTravel (ticketDatas : any[]){
  //   const ticketTravelArray = this.formLeaveTicektApproval.get('travel_tickets') as FormArray
  //   ticketDatas.forEach((ticketData)=>{
  //     ticketTravelArray.push(this.InitTicketTravelFormArray())
  //   })
  // }

  InisiateFirstIndexFormArray(){
    const newTicketFormGroup = this.InitTicketTravelFormArray();
    this.ticketsTravel.push(newTicketFormGroup); 
  }

  CreateTicketTravelArray() {
    if(this.ticketsTravel.at(0).get('departure_to').value && this.ticketsTravel.at(0).get('arrival_from').value){
      const newTicketFormGroup = this._formBuilder.group({
        name: [''],
        age: [''],
        departure_from: {value: 'BDJ', disabled: true}, // buat field ini disable
        departure_to: {value: this.ticketsTravel.at(0).get('departure_to').value, disabled: true}, // buat field ini disable
        arrival_from: {value: this.ticketsTravel.at(0).get('arrival_from').value, disabled: true}, // buat field ini disable
        arrival_to: {value: 'BDJ', disabled: true}, // buat field ini disable
      });
      this.ticketsTravel.push(newTicketFormGroup); 
      const tricketTravelIndex = this.ticketsTravel.length -1
      this.ticketsTravel.at(tricketTravelIndex).get('departure_from').setValue('BDJ')
      this.ticketsTravel.at(tricketTravelIndex).get('departure_to').setValue( this.ticketsTravel.at(0).get('departure_to').value)
      this.ticketsTravel.at(tricketTravelIndex).get('arrival_from').setValue(this.ticketsTravel.at(0).get('arrival_from').value)
      this.ticketsTravel.at(tricketTravelIndex).get('arrival_to').setValue('BDJ')
    } else {
      // alert("SALAH")
    }
  }

  RemoveTicket(index){
    this.ticketsTravel.removeAt(index)
  }

  UpdateAirPortFormArrFrom() {
    if (this.ticketsTravel.length > 1) {
      while (this.ticketsTravel.length > 1) {
        this.ticketsTravel.removeAt(1); // Hapus elemen dari indeks 1 ke atas
      }
    }
  }
  
  UpdateAirPortFormArrTo() {
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
    console.log(this.formLeaveIdentity)
    this.isSection1Submited = true
    if(this.formLeaveIdentity.invalid){
      this.InvalidSwal()
    } else {
      this.openIdentity = false
      this.openDetailRequest = true
      this.openTicektApproval = false
      if(this.formLeaveIdentity.get('application_type').value === 'ijin'){
        if(this.formLeaveIdentity.get('permission_category').value === 'pp'){
          this.removeValidatorsForPermissionLeave();
        } else if(this.formLeaveIdentity.get('permission_category').value === 'non_pp'){
          this.removeValidatorsForNonPermissionLeave();
        }
      }
    }
  }

  SaveDetailRequest(){
    console.log(this.formLeaveDetailRequest)
    this.isSection2Submited = true
    if(this.formLeaveDetailRequest.invalid){
      this.InvalidSwal()
    } else {
      this.openIdentity = false
      this.openDetailRequest = false
      this.openTicektApproval = true
      this.CalculateTotalLeaveAmount()
      if(this.formLeaveIdentity.get('is_ticket_supported').value){
        if(this.ticketsTravel.length === 0){
          this.InisiateFirstIndexFormArray()
          this.ticketsTravel.at(0).get('name').setValue(this.formData?.name)
          this.ticketsTravel.at(0).get('age').setValue(this.formData?.age)
          this.ticketsTravel.at(0).get('departure_from').setValue('BDJ')
          this.ticketsTravel.at(0).get('arrival_to').setValue('BDJ')
          this.ticketsTravel.at(0).get('name').disable()
          this.ticketsTravel.at(0).get('age').disable()
          this.ticketsTravel.at(0).get('departure_from').disable()
          this.ticketsTravel.at(0).get('arrival_to').disable()
        }
        this.FilterAirPortTo()
        this.FilterAirPortFrom()
      } else {
        this.ticketsTravel.at(0).get('departure_to').clearValidators();
        this.ticketsTravel.at(0).get('arrival_from').clearValidators();
      }
    }
  }

  SaveTicektApproval(){
    this.isSection3Submited = true
    if(this.formLeaveTicektApproval.invalid){
      this.InvalidSwal()
    } else {
      // this.openIdentity = true
      // this.openDetailRequest = false
      // this.openTicektApproval = false
      const payload = this.CreateFormPayload()
      this.subs.sink = this._formLeaveService.CreateFormIdentity(payload).subscribe(
        (resp)=>{
          if(resp){
            const url = resp?.pdf_application_form;
            window.open(url, '_blank');
            // this.router.navigate([''])
          }
        },
        (err)=>{
          console.error(err)
        }
      )
    }
  }
  CreateFormPayload(){
    this.formLeaveDetailRequest.get('leave_comment').setValue(this.formLeaveTicektApproval.get('leave_comment').value)
    const identityPayload = this.CreatePayloadForIdentity();
    const detailRequestPayload = this.CreatePayloadForDetailRequest();
    const ticketApprovalPayload = this.CreatePayloadForTicketApproval();

    const payload = {
      ...identityPayload,
      ...detailRequestPayload,
      ...ticketApprovalPayload
    };
  
    return payload;
  }

  CreatePayloadForIdentity(){
    const identityForm = this.formLeaveIdentity;
    const { is_lump_sump, is_routine_official_letter, ...payload } = this.formLeaveIdentity.value;
    
    // Menghilangkan field yang memiliki nilai null
    Object.keys(payload).forEach(key => payload[key] === null && delete payload[key]);
  
    // Memindahkan nilai leave_category ke dalam objek leaves
    if (payload.leave_category !== null && payload.leave_category !== undefined) {
      payload.leaves = { leave_category: payload.leave_category };
      delete payload.leave_category;
    }
  
    return payload;
  }

  CreatePayloadForTicketApproval() {
   const substituteOfficerName =  this.formLeaveTicektApproval.get('substitute_officer').value
   let substituteOfficerId : string 
   this.substituteOfficerList.forEach((approval)=>{
    if(approval.name === substituteOfficerName){
      substituteOfficerId = approval._id
    }
   })

    const payload = {
      // leave_date_start_TicektApproval:this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').value,
      // leave_date_end_TicektApproval: this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').value,
      // total_leave_amount:this.formLeaveTicektApproval.get('total_leave_amount').value,
      travel_tickets: this.formLeaveTicektApproval.get('travel_tickets').value,
      // substitute_officer:[null,[Validators.required]],
      pending_job:this.formLeaveTicektApproval.get('pending_job').value,
      approval:[
        {
          approver_id:substituteOfficerId

        }
      ],
      employee_id: "66181cac2d03e3e3187fa584"
    }
    return payload 
  }
  CreatePayloadForDetailRequest(){
    const leaves = this.formLeaveDetailRequest.value;
    const payload = {
      leaves: {},
      current_step_index: 1
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
              time: '' // Kosongkan nilai time
            };
          } else if (key.includes('date')) {
            // Jika field berisi tanggal lain, konversi format tanggal dan tambahkan ke dalam payload
            payload.leaves[key] = formatDate(leaves[key], 'dd/MM/yyyy', 'en-US');
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
    return payload;
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
      this.formLeaveDetailRequest.get('yearly_leave_start_date').disable()
      this.formLeaveDetailRequest.get('yearly_leave_end_date').disable()
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
        this.formLeaveDetailRequest.get('yearly_leave_end_date').disable()
        this.formLeaveTicektApproval.get('leave_date_start_TicektApproval').disable()
        this.formLeaveTicektApproval.get('leave_date_end_TicektApproval').disable()
        this.formLeaveTicektApproval.get('total_leave_amount').disable()
        this.formLeaveDetailRequest.get('travel_date').clearValidators()
        this.formLeaveDetailRequest.get('departure_off_day').clearValidators()
        this.formLeaveDetailRequest.get('field_leave_duration').clearValidators()
        this.formLeaveDetailRequest.get('is_compensation').clearValidators()

      } else {
        this.formLeaveIdentity.get('is_ticket_supported').reset()
        this.formLeaveIdentity.get('is_ticket_supported').enable()
        this.formLeaveDetailRequest.get('yearly_leave_start_date').disable()
        this.formLeaveDetailRequest.get('field_leave_start_date').disable()
        this.formLeaveDetailRequest.get('field_leave_end_date').disable()
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
        this.formLeaveDetailRequest.get('travel_date').setValidators([Validators.required, this.travelDateValidator('departure_off_day')])
        this.formLeaveDetailRequest.get('departure_off_day').setValidators([Validators.required, this.travelDateValidator('departure_off_day')])
        this.formLeaveDetailRequest.get('field_leave_duration').setValidators([Validators.required])
        this.formLeaveDetailRequest.get('is_compensation').setValidators([Validators.required])
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
    this.formLeaveDetailRequest.get('field_leave_duration').reset()
    this.formLeaveDetailRequest.get('field_leave_start_date').reset()
    this.formLeaveDetailRequest.get('field_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_yearly_leave').reset()
    this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_permission').reset()
    this.formLeaveDetailRequest.get('permission_type').reset()
    this.formLeaveDetailRequest.get('permission_duration').reset()
    this.formLeaveDetailRequest.get('permission_start_date').reset()
    this.formLeaveDetailRequest.get('permission_end_date').reset()
    this.formLeaveDetailRequest.get('is_compensation').reset()
    this.formLeaveDetailRequest.get('compensation_duration').reset()
    this.formLeaveDetailRequest.get('compensation_start_date').reset()
    this.formLeaveDetailRequest.get('compensation_end_date').reset()
  }

  CalculateLeaveDate() {
    this.formLeaveDetailRequest.get('field_leave_start_date').reset()
    this.formLeaveDetailRequest.get('field_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_yearly_leave').reset()
    this.formLeaveDetailRequest.get('yearly_leave_duration').reset()
    this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_permission').reset()
    this.formLeaveDetailRequest.get('permission_type').reset()
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
      this.formLeaveDetailRequest.get('field_leave_start_date').setValue(result);
      result.setDate(result.getDate() + parseInt(this.formLeaveDetailRequest.get('field_leave_duration').value) );
      this.formLeaveDetailRequest.get('field_leave_end_date').setValue(result);
    } else {
      console.error("Travel date is invalid.");
    }
  }

  CalculateYearlyLeaveDate(){
    const permissionEndDate = this.formLeaveDetailRequest.get('permission_end_date').value
    const yearlyLeaveStart = this.formLeaveDetailRequest.get('field_leave_end_date').value
    const leaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value
    if(this.IsTypeIsLeave()){
      if( this.formLeaveIdentity.get('leave_category').value === 'lapangan' && !this.formLeaveDetailRequest.get('field_leave_duration').value){
        alert('tolong isi jumlah hari cuti dulu')
      } else if(this.formLeaveIdentity.get('leave_category').value === 'lapangan' && this.formLeaveDetailRequest.get('field_leave_duration').value) {
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
  this.formLeaveDetailRequest.get('field_leave_duration').clearValidators();
  this.formLeaveDetailRequest.get('is_permission').clearValidators();
  this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
  this.formLeaveDetailRequest.get('is_compensation').clearValidators();
  this.updateValidators();
}

// Metode untuk menghapus validator pada non izin cuti
removeValidatorsForNonPermissionLeave() {
  // this.formLeaveDetailRequest.get('departure_off_day').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('travel_date').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('field_leave_duration').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('is_permission').setValidators([Validators.required]);
  // this.formLeaveDetailRequest.get('is_yearly_leave').clearValidators();
  // this.formLeaveDetailRequest.get('is_compensation').setValidators([Validators.required]);
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
    const leaveDuration = this.formLeaveDetailRequest.get('field_leave_duration').value
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value
    const yearlyEndStartDate = this.formLeaveDetailRequest.get('yearly_leave_start_date').value
    const yearlyEndLeaveDate = this.formLeaveDetailRequest.get('yearly_leave_end_date').value
    const permissionDuration = this.formLeaveDetailRequest.get('permission_duration').value
    const leaveEndDate = this.formLeaveDetailRequest.get('field_leave_end_date').value
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
    const leaveDuration = this.formLeaveDetailRequest.get('field_leave_duration').value
    const yearlyLeaveDuration = this.formLeaveDetailRequest.get('yearly_leave_duration').value
    const yearlyEndStartDate = this.formLeaveDetailRequest.get('yearly_leave_start_date').value
    const yearlyEndLeaveDate = this.formLeaveDetailRequest.get('yearly_leave_end_date').value
    const permissionDuration = this.formLeaveDetailRequest.get('permission_duration').value
    const leaveEndDate = this.formLeaveDetailRequest.get('field_leave_end_date').value
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
                new Date(this.formLeaveDetailRequest.get('field_leave_end_date').value)
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

    const totalLeaveDays = ( permissionCategory == 'non_pp') || ( permissionCategory == 'pp' && !isYearlyLeave) ? Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 1 : Math.ceil((leaveEndDate - leaveStartDate) / (1000 * 3600 * 24)) + 1;

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
    this.formLeaveDetailRequest.get('field_leave_duration').reset()
    this.formLeaveDetailRequest.get('field_leave_start_date').reset()
    this.formLeaveDetailRequest.get('field_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_yearly_leave').reset()
    this.formLeaveDetailRequest.get('yearly_leave_start_date').reset()
    this.formLeaveDetailRequest.get('yearly_leave_end_date').reset()
    this.formLeaveDetailRequest.get('is_permission').reset()
    this.formLeaveDetailRequest.get('permission_type').reset()
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
      this.formLeaveDetailRequest.get('permission_type').reset()
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
    this.formLeaveDetailRequest.get('permission_type').reset()
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

  private _filteredSubtituteOfficer(value: string){
    const filterValue = value.toLowerCase()
    return this.substituteOfficerList.filter(option => option.name.toLowerCase().toLowerCase().includes(filterValue))
  }

  filterSubituteOfficer(){
    this.filteredSubtituteOfficer = this.formLeaveTicektApproval.get('substitute_officer').valueChanges.pipe(
      startWith(''),
      map(value=>{
        const name = typeof value === 'string' ? value : value?.name
        return name ? this._filteredSubtituteOfficer(name as string) : this.substituteOfficerList.slice()
      })
    )
  }

  FilterPermission(){
    this.filteredPermission = this.formLeaveDetailRequest.get('permission_type').valueChanges.pipe(
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
    this.filteredAirPortFrom = this.ticketsTravel.at(0).get('arrival_from').valueChanges.pipe(
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
    if(officer.name === subtituteOfficer){
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


  getParamsId(){
    const getParams = this.route.snapshot.params['id'];
    if(getParams){
      this.subs.sink = this._formLeaveService.GetOneApplicationForm(getParams).subscribe(
        (resp)=>{
          const data = resp
          this.formID = resp._id
          this.patchFormLeaveIdentity(data);
          this.patchFormLeaveDetailRequest(data.leaves);
          this.patchFormLeaveTicketApproval(data);
        },
        (err)=>{
          console.log("err", err)
        })
    } else {
      return
    }
  } 

patchFormLeaveIdentity(data: any) {
    this.formLeaveIdentity.patchValue({
      application_type: data?.application_type || null,
      name: data?.employee_id?.name || null,
      employee_number: data?.employee_id?.employee_number || null,
      family_status: data?.employee_id?.family_status || null,
      date_of_registration: data?.employee_id?.date_of_registration?.date || null,
      leave_location: data?.leave_location || null,
      phone_number: data?.phone_number || null,
      is_ticket_supported: data?.is_ticket_supported || null,
      position: data?.employee_id?.position?.position || null,
      poh_status: data?.employee_id?.poh_status || null,
      is_with_family: data?.is_with_family || null,
      is_routine_official_letter: data?.employee_id?.is_routine_official_letter || null,
      leave_address: data?.leave_address || null,
      is_lump_sump: data?.employee_id?.is_lump_sump || null,
      lump_sump_amount: data?.employee_id?.lump_sump_amount || null,
      placement_status: data?.employee_id?.placement_status || null,
      leave_category:data?.leaves.leave_category || null,
      permission_category:data?.permission_category || null
    });
  }
  
  patchFormLeaveDetailRequest(data: any) {
    this.formLeaveDetailRequest.patchValue({
      departure_off_day: data?.departure_off_day?.date ? new Date(data.departure_off_day.date).toISOString() : null,
      travel_date: data?.travel_date ? new Date(data.travel_date).toISOString() : null,
      field_leave_duration: data?.field_leave_duration ? data.field_leave_duration.toString() : null,
      field_leave_start_date: data?.field_leave_start_date ? new Date(data.field_leave_start_date).toISOString() : null,
      field_leave_end_date: data?.field_leave_end_date ? new Date(data.field_leave_end_date).toISOString() : null,
      is_yearly_leave: data?.is_yearly_leave || null,
      yearly_leave_duration: data?.yearly_leave_duration ? data.yearly_leave_duration.toString() : null,
      yearly_leave_start_date: data?.yearly_leave_start_date ? new Date(data.yearly_leave_start_date).toISOString() : null,
      yearly_leave_end_date: data?.yearly_leave_end_date ? new Date(data.yearly_leave_end_date).toISOString() : null,
      is_permission: data?.is_permission || null,
      permission_type: data?.permission_type || null,
      permission_duration: data?.permission_duration ? data.permission_duration.toString() : null,
      permission_start_date: data?.permission_start_date ? new Date(data.permission_start_date).toISOString() : null,
      permission_end_date: data?.permission_end_date ? new Date(data.permission_end_date).toISOString() : null,
      is_compensation: data?.is_compensation || null,
      compensation_duration: data?.compensation_duration ? data.compensation_duration.toString() : null,
      compensation_start_date: data?.compensation_start_date ? new Date(data.compensation_start_date).toISOString() : null,
      compensation_end_date: data?.compensation_end_date ? new Date(data.compensation_end_date).toISOString() : null,
      start_date: data?.field_leave_start_date ? new Date(data.field_leave_start_date).toISOString() : null,
      end_date: data?.field_leave_end_date ? new Date(data.field_leave_end_date).toISOString() : null,
    });
  }
  
  patchFormLeaveTicketApproval(data: any) {
    this.formLeaveTicektApproval.patchValue({
      leave_date_start_TicektApproval: data?.travel_date || null,
      leave_date_end_TicektApproval: data?.travel_date || null,
      total_leave_amount: null, // Isi sesuai kebutuhan
      leave_comment: data?.leave_comment || null,
      substitute_officer: null, // Isi sesuai kebutuhan
      pending_job: data?.pending_job || null,
      approval_id_1: null, // Isi sesuai kebutuhan
      approval_id_2: data?.approval?.[0]?.approver_id?.name || null, // Menggunakan nama approver pertama jika tersedia
      approval_id_3: data?.approval?.[1]?.approver_id?.name || null, // Menggunakan nama approver kedua jika tersedia
    });
  
    // Patch nilai ke dalam formLeaveTicektApproval.travel_tickets FormArray
    const ticketTravelArray = this.formLeaveTicektApproval.get('travel_tickets') as FormArray;
    data?.travel_tickets?.forEach(ticket => {
      ticketTravelArray.push(this.initTicketTravelFormArray(ticket));
    });
  }

  initTicketTravelFormArray(ticket: any){
    return this._formBuilder.group({
      name: ticket.name || null,
      age: ticket.age || null,
      departure_from: ticket.departure_from || null,
      departure_to: ticket.departure_to || null,
      arrival_from: ticket.arrival_from || null,
      arrival_to: ticket.arrival_to || null,
    });
  }


  GetOneUserLoginForm(){
    this.subs.sink = this._formLeaveService.GetOneEmployee('').subscribe(
      (resp)=>{
        if(resp){
          this.formData = resp
          this.getParamsId()
          this.OpenIdentity()
          this.InitFormLeaveIdentity()
          this.InitFormLeaveDetailRequest()
          this.InitFormLeaveTicektApproval()
          this.GetAllUserForDropdown()
          this.GetAllApprovalGroups()
          this.FilterPermission()
          this.filterSubituteOfficer()
        }
      },
    (err)=>{
      console.log("err", err)
    })
  }

  GetAllUserForDropdown(){
    this.subs.sink = this._formLeaveService.GetAllEmployees().subscribe(
      (resp)=>{
        if(resp){
          this.substituteOfficerList = resp
        }
      },
      (err)=>{
        console.log("err", err)
      }
    )
  }

  GetAllApprovalGroups(){
    this.subs.sink = this._formLeaveService.GetAllApprovalGroups().subscribe(
      (resp)=>{
        if(resp){
          resp.forEach((approval)=>{
            if(approval.approval_index === 1){
              this.formLeaveTicektApproval.get('approval_id_2').setValue(approval?.name)
            } else if(approval.approval_index === 2){
              this.formLeaveTicektApproval.get('approval_id_3').setValue(approval?.name)
            }
          })
        }
      },
      (err)=>{
        console.log("err", err)
      }
    )
  }

}
