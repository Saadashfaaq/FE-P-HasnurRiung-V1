import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  @Output() SideNavToggle = new EventEmitter();  

  openSidenav() {
   this.SideNavToggle.emit();
}
}
