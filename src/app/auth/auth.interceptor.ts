import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpErrorResponse,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { request } from "node:http";
import { Observable, throwError } from "rxjs";
import {catchError,map, tap,finalize} from "rxjs/operators";
import { CommonService } from "../services/common.service";
import { MessageBoxComponent } from "../shared/MessageBox/MessageBox.Component";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, public commonService:CommonService,private _mesgBox: MessageBoxComponent,public dialog:MatDialog) { }
  
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      this.commonService.show();
        if (req.headers.get('No-Auth') == "True")
        {
          setTimeout(() => {
            this.commonService.hide();
          }, 3500);
          
            return next.handle(req.clone());
            
        }
        else
        {
          let encryptedusercode = this.commonService.setEncryption(this.commonService.commonkey,localStorage.getItem('UserCode'));
            if (localStorage.getItem('userToken') != null) {
                const headers = new HttpHeaders({
                    'Authorization': "Bearer " + localStorage.getItem('Token'),
                    // '_user_login': localStorage.getItem("UserCode"),
                    '_user_login':encryptedusercode,
                    '_RequestId': localStorage.getItem("RequestId"),
                    'Content-Type': 'application/json'
                  });
                const clonedreq = req.clone({
                    //headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('Token'))
                    headers
                });
                setTimeout(() => {
                  this.commonService.hide();
                }, 3000);
                
                return next.handle(clonedreq).pipe(
                    tap(
                      //this._commomservices.resetclicked.next(false);
                      
                      (error:any) => {
                        // if (error.status === 401)
                        console.log("redirected here even token is not null");
                        console.log(clonedreq);
                        console.log(error);
                        console.log(error.type);
                        
                        if(error instanceof HttpErrorResponse) {
                            if(error.status != 200) {
                              if(error.status === 401)
                              {
                               // localStorage.setItem("UserCode","");
                                localStorage.setItem("Token","");
                                localStorage.setItem("RequestId","");
                                localStorage.setItem("userToken","");
                                this._mesgBox.showError("Unauthorized access 401 tap");
                                this.router.navigateByUrl('/login');
                              }
                                //this.router.navigateByUrl('/login');
                            }
                          }

                           
                    }
                    ),
                    catchError((error:any)=>{
                      if(error instanceof HttpErrorResponse) {
                        if(error.status != 200) {
                          if(error.status === 401)
                          {
                           // localStorage.setItem("UserCode","");
                            localStorage.setItem("Token","");
                            localStorage.setItem("RequestId","");
                            localStorage.setItem("userToken","");
                            this._mesgBox.showError("Unauthorized access.");
                            this.router.navigateByUrl('/login');
                          }

                          if(error.status === 400 || error.status === 429)
                          {
                            //alert("400 error occured");
                            //alert(error.message);
                            //this._mesgBox.showError("Technical Error");
                            this._mesgBox.showError(error.error.Record.MESSAGE);
                            return throwError(error);
                          }

                          if(error.status === 500)
                          {
                            //alert("400 error occured");
                            //alert(error.message);
                            this._mesgBox.showError("Technical Error");
                          }

                          // if(error.status === 429)
                          // {
                          //   this._mesgBox.showError(error.message);
                          // }
                            //this.router.navigateByUrl('/login');
                        }
                      }
                      return error;
                    })
                  );
            }
            else {
              localStorage.setItem("UserCode","");
                            localStorage.setItem("Token","");
                            localStorage.setItem("RequestId","");
                            localStorage.setItem("userToken","");
             // this._mesgBox.showError("Unauthorized access local storage");
              this.router.navigateByUrl('/login');
                // this.router.navigateByUrl('/login');
            }
        }
         

       
        return next.handle(req).pipe(
            finalize(() => {
              
              this.dialog.closeAll();
             
              this.commonService.resetclicked.next(false);
            //  this.dialog.closeAll();
            setTimeout(() => {
              this.commonService.hide();
            }, 3000);
            
            })
          );
    }
}