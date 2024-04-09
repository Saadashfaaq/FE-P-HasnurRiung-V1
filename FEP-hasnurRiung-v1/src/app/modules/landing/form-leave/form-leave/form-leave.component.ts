import { Component, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@Component({
  selector: 'app-form-leave',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './form-leave.component.html',
  styleUrl: './form-leave.component.scss'
})
export class FormLeaveComponent implements OnInit {

  constructor(
    private _formBuilder: UntypedFormBuilder,
  ){}

  // Varibale to keep form Leave
  formLeaveSection1 : UntypedFormGroup
  formLeaveSection2 : UntypedFormGroup
  formLeaveSection3 : UntypedFormGroup

  //Boolena for open section
  openSection1 : boolean = false
  openSection2 : boolean = false
  openSection3 : boolean = false

  // Variable For Item List
  categoryList = [
    {
      name:'Cuti',
      value: 'cuti'
    },
    {
      name:'Izin',
      value: 'izin'
    },
    {
      name:'Kompensasi',
      value: 'kompensasi'
    }
  ]

  ngOnInit(): void {
    this.OpenSection1()
    this.InitFormLeaveSection1()
    this.InitFormLeaveSection2()
    this.InitFormLeaveSection3()
    this.CreateTicketTravelArray()
  }

  InitFormLeaveSection1(){
    this.formLeaveSection1 = this._formBuilder.group({
      application_type: [''],
      date_eligible_for_leave:[''],
      name: [''],
      employee_number: [''],
      family_status: [''],
      date_of_registration: [''],
      leave_location : ['' ],
      leave_category:[''],
      phone_number: ['' ],
      is_ticket_supported: ['' ],
      position: ['' ],
      poh_status: [''],
      is_with_family: [''],
      is_routine_official_letter: [''],
      leave_address: [''],
      is_lump_sump: [''],
      lump_sump_amount: [''],
      placement_status:['']
    })
  }

  InitFormLeaveSection2(){
    this.formLeaveSection2 = this._formBuilder.group({
      leave_category: [''],
      departure_off_day: [''],
      travel_date: [''],
      duration: [''],
      start_date:[''],
      end_date: [''],
      is_yearly_leave: [''],
      yearly_leave_duration: [''],
      yearly_leave_start_date:[''],
      yearly_leave_end_date:[''],
      is_permission: [''],
      permission_category: [''],
      permission_duration:[''],
      permission_start_date: [''],
      permission_end_date: [''],
      is_compensation:[''],
      compensation_duration: [''],
      compensation_start_date: [''],
      compensation_end_date: [''],
    })
  }

  InitFormLeaveSection3(){
    this.formLeaveSection3 = this._formBuilder.group({
      leave_date_start_section3:[''],
      leave_date_end_section3: [''],
      total_leave_amount: [''],
      leave_comment: [''],
      tickets_travel: this._formBuilder.array([]),
      substitute_officer:[''],
      pending_job:[''],
      approval_id_1: [''],
      approval_id_2: [''],
      approval_id_3: ['']
    })
  }

  IniTicketTravelFormArray(){
   return this._formBuilder.group({
      name:[''],
      age: [''],
      departure_from: ['BDJ'],
      departure_to: [''],
      return_from: [''],
      return_to: ['BDJ'],
    })
  }

  get ticketsTravel() : FormArray{
    return this.formLeaveSection3.get('tickets_travel') as FormArray
  }

  UpdateTicketTravel (ticketDatas : any[]){
    const ticketTravelArray = this.formLeaveSection3.get('tickets_travel') as FormArray
    ticketDatas.forEach((ticketData)=>{
      ticketTravelArray.push(this.IniTicketTravelFormArray())
    })
  }

  CreateTicketTravelArray() {
    const newTicketFormGroup = this.IniTicketTravelFormArray(); // Membuat FormGroup baru
    this.ticketsTravel.push(newTicketFormGroup); // Menambahkan FormGroup baru ke dalam FormArray ticketsTravel
  }

  RemoveTicket(index){
    this.ticketsTravel.removeAt(index)
  }

  OpenSection1(){
    this.openSection1 = true
    this.openSection2 = false
    this.openSection3 = false
  }
  OpenSection2(){
    this.openSection1 = false
    this.openSection2 = true
    this.openSection3 = false
  }
  OpenSection3(){
    this.openSection1 = false
    this.openSection2 = false
    this.openSection3 = true
  }

  SaveSection1(){
    this.openSection1 = false
    this.openSection2 = true
    this.openSection3 = false
  }

  SaveSection2(){
    this.openSection1 = false
    this.openSection2 = false
    this.openSection3 = true
  }

  SaveSection3(){
    this.openSection1 = true
    this.openSection2 = false
    this.openSection3 = false
  }

  consoleLOG(){
    console.log("1",this.formLeaveSection1)
    console.log("2",this.formLeaveSection2)
    console.log("3",this.formLeaveSection3)
  }
}
