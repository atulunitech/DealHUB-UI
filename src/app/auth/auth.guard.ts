import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageBoxComponent } from '../shared/MessageBox/MessageBox.Component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,CanActivateChild {
  constructor(private router:Router,private _mesgBox: MessageBoxComponent)
  {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   //alert(childRoute.url[0].path);
    if(localStorage.getItem("Token") == "")
   {
     this.router.navigateByUrl('/login'); 
     return false;
    }
    else
    {
      if(childRoute.url[0] != undefined && childRoute.url[0].path == "Obf")
      {
        // if(localStorage.getItem("privilege_name") == "OBF Initiator" || (localStorage.getItem("privilege_name") == "PPL Initiator" && childRoute.queryParams.isppl == "Y"))
        if(localStorage.getItem("privilege_name") == "OBF Initiator" || (localStorage.getItem("privilege_name") == "PPL Initiator"))
        {
        return true;
         }
        else
        {
         // localStorage.setItem("UserCode","");
                            localStorage.setItem("Token","");
                            localStorage.setItem("RequestId","");
                            localStorage.setItem("userToken","");
          this._mesgBox.showError("Unauthorized access.");
          this.router.navigateByUrl('/login'); 
        return false;
      }

      }
      
      return true;
    }
    // if(localStorage.getItem('Token') != null)
    //   {
    //     return true;
    //   }
    //   else
    //   {
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
     //return true;
      
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      if(localStorage.getItem("Token") == "")
   {
     this.router.navigateByUrl('/login'); 
     return false;
    }
    else{
      return true;
    }
      // if(localStorage.getItem('Token') != null)
      // {
      //   return true;
      // }
      // else
      // {
      //   this.router.navigate(['/login']);
      //   return false;
      // }
     // return true;
  }
  
}
