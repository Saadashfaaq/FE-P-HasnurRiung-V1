import { Component } from '@angular/core';
import { UserCardComponent } from "../../../../shared/user-card/user-card.component";

@Component({
    selector: 'app-mobile-table-work-permit-employee',
    standalone: true,
    templateUrl: './mobile-table-work-permit-employee.component.html',
    styleUrl: './mobile-table-work-permit-employee.component.scss',
    imports: [UserCardComponent]
})
export class MobileTableWorkPermitEmployeeComponent {

}
