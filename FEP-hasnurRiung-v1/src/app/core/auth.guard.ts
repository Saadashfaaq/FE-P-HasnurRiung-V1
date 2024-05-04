import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userAuthService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userData = localStorage.getItem('userProfile')
    const token = localStorage.getItem('token')
    if (userData && token) {
      return true;
    }
    return this.router.createUrlTree(['/auth/login']);
  }
}
