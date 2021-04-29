import { Component, OnInit } from '@angular/core';
import {SidenavService} from './side-nave.services';
import { HttpErrorResponse } from '@angular/common/http';
export class MenuModel
{
  _user_code:any;
  token:any;

}
@Component({
  selector: 'app-side-nave',
  templateUrl: './side-nave.component.html',
  styleUrls: ['./side-nave.component.scss']
})
export class SideNaveComponent implements OnInit {



  // signle open mode
  config = { multi: false };
  options = { multi: false };
 
  _menumodel:MenuModel=new MenuModel();
  menus:any=null;
  
  ngOnInit(): void {
    this.config = this.mergeConfig(this.options);
    this.GetMenus();
    this.menus = [
      { 
        name: 'User Id',
        iconClass: 'fas fa-user-astronaut',
        url:"javascript:void(0)",
        active: true,
      },
      { 
       name: 'Menu 1',
       iconClass: 'fas fa-lock',
       url:"javascript:void(0)",
       active: false,
     },
     { 
       name: 'Menu 1',
       iconClass: 'fas fa-sign-out-alt',
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
  constructor(private menuservice:SidenavService) { }
  GetMenus()
  {
    this._menumodel._user_code=localStorage.getItem("UserName");
    this._menumodel.token=localStorage.getItem("Token");
    this.menuservice.GetMenus(this._menumodel).subscribe(Result=>{
    debugger;
     console.log("Menus");
     console.log(Result);
     var loginresult =Result;
     var tempmenu=JSON.parse(Result);
     this.menus=tempmenu;
    //  for (var i=0;i<tempmenu.length;i++)
    //  {
    //    this.menus=tempmenu;
    //   this.menus[i].push(tempmenu[i]);
    //  }
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
      //  this.router.navigateByUrl('/login');
      }
      
    }
    );

  }
}
