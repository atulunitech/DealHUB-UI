import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,CanActivateChild {
  constructor(private router:Router)
  {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   
    // if(localStorage.getItem('Token') != null)
    //   {
    //     return true;
    //   }
    //   else
    //   {
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
     return true;
      
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // if(localStorage.getItem('Token') != null)
      // {
      //   return true;
      // }
      // else
      // {
      //   this.router.navigate(['/login']);
      //   return false;
      // }
      return true;
  }
  
}
