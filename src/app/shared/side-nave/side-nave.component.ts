import { Component, OnInit } from '@angular/core';
import {SidenavService} from './side-nave.services';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

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
    // alert("Hello from Side Navigation");
    
    this.config = this.mergeConfig(this.options);
    //this.GetMenus();
    this.menus = [
      { 
        name: "Dashboard",
        Role:null,
        iconClass: 'dashboard_icon.png',
        url:"/DealHUB/dashboard",
        active: true,
      },
       { 
         name: "Masters",
         Role:null,
         iconClass: 'masters.png',
         url:"/DealHUB/master",
         active: false,
       },
      { 
       name: 'Change Password',
       Role:null,
       iconClass: 'change_pass_icon.png',
       url:"/DealHUB/dashboard",
       active: false,
     },
     { 
       name: 'Logout',
       Role:null,
       iconClass: 'log_out_icon_new.png',
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

  resetpassword()
  {
    this._commomservices.resetclicked.next(true);
  }
 
  Logout()
  {
    let data =new MenuModel();
    data._user_code = this._commomservices.setEncryption(this._commomservices.commonkey,localStorage.getItem('UserCode'));
    data.token = localStorage.getItem("Token");
    this._commomservices.deletetoken(data).subscribe(data =>{
      let res = JSON.parse(data);
      if(res.result == "Success")
      {
        //alert("Token deleted");
      //  localStorage.setItem("UserCode","");
        localStorage.setItem("Token","");
        localStorage.setItem("RequestId","");
        localStorage.setItem("userToken","");
        this.router.navigate(['/']);
      }
    });  
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
    
    if(this.menus[index].name=='Change Password')
    {
     
        this.resetpassword();
    }

  }
  constructor(private menuservice:SidenavService,private router: Router,public _commomservices:CommonService) { }
  GetMenus()
  {
    this._menumodel._user_code=localStorage.getItem("UserCode");
    this._menumodel.token=localStorage.getItem("Token");
    this.menuservice.GetMenus(this._menumodel).subscribe(Result=>{
  
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
    
      if (error.status==401)
      {
      //  this.router.navigateByUrl('/login');
      }
      
    }
    );

  }
}
