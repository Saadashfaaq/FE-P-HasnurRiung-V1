import { Component } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss'
})
export class MobileNavbarComponent {
  subs = new SubSink;
  constructor(
    private _navigation: NavigationService
  ) { }

  toggleSidebar() {
    this._navigation?.sideBarToggle(true)
  }
}
