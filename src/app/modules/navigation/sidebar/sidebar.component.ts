import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NgIf, RouterModule, NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('sidebar') sidebar: ElementRef | undefined;
  @ViewChild('iconButtonOpen') iconButtonOpen: ElementRef | undefined;

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width < 1024) {
      this.showMobile = true;
    } else {
      this.showMobile = false;
    }
  }
  showMobile: boolean = false;
  isOpen: boolean = false;

  subs: SubSink = new SubSink();
  isWaitingForResponse: boolean = false;

  navigationMenu = [
    {
      _id: 'approval-group',
      name: 'Approval Group',
      link: '/approval-group',
      icon: 'bx bxs-group',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: '',
    },
    {
      _id: 'approval-table',
      name: 'Approval ST Istirahat',
      link: '/approval-table/leave',
      icon: 'bx bxs-badge-check',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: '',
    },
    {
      _id: 'approval-table-work',
      name: 'Approval ST Lapangan',
      link: '/approval-table/work',
      icon: 'bx bxs-badge-check',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: '',
    },
    {
      _id: 'permit-leave',
      name: 'Tugas Istirahat',
      link: '/permit-leave',
      icon: 'bx bx-calendar',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: '',
    },
    {
      _id: 'permit-work',
      name: 'Tugas Lapangan',
      link: '/permit-work',
      icon: 'bx bx-calendar',
      textClass: 'links_name font-semibold',
      tooltipClass: 'tooltip',
      src: '',
    },
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private _navigation: NavigationService
  ) {}

  ngOnInit(): void {
    this.subs.sink = this._navigation?.sidebarToggleListener$?.subscribe(() => {
      this.toggleSidebar();
    });
  }

  ngAfterViewInit() {
    this.listenToRouteChanges();
    if (window?.innerWidth < 1024) {
      this.showMobile = true;
    } else {
      this.showMobile = false;
    }
  }

  listenToRouteChanges() {
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isWaitingForResponse = false;
        if (this.showMobile) {
          this.toggleSidebar();
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  toggleSidebar() {
    if (this.sidebar) {
      if (this.showMobile) {
        this.sidebar.nativeElement.classList.toggle('-ml-80');
        this.isOpen = !this.isOpen;
      } else {
        this.sidebar.nativeElement.classList.toggle('open');
      }
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

  TemporaryLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('name');
    this.router.navigate(['/auth/login']);
  }
}
