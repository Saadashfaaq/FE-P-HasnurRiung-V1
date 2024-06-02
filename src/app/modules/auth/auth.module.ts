import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes : Routes = [
  {path: ':id', component:LoginComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    LoginComponent
  ]
})
export class AuthModule { }
