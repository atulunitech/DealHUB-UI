import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nave',
  templateUrl: './side-nave.component.html',
  styleUrls: ['./side-nave.component.scss']
})
export class SideNaveComponent implements OnInit {



  // signle open mode
  config = { multi: false };
  options = { multi: false };
  menus = [
   { 
     name: 'User Id',
     iconClass: 'user_icon.png',
     url:"javascript:void(0)",
     active: true,
   },
   { 
    name: 'Menu 1',
    iconClass: 'user_login_icon.png',
    url:"javascript:void(0)",
    active: false,
  },
  { 
    name: 'Menu 1',
    iconClass: 'log_out_icon.png',
    url:"javascript:void(0)",
    active: false,
  }
  //  { 
  //    name: 'Menu 2',
  //    iconClass: 'fa fa-mobile',
  //    active: false,
  //    submenu: [
  //      { name: 'Sub Menu 2', url: '#' },
  //      { name: 'Sub Menu 2', url: '#' },
  //      { name: 'Sub Menu 2', url: '#' }
  //    ]
  //  },
  //  { 
  //    name: 'Menu 3',
  //    iconClass: 'fa fa-globe',
  //    active: false,
  //    submenu: [
  //      { name: 'Sub Menu 3', url: '#' },
  //      { name: 'Sub Menu 3', url: '#' },
  //      { name: 'Sub Menu 3', url: '#' }
  //    ]
  //  },
  //  { 
  //    name: 'Menu 4',
  //    iconClass: 'fa fa-globe',
  //    active: false
  //  }
 ];

  ngOnInit(): void {
    this.config = this.mergeConfig(this.options);
  }
  mergeConfig(options) {
 
    const config = {
      // selector: '#accordion',
      multi: true
    };

    return { ...config, ...options };
  }

  toggle(index: number) {
   
    if (!this.config.multi) {
      this.menus.filter(
        (menu, i) => i !== index && menu.active
      ).forEach(menu => menu.active = !menu.active);
    }


    this.menus[index].active = !this.menus[index].active;
  }
  constructor() { }
 
}
