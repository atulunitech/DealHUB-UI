import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { CommonService } from './services/common.service';
import { MenuModel } from './shared/side-nave/side-nave.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DealHUB-UI';

  constructor(private bnIdle: BnNgIdleService,private router:Router,private _commomservices:CommonService,public dialog:MatDialog) {
 
  }

  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //     let data =new MenuModel();
  //         data._user_code = localStorage.getItem("UserCode");
  //        data.token = localStorage.getItem("Token");
  //         this._commomservices.deletetoken(data).subscribe(data =>{
  //        let res = JSON.parse(data);
  //     if(res.result == "Success")
  //     {
  //      // alert("Token deleted");
  //      localStorage.setItem("UserCode","");
  //      localStorage.setItem("Token","");
  //      localStorage.setItem("RequestId","");
  //      localStorage.setItem("userToken","");
  //       this.router.navigate(['/']);
  //     }
  //   });  
  // }
 
  // initiate it in your component OnInit
  ngOnInit(): void {
   // alert("Hello from app component");
  //  if(localStorage.getItem("Token") == "")
  //  {
  //   this.router.navigateByUrl('/login'); 
  //  }
  //-----------------------------------------------------------------
  // window.onbeforeunload = () => {
  //   let data =new MenuModel();
  //         data._user_code = localStorage.getItem("UserCode");
  //        data.token = localStorage.getItem("Token");
  //         this._commomservices.deletetoken(data).subscribe(data =>{
  //        let res = JSON.parse(data);
  //     if(res.result == "Success")
  //     {
  //      // alert("Token deleted");
  //      localStorage.setItem("UserCode","");
  //      localStorage.setItem("Token","");
  //      localStorage.setItem("RequestId","");
  //      localStorage.setItem("userToken","");
  //       this.router.navigate(['/']);
  //     }
  //   });  
  // }
  
    this.bnIdle.startWatching(300).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if(localStorage.getItem("rememberCurrentUser") != "true")
        {
          let data =new MenuModel();
          data._user_code = localStorage.getItem("UserCode");
         data.token = localStorage.getItem("Token");
         if(localStorage.getItem("Token").toString() != "")
         {
          this._commomservices.deletetoken(data).subscribe(data =>{
         let res = JSON.parse(data);
      if(res.result == "Success")
      {
       // alert("Token deleted");
       this.dialog.closeAll();
       localStorage.setItem("UserCode","");
       localStorage.setItem("Token","");
       localStorage.setItem("RequestId","");
       localStorage.setItem("userToken","");
        this.router.navigate(['/']);
      }
    });  
  }
        }
      }
    });

    // window.addEventListener('storage', (event) => {
    //   if (event.storageArea == localStorage) {
    //     let token = localStorage.getItem('Token');
    //     if(token == undefined || token == "") { // you can update this as per your key
    //         // DO LOGOUT FROM THIS TAB AS WELL
    //         alert("logout");
    //         this.router.navigate(['/']); // If you are using router
    //         // OR
    //         //window.location.href = '<home page URL>';
    //     }
    //   }
    // }, false);
  }

  
}
