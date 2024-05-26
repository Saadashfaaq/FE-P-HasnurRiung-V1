import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription, filter } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormPermitService } from 'src/app/services/form-permit/form-permit.services';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ApprovalTableDialogComponent } from '../../approval-page/approval-table-dialog/approval-table-dialog.component';
import * as _ from 'lodash';
import { DesktopFormPermitComponent } from "./desktop-form-permit/desktop-form-permit.component";
import { MobileFormPermitComponent } from "./mobile-form-permit/mobile-form-permit.component";

@Component({
    selector: 'app-form-permit',
    standalone: true,
    templateUrl: './form-permit.component.html',
    styleUrl: './form-permit.component.scss',
    imports: [MobileFormPermitComponent, DesktopFormPermitComponent]
})
export class FormPermitComponent {
}
