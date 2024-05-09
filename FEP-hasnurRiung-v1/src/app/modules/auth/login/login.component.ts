import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { SubSink } from 'subsink';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
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
export class LoginComponent implements OnInit,OnChanges, OnDestroy{
  subs: SubSink = new SubSink();
  loginForm : UntypedFormGroup
  isWaitingForResponse : boolean = false

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private userService : UserService,
    private router: Router,
  ){}
  ngOnChanges(changes: SimpleChanges): void {

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
    this.isWaitingForResponse = true
    const nrp = this.loginForm.get('employee_number').value
    const password = this.loginForm.get('password').value
    if(this.loginForm.valid){
      this.subs.sink = this.userService.Login(nrp, password).subscribe(
        (resp)=>{
          if(resp){
            localStorage.setItem('token', resp.token);
            localStorage.setItem('userProfile', resp?.employee?._id);
            localStorage.setItem('name',resp?.employee?.name)
            localStorage.setItem('isAdmin', resp?.is_admin)
            localStorage.setItem('employee_number', resp?.employee?.employee_number)
            localStorage.setItem('department', resp?.employee?.position?.department)
            this.router.navigate(['/permit-leave'])
            this.isWaitingForResponse = false
          } else{
            this.isWaitingForResponse = false
            this.InvalidSwalNRP()
          }
        },
        (err)=>{
          this.isWaitingForResponse = false
          console.error
        }
      )
    } else {
      this.isWaitingForResponse = false
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

  InvalidSwalNRP() {
    Swal.fire({
      title: 'NRP atau Kata Sandi Anda Tidak Sesuai',
      html: 'Mohon periksa kembali NRP atau Kata Sandi Anda',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    });
  }

  ngOnDestroy(): void {

  }



}
