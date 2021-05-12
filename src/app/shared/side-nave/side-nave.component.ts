import { Component, OnInit } from '@angular/core';
import {SidenavService} from './side-nave.services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

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


  menus:any=null;
  _menumodel:MenuModel=new MenuModel();
  // signle open mode
  config = { multi: false };
  options = { multi: false };
 
  ngOnInit(): void {
    this.config = this.mergeConfig(this.options);
    //this.GetMenus();
    this.menus = [
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
       name: 'Logout',
       iconClass: 'log_out_icon.png',
       url: "javascript:void(0)",
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
 
  Logout()
  {
    localStorage.setItem("UserName","");
    localStorage.setItem("Token","");
    this.router.navigate(['/']);  
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
    if(this.menus[index].name=='Logout')
    {
        this.Logout();
    }

  }
  constructor(private menuservice:SidenavService,private router: Router) { }
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
