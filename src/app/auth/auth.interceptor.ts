import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpErrorResponse,HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { request } from "node:http";
import { Observable } from "rxjs";
import {catchError,map, tap,finalize} from "rxjs/operators";
import { CommonService } from "../services/common.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, public commonService:CommonService,public dialog:MatDialog) { }
  
    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      this.commonService.show();
        if (req.headers.get('No-Auth') == "True")
        {
          setTimeout(() => {
            this.commonService.hide();
          }, 3000);
          
            return next.handle(req.clone());
            
        }
        else
        {
            if (localStorage.getItem('userToken') != null) {
                const headers = new HttpHeaders({
                    'Authorization': "Bearer " + localStorage.getItem('Token'),
                    '_user_login': localStorage.getItem("UserCode"),
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
                     
                      (error:any) => {
                        // if (error.status === 401)
                        console.log("redirected here even token is not null");
                        console.log(clonedreq);
                        console.log(error);
                        console.log(error.type);
                      
                        if (error instanceof HttpErrorResponse) {
                            if (error.status != 200) {
                                //this.router.navigateByUrl('/login');
                            }
                          }

                           
                    }
                    )
                  );
            }
            else {
                console.log("redirected here as usertoken is null");
                // this.router.navigateByUrl('/login');
            }
        }
         

       
        return next.handle(req).pipe(
            finalize(() => {
            //  this.dialog.closeAll();
            setTimeout(() => {
              this.commonService.hide();
            }, 3000);
            
            })
          );
    }
}