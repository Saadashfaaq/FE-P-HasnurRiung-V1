import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { FormLeaveService } from './services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'STOPLESS';
  showSideBar: boolean = true;
  userName : string = ''
  @ViewChild('sidebar') sidebar: ElementRef | undefined;
  subs: SubSink = new SubSink();
  firstTime: boolean = true


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private _formLeaveService : FormLeaveService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log("NavigationStart", event)
        if (event.url.includes('auth') || event.url.includes('barcode-form')) {
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
      }

      if (event instanceof NavigationEnd) {
        console.log("NavigationEnd", event)
      }

      if (event instanceof NavigationError) {
        console.log("NavigationError", event)
        console.log(event.error);
      }
    });
  }

ngOnInit(): void {
  this.employeeId = localStorage.getItem('userProfile');
  this.userName = localStorage.getItem('name');

  if (this.showSideBar) {
    this.changeDetectorRef.detectChanges();
    this.sidebar.nativeElement.removeEventListener('click', this.sidebarClickHandler);
    this.sidebarClickHandler = this.sidebarClickHandler.bind(this);
    this.sidebar.nativeElement.addEventListener('click', this.sidebarClickHandler);
  }
}

ngAfterViewInit() {
  if (this.sidebar) {
    this.changeDetectorRef.detectChanges();
    this.sidebar.nativeElement.removeEventListener('click', this.sidebarClickHandler);
    this.sidebarClickHandler = this.sidebarClickHandler.bind(this);
    this.sidebar.nativeElement.addEventListener('click', this.sidebarClickHandler);
  }
}

private sidebarClickHandler(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target && target.classList.contains('bx-menu')) {
    this.toggleSidebar();
  } else {
    this.toggleSidebar();
  }
}

  Init(){
    console.log("ngAfterViewInit called");
    if (this.sidebar) {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu');
      const searchBtn = this.sidebar.nativeElement.querySelector('.bx-search');

      closeBtn.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
  }

  toggleSidebar() {
    if (this.sidebar) {
      console.log("toggleSidebar called");
      this.sidebar.nativeElement.classList.toggle('open');
      this.menuBtnChange();
      console.log("3")
    }
  }

  menuBtnChange() {
    if (this.sidebar && this.sidebar.nativeElement.classList.contains('open')) {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu');
      closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right');
      console.log("A1")
    } else  {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu-alt-right');
      closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');
      console.log("A2")
    }
  }

  notifList
  employeeId

  getAllNotificationList(){
    this.subs.sink = this._formLeaveService.GetAllNotifications(this.employeeId)
     .subscribe(
      (resp)=>{
        this.notifList = resp
      },
      (err)=>{
        console.error(err)
      }
     )
  }

  openForm(formId){
    this.router.navigate([`/form-leave/preview/${formId}`])
  }

  TemporaryLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('name');
    this.router.navigate(['/auth/login'])
  }

}
