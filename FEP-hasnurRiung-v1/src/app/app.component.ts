import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'STOPLESS';
  // name = 'Angular ' + VERSION.major;
  constructor() {}
  ngOnInit() {
    let sidebar = document.querySelector('.sidebar');
    let closeBtn = document.querySelector('#btn');
    let searchBtn = document.querySelector('.bx-search');

    closeBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      menuBtnChange(); //calling the function(optional)
    });

    searchBtn.addEventListener('click', () => {
      // Sidebar open when you click on the search iocn
      sidebar.classList.toggle('open');
      menuBtnChange(); //calling the function(optional)
    });

    // following are the code to change sidebar button(optional)
    function menuBtnChange() {
      if (sidebar.classList.contains('open')) {
        closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right'); //replacing the iocns class
      } else {
        closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu'); //replacing the iocns class
      }
    }
  }
}
