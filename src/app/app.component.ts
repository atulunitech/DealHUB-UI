import { Component } from '@angular/core';
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

  constructor(private bnIdle: BnNgIdleService,private router:Router,private _commomservices:CommonService,private dialog:MatDialog) {
 
  }
 
  // initiate it in your component OnInit
  ngOnInit(): void {
   // alert("Hello from app component");
  //  if(localStorage.getItem("Token") == "")
  //  {
  //   this.router.navigateByUrl('/login'); 
  //  }
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        if(localStorage.getItem("rememberCurrentUser") != "true")
        {
          let data =new MenuModel();
          data._user_code = localStorage.getItem("UserCode");
         data.token = localStorage.getItem("Token");
          this._commomservices.deletetoken(data).subscribe(data =>{
         let res = JSON.parse(data);
      if(res.result == "Success")
      {
       // alert("Token deleted");
       this.dialog.closeAll();
        localStorage.setItem("UserCode","");
        localStorage.setItem("Token","");
        this.router.navigate(['/']);
      }
    });  
        }
      }
    });
  }
}
