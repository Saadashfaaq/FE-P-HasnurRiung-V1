import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  sidebarToggle = new BehaviorSubject<boolean>(true);
  sidebarToggleListener$ = this.sidebarToggle.asObservable();

   sideBarToggle(position: boolean) {
    this.sidebarToggle.next(position);
   }
}
