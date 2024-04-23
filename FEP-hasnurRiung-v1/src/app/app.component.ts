import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

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

  constructor(private router: Router) {
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
    this.userName =  localStorage.getItem('name')
    if(this.showSideBar){
      setTimeout(() => {
        this.Init()
      }, 50);
    }
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
