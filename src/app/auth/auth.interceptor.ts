import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpErrorResponse,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { request } from "node:http";
import { Observable } from "rxjs";
import {catchError,map, tap,finalize} from "rxjs/operators";
import { CommonService } from "../services/common.service";
import { MessageBoxComponent } from "../shared/MessageBox/MessageBox.Component";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, public commonService:CommonService,private _mesgBox: MessageBoxComponent) { }
  
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      this.commonService.show();
        if (req.headers.get('No-Auth') == "True")
        {
          this.commonService.hide();
            return next.handle(req.clone());
            
        }
        else
        {
            if (localStorage.getItem('userToken') != null) {
                const headers = new HttpHeaders({
                    'Authorization': "Bearer " + localStorage.getItem('Token'),
                    '_user_login': localStorage.getItem("UserCode"),
                    '_RequestId': localStorage.getItem("RequestId"),
                    'Content-Type': 'application/json'
                  });
                const clonedreq = req.clone({
                    //headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('Token'))
                    headers
                });
                this.commonService.hide();
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
                                localStorage.setItem("UserCode","");
                                localStorage.setItem("Token","");
                                localStorage.setItem("RequestId","");
                                localStorage.setItem("userToken","");
                                this._mesgBox.showError("Unauthorized access");
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
                            localStorage.setItem("UserCode","");
                            localStorage.setItem("Token","");
                            localStorage.setItem("RequestId","");
                            localStorage.setItem("userToken","");
                            this._mesgBox.showError("Unauthorized access");
                            this.router.navigateByUrl('/login');
                          }

                          if(error.status === 400)
                          {
                            //alert("400 error occured");
                            //alert(error.message);
                            //this._mesgBox.showError("Technical Error");
                            this._mesgBox.showError(error.error.Record.MESSAGE);
                          }
                            //this.router.navigateByUrl('/login');
                        }
                      }
                      return error;
                    })
                  );
            }
            else {
                console.log("redirected here as usertoken is null");
                // this.router.navigateByUrl('/login');
            }
        }
         

       
        return next.handle(req).pipe(
            finalize(() => {
              this.commonService.hide();
              this.commonService.resetclicked.next(false);
            })
          );
    }
}