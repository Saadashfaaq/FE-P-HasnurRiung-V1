import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@Component({
  selector: 'app-sidenav-list',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.scss'
})
export class SidenavListComponent {

  @Output() closeSideNav = new EventEmitter();

  constructor() { }

   onToggleClose() {
    this.closeSideNav.emit();
}

  ngOnInit() {
  }
}
