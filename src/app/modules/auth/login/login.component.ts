import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { SubSink } from 'subsink';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnChanges, OnDestroy {
  subs: SubSink = new SubSink();
  authForm: UntypedFormGroup;
  isWaitingForResponse: boolean = false;

  formState: string;
  employeeNumber: string;

  isPasswordMatch: boolean = true;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private router: Router,
    private _activeRoute: ActivatedRoute,
  ) {}

  ngOnChanges(): void {}

  ngOnInit(): void {
    this.formState = this._activeRoute?.snapshot?.params['id'];
    this.employeeNumber =
      this._activeRoute.snapshot.queryParams['employeeNumber'];

    if (this.formState === 'reset' && !this.employeeNumber) {
      this.router.navigate(['auth/login']);
      this.formState = 'login';
      this.InitFormLogin();
    } else  {
      this.InitFormLogin();
    }
  }

  InitFormLogin() {
    const loginForm = {
      employee_number: [null, [Validators.required]],
      password: [null, [Validators.required]],
    };

    const resetPasswordForm = {
      password: [null, [Validators.required]],
      confirm_password: [null, [Validators.required]],
    };

    const forgotPasswordForm = {
      employee_number: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    };

    if (this.formState === 'login') {
      this.authForm = this._formBuilder.group(loginForm);
    } else if (this.formState === 'reset') {
      this.authForm = this._formBuilder.group(resetPasswordForm);
    } else if (this.formState === 'forgot') {
      this.authForm = this._formBuilder.group(forgotPasswordForm);
    } else {
      this.router.navigate(['/auth/login']);
      this.formState = 'login';
    }

    this.authForm.valueChanges.subscribe((resp) => {
      this.isPasswordMatch = true;
    });
  }

  Login() {
    this.isWaitingForResponse = true;
    const nrp = this.authForm?.get('employee_number').value;
    const password = this.authForm?.get('password').value;
    if (this.authForm.valid) {
      this.subs.sink = this.userService.Login(nrp, password).subscribe(
        (resp) => {
          if (resp) {
            const userData = resp;
            console.log('resp login', resp.employee);
            localStorage.setItem('userData', JSON.stringify(userData.employee));
            localStorage.setItem('token', resp.token);
            localStorage.setItem('userProfile', resp?.employee?._id);
            localStorage.setItem('name', resp?.employee?.name);
            localStorage.setItem('isAdmin', resp?.is_admin);
            localStorage.setItem(
              'employee_number',
              resp?.employee?.employee_number
            );
            localStorage.setItem(
              'department',
              resp?.employee?.position?.department
            );
            this.router.navigate(['/permit-leave']);
            this.isWaitingForResponse = false;
          } else {
            this.isWaitingForResponse = false;
            this.InvalidSwalNRP();
          }
        },
        (err) => {
          this.isWaitingForResponse = false;
          console.error;
        }
      );
    } else {
      this.isWaitingForResponse = false;
      this.InvalidSwal();
    }
  }

  resetPassword() {
    this.isWaitingForResponse = true;
    const password = this.authForm?.get('password')?.value;
    const confirmedPassword = this.authForm?.get('confirm_password')?.value;

    const isPasswordEqual = password === confirmedPassword;

    if (this.employeeNumber && this.authForm.valid && isPasswordEqual) {
      this.subs.sink = this.userService
        ?.ResetPassword(this.employeeNumber, password)
        .subscribe(
          (resp) => {
            if (resp) {
              this.router.navigate(['/auth/login']);
              this.isWaitingForResponse = false;
            } else {
              this.isWaitingForResponse = false;
              this.InvalidSwalNRP();
            }
          },
          (err) => {
            this.isWaitingForResponse = false;
            console.error;
          }
        );
    } else {
      if (this.authForm.invalid) {
        this.InvalidSwal();
      } else if (!isPasswordEqual) {
        this.isPasswordMatch = false;
      } else if (!this.employeeNumber) {
        this.InvalidSwalNRP();
      }
      this.isWaitingForResponse = false;
    }
  }

  forgotPassword() {
    const nrp = this.authForm?.get('employee_number').value;
    const email = this.authForm?.get('email').value;

    if (this.authForm.valid) {
      this.subs.sink = this.userService.ForgotPassword(nrp, email).subscribe(
        () => {
          Swal.fire({
            title: 'Tautan ganti password berhasil dikirm ke email anda',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'Iya',
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        },
        (err) => {
          Swal.fire({
            title: err['message'],
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            allowEnterKey: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: 'Iya',
          });
        }
      );
    } else {
      this.InvalidSwal();
    }
  }

  InvalidSwal() {
    Swal.fire({
      title: 'Invalid',
      html: 'Mohon Isi Kolom Yang Berwarna Merah dengan benar',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: 'Oke',
    });
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
  openForgotPassword() {
    this.router.navigate(['/auth/forgot']);

    this.formState = 'forgot';
    this.InitFormLogin();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
