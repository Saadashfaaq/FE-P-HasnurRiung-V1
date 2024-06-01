import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { FormLeaveService } from './services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width < 1024) {
      this.showMobile = true;
    } else {
      this.showMobile = false;
    }
  }

  title = 'STOPLESS';
  showSideBar: boolean = true;
  showMobile: boolean = false;
  userName: string = '';

  subs: SubSink = new SubSink();
  firstTime: boolean = true;

  currRoute: string;
  isWaitingForResponse: boolean = false;

  navigationMenu = [
    {
      _id: 'approval-group',
      name: 'Approval Group',
      link: '/approval-group',
      icon: 'bx bxs-group',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: ''
    },
    {
      _id: 'approval-table',
      name: 'Approval ST Istirahat',
      link: '/approval-table',
      icon: 'bx bxs-badge-check',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: ''
    },
    {
      _id: 'approval-table-work',
      name: 'Approval ST Lapangan',
      link: '/approval-table/work',
      icon: 'bx bxs-badge-check',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: ''
    },
    {
      _id: 'permit-leave',
      name: 'Tugas Istirahat',
      link: '/permit-leave',
      icon: 'bx bx-calendar',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: ''
    },
    {
      _id: 'permit-work',
      name: 'Tugas Lapangan',
      link: '/permit-work',
      icon: 'bx bx-calendar',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: ''
    },
  ]

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private _formLeaveService: FormLeaveService,
  ) {}

  ngOnInit(): void {
    this.employeeId = localStorage.getItem('userProfile');
    this.userName = localStorage.getItem('name');
  }

  ngAfterViewInit() {
    this.listenToRouteChanges();
  }

  listenToRouteChanges() {
    this.isWaitingForResponse = true;
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currRoute = event?.url;
        if (event.url.includes('auth') || event.url.includes('data-validation') || event.url.includes('form-leave') || event.url.includes('form-permit')){
          this.showSideBar = false;
          this.changeDetectorRef.detectChanges();
        } else {
          this.showSideBar = true;
          this.changeDetectorRef.detectChanges();
        }
        this.isWaitingForResponse = false;

        if (window?.innerWidth < 1024) {
          this.showMobile = true;
        } else {
          this.showMobile = false;
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  notifList;
  employeeId;

  getAllNotificationList() {
    this.subs.sink = this._formLeaveService
      .GetAllNotifications(this.employeeId)
      .subscribe(
        (resp) => {
          this.notifList = resp;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  openForm(formId) {
    this.router.navigate([`/form-leave/preview/${formId}`]);
  }

  pageChange(rutePage){
    this.router.navigate([rutePage]);
  }

  TemporaryLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('name');
    this.router.navigate(['/auth/login']);
  }

  getCurrentRoutes() {
    // this.currRoute = this._route.snapshot.params
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
