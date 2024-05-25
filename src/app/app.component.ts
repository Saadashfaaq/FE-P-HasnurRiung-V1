import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
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
  title = 'STOPLESS';
  showSideBar: boolean = true;
  userName: string = '';
  @ViewChild('sidebar') sidebar: ElementRef | undefined;
  @ViewChild('iconButtonOpen') iconButtonOpen: ElementRef | undefined;

  subs: SubSink = new SubSink();
  firstTime: boolean = true;

  currRoute: string;

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
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.currRoute = event?.url;
        if (event.url.includes('auth') || event.url.includes('data-validation') || event.url.includes('form-leave') || event.url.includes('form-permit')){
          this.showSideBar = false;
          this.changeDetectorRef.detectChanges();
        } else {
          this.showSideBar = true;
          this.changeDetectorRef.detectChanges();
          // this.sidebar.nativeElement.addEventListener('click', (event: MouseEvent) => {
          //   const target = event.target as HTMLElement;

          //   if (target && target.classList.contains('bx-menu')) {
          //     this.toggleSidebar();
          //   } else {
          //     this.toggleSidebar();
          //   }
          // });
        }
        this.sideBarInitialization();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  private sidebarClickHandler(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('bx-menu')) {
      this.toggleSidebar();
    } else {
      this.toggleSidebar();
    }
  }

  sideBarInitialization() {
    if (this.sidebar) {
      this.iconButtonOpen.nativeElement.removeEventListener(
        'click',
        this.sidebarClickHandler
      );
      this.sidebarClickHandler = this.sidebarClickHandler.bind(this);
      this.iconButtonOpen.nativeElement.addEventListener(
        'click',
        this.sidebarClickHandler
      );
    }
  }

  toggleSidebar() {
    if (this.sidebar) {
      this.sidebar.nativeElement.classList.toggle('open');
      this.menuBtnChange();
    }
  }

  menuBtnChange() {
    if (this.sidebar && this.sidebar.nativeElement.classList.contains('open')) {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu');
      closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right');
    } else {
      const closeBtn =
        this.sidebar.nativeElement.querySelector('.bx-menu-alt-right');
      closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');
    }
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
