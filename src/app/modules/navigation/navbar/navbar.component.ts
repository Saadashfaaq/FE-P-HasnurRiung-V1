import { NgIf } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { DekstopNavbarComponent } from "./dekstop-navbar/dekstop-navbar.component";
import { MobileNavbarComponent } from "./mobile-navbar/mobile-navbar.component";

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    imports: [NgIf, DekstopNavbarComponent, MobileNavbarComponent]
})
export class NavbarComponent implements OnInit {
  isShowMobile: boolean = true;

  constructor() {}
  ngOnInit(): void {
    if (window?.innerWidth < 1024) {
      this.isShowMobile = true;
    } else {
      this.isShowMobile = false;
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width < 1024) {
      this.isShowMobile = true;
    } else {
      this.isShowMobile = false;
    }
  }
}
