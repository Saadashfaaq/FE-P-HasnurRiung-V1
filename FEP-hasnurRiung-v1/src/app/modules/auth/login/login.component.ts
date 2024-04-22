import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{
  subs: SubSink = new SubSink();
  loginForm : UntypedFormGroup

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private userService : UserService,
    private router: Router,
  ){

  }

  ngOnInit(): void {
     this.InitFormLogin()
  }

  InitFormLogin(){
    this.loginForm = this._formBuilder.group({
      employee_number: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
  }

  Login(){
    const nrp = this.loginForm.get('employee_number').value
    const password = this.loginForm.get('password').value
    if(this.loginForm.valid){
      this.subs.sink = this.userService.Login(nrp, password).subscribe(
        (resp)=>{
          if(resp){
            localStorage.setItem('token', resp.token);
            localStorage.setItem('userProfile', resp?.employee?._id);
            this.router.navigate(['/permit-leave'])
          }
        },
        (err)=>{
          console.error
        }
      )
    } else {
      this.InvalidSwal()
    }
  }

  InvalidSwal(){
    Swal.fire({
      title: 'Invalid',
      html: 'Mohon Isi Kolom Yang Berwarna Merah',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText:'Oke',
    })
  }

  ngOnDestroy(): void {
    
  }

}
