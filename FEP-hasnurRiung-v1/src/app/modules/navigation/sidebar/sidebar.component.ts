import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { FormLeaveService } from 'src/app/services/form-leave/form-leave.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  title = 'STOPLESS';
  showSideBar: boolean = true;
  userName : string = ''
  @ViewChild('sidebar') sidebar: ElementRef | undefined;
  subs: SubSink = new SubSink();
  employeeId: string;
  

  constructor(
    private router: Router,
    private _formLeaveService : FormLeaveService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log("NavigationStart", event)
        if (event.url.includes('auth')) {
          this.showSideBar = false;
        } else {
          this.showSideBar = true;
          this.userName =  localStorage.getItem('name')
          setTimeout(() => {
            this.Init()
          }, 50);
          
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
    this.getAllNotificationList()
    this.userName =  localStorage.getItem('name')
    if(this.showSideBar){
      setTimeout(() => {
        this.Init()
      }, 50);
    }
 }
  getAllNotificationList() {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.userName =  localStorage.getItem('name')
    this.Init()
  }

  Init(){
    console.log("ngAfterViewInit called");
    if (this.sidebar) {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu');
      const searchBtn = this.sidebar.nativeElement.querySelector('.bx-search');

      closeBtn.addEventListener('click', () => {
        this.toggleSidebar();
      });

      searchBtn.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
  }

  toggleSidebar() {
    console.log("toggleSidebar called");
    if (this.sidebar) {
      this.sidebar.nativeElement.classList.toggle('open');
      this.menuBtnChange();
    }
  }

  menuBtnChange() {
    if (this.sidebar && this.sidebar.nativeElement.classList.contains('open')) {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu');
      closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right');
    } else if (this.sidebar) {
      const closeBtn = this.sidebar.nativeElement.querySelector('.bx-menu-alt-right');
      closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');
    }
  }

  TemporaryLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('name');
    this.router.navigate(['/auth/login'])
  }
}
