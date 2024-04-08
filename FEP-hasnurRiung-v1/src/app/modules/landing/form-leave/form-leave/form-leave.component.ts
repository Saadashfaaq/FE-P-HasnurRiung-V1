import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-leave',
  standalone: true,
  imports: [],
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
    this.InitFormLeaveSection1()
    this.InitFormLeaveSection2()
    this.InitFormLeaveSection3()
  }


  InitFormLeaveSection1(){
    this.formLeaveSection1 = this._formBuilder.group({
      category: ['', [Validators.required]],
      name: [''],
      employee_number: [''],
      family_status: [''],
      date_of_employment: [''],
      leave_location : ['', [Validators.required]],
      leave_category:[''],
      phone_number: ['', [Validators.required]],
      is_ticket_supported: ['', [Validators.required]],
      poh_location: ['',[Validators.required]],
      position: ['', [Validators.required]],
      poh_status: ['',[Validators.required]],
      is_with_family: ['', [Validators.required]],
      is_routine_official_letter: ['', [Validators.required]],
      leave_address: ['', [Validators.required]],
      is_lump_sump: ['', [Validators.required]],
      lump_sump_amount: ['', [Validators.required]],
    })
  }

  InitFormLeaveSection2(){

  }
  
  InitFormLeaveSection3(){

  }
}
